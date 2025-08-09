// backend/routes/analytics.js
const express = require('express');
const router = express.Router();
const submissionsStore = require('../stores/submissionsStore');

/**
 GET /analytics
 Returns aggregated metrics from in-memory store:
  - totalSubmissions
  - lessonsCompletionCount
  - averageSentimentScore
  - topFailedTasks
*/
router.get('/', (req, res) => {
  try {
    const all = submissionsStore.getAllSubmissions();
    const totalSubmissions = all.length;
    const avgSentiment = totalSubmissions ? (all.reduce((s,x)=>s + (x.sentimentScore||0),0) / totalSubmissions) : 0;

    // lessons completion by lessonId (count where completed true)
    const lessonCompletion = {};
    all.forEach(s => {
      if (!s || !s.lessonId) return;
      const key = s.lessonId;
      if (!lessonCompletion[key]) lessonCompletion[key] = { completions: 0, tries: 0 };
      lessonCompletion[key].tries += 1;
      const allPassed = s.results && Array.isArray(s.results) && s.results.every(r => r.passed);
      if (allPassed) lessonCompletion[key].completions += 1;
    });

    // top failed tasks (by fail count)
    const taskFails = {};
    all.forEach(s => {
      if (!s || !s.results || !Array.isArray(s.results)) return;
      s.results.forEach(r => {
        if (!r.passed) {
          const key = `${s.lessonId}::${s.taskId}::${r.testId || r.name || 'test'}`;
          taskFails[key] = (taskFails[key] || 0) + 1;
        }
      });
    });

    const topFailed = Object.entries(taskFails)
      .sort((a,b)=>b[1]-a[1])
      .slice(0,10)
      .map(([k,v])=>({ key:k, fails:v }));

    res.json({
      totalSubmissions,
      avgSentiment,
      lessonCompletion,
      topFailed
    });
  } catch (err) {
    console.error('Error in analytics:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

module.exports = router;

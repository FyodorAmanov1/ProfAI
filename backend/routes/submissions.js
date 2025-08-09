// backend/routes/submissions.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const { runTests } = require('../services/grader');
const { analyzeSentiment } = require('../services/sentiment');
const { LESSONS } = require('../data/lessons');
const submissionsStore = require('../stores/submissionsStore');

/**
 Expected POST body:
 {
   lessonId: string,
   taskId: string,
   code: string,
   userId: string
 }
 Response:
 {
   success: true,
   submission: { submissionId, lessonId, taskId, userId, code, results, sentimentScore, createdAt, progress }
 }
*/

router.post('/', async (req, res) => {
  const { lessonId, taskId, code, userId } = req.body;
  if (!lessonId || !taskId || !code || !userId) {
    return res.status(400).json({ error: 'Missing required fields: lessonId, taskId, code, userId' });
  }

  const lesson = LESSONS.find(l => l.id === lessonId);
  if (!lesson) return res.status(400).json({ error: 'Invalid lessonId' });

  const task = (lesson.tasks || []).find(t => t.id === taskId);
  if (!task) return res.status(400).json({ error: 'Invalid taskId' });

  try {
    // 1) Run grader (synchronous JS grader)
    const results = await runTests(task.tests || [], code);

    // 2) Sentiment score (basic text sentiment over code/comments)
    const sentimentScore = analyzeSentiment(code);

    // 3) Build submission object
    const submission = {
      submissionId: uuidv4(),
      lessonId,
      taskId,
      code,
      userId,
      results, // array of test results
      sentimentScore,
      createdAt: new Date().toISOString()
    };

    // 4) Save in-memory (no DB)
    submissionsStore.saveSubmission(submission);

    // 5) Compute simple progress object: completed if all tests pass
    const allPassed = Array.isArray(results) && results.every(r => r.passed === true);
    const progress = {
      userId,
      lessonId,
      taskId,
      completed: allPassed,
      completedAt: allPassed ? submission.createdAt : null
    };

    // update in-memory user progress store
    submissionsStore.updateProgress(userId, progress);

    res.json({ success: true, submission: { ...submission, progress } });
  } catch (err) {
    console.error('submission error:', err);
    res.status(500).json({ error: 'Internal server error', details: (err && err.message) || '' });
  }
});

module.exports = router;

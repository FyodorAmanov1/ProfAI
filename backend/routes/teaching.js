// backend/routes/teaching.js
const express = require('express');
const router = express.Router();
const { LESSONS } = require('../data/lessons');
const { generateExplanation, generatePlacementTest, generatePracticeTask } = require('../services/ai');

// In-memory store for user levels and placement tests
const userLevels = new Map();
const activePlacementTests = new Map();

// POST /ask - Get AI explanation for a lesson question
router.post('/ask', async (req, res) => {
  const { lessonId, question, userId } = req.body;
  
  if (!lessonId || !question || !userId) {
    return res.status(400).json({ error: 'Missing required fields: lessonId, question, userId' });
  }

  const lesson = LESSONS.find(l => l.id === lessonId);
  if (!lesson) {
    return res.status(400).json({ error: 'Invalid lessonId' });
  }

  try {
    const explanation = await generateExplanation(lesson, question);
    res.json({ success: true, explanation });
  } catch (err) {
    console.error('AI explanation error:', err);
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
});

// POST /placement-test/start - Start a placement test
router.post('/placement-test/start', async (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(400).json({ error: 'Missing required field: userId' });
  }

  try {
    const test = await generatePlacementTest();
    activePlacementTests.set(userId, test);
    res.json({ success: true, test: test.tasks });
  } catch (err) {
    console.error('Placement test generation error:', err);
    res.status(500).json({ error: 'Failed to generate placement test' });
  }
});

// POST /placement-test/submit - Submit placement test answers
router.post('/placement-test/submit', async (req, res) => {
  const { userId, answers } = req.body;
  
  if (!userId || !answers) {
    return res.status(400).json({ error: 'Missing required fields: userId, answers' });
  }

  const test = activePlacementTests.get(userId);
  if (!test) {
    return res.status(400).json({ error: 'No active placement test found' });
  }

  try {
    // Calculate score based on test results
    let totalTests = 0;
    let passedTests = 0;

    for (const task of test.tasks) {
      const answer = answers[task.id];
      if (answer && answer.results) {
        totalTests += answer.results.length;
        passedTests += answer.results.filter(r => r.passed).length;
      }
    }

    const score = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;
    
    // Determine level based on score
    let level = 'beginner';
    if (score >= 80) level = 'advanced';
    else if (score >= 40) level = 'intermediate';

    // Store user level
    userLevels.set(userId, { level, score });
    
    // Clean up
    activePlacementTests.delete(userId);

    res.json({ 
      success: true, 
      level,
      score,
      details: {
        totalTests,
        passedTests
      }
    });
  } catch (err) {
    console.error('Placement test scoring error:', err);
    res.status(500).json({ error: 'Failed to evaluate placement test' });
  }
});

// POST /generate-task - Generate a new practice task
router.post('/generate-task', async (req, res) => {
  const { topic, userId } = req.body;
  
  if (!topic || !userId) {
    return res.status(400).json({ error: 'Missing required fields: topic, userId' });
  }

  // Get user's level or default to intermediate
  const userLevel = userLevels.get(userId)?.level || 'intermediate';

  try {
    const task = await generatePracticeTask(topic, userLevel);
    res.json({ success: true, task });
  } catch (err) {
    console.error('Task generation error:', err);
    res.status(500).json({ error: 'Failed to generate practice task' });
  }
});

// GET /user/level - Get user's current level
router.get('/user/level/:userId', (req, res) => {
  const { userId } = req.params;
  const levelInfo = userLevels.get(userId);
  
  if (!levelInfo) {
    return res.status(404).json({ error: 'User level not found' });
  }

  res.json({ success: true, ...levelInfo });
});

module.exports = router;

// backend/routes/lessons.js
const express = require('express');
const router = express.Router();

// We keep LESSONS in a separate file so frontend and backend can import same data
const { LESSONS } = require('../data/lessons');

// GET /lessons
router.get('/', (req, res) => {
  res.json(LESSONS);
});

// GET /lessons/:id
router.get('/:id', (req, res) => {
  const lesson = LESSONS.find(l => l.id === req.params.id);
  if (!lesson) return res.status(404).json({ error: 'Lesson not found' });
  res.json(lesson);
});

module.exports = router;
 
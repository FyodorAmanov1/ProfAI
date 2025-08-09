// backend/data/lessons.js
// Export LESSONS to match shared variable name
const LESSONS = [
  {
    id: 'lesson-1',
    title: 'Intro: Add two numbers (JS)',
    description: 'Simple function that adds two numbers. Teaches basic input/output for graders.',
    tasks: [
      {
        id: 'task-1-1',
        title: 'Add two numbers',
        description: 'Implement solution(a, b) that returns sum.',
        tests: [
          { id: 't1', input: [1,2], expected: 3, name: '1+2' },
          { id: 't2', input: [-1,4], expected: 3, name: '-1+4' },
          { id: 't3', input: [0,0], expected: 0, name: '0+0' }
        ],
        hints: [
          { text: 'Make sure to implement function solution(a, b) and return a + b.' },
          { text: 'Edge case: ensure your function returns a number even if inputs are strings.' }
        ]
      }
    ]
  },

  // add more lessons/tasks as needed
];

module.exports = { LESSONS };

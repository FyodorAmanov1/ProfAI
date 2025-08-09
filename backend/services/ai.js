// AI service for generating explanations, hints, and tasks
// Using demo mode with predefined responses (no API key needed)

async function generateExplanation(lesson, question) {
  // Demo mode with predefined responses
  const explanations = {
    'arrays': 'Arrays are data structures that store ordered collections of items. Try breaking the problem into steps: 1) Initialize the array 2) Process each element 3) Return the result.',
    'sorting': 'When dealing with sorting, think about comparing adjacent elements and swapping them if they are in the wrong order. Start with simple cases and work your way up.',
    'recursion': 'With recursion, always identify: 1) The base case (when to stop) 2) The recursive case (how to break down the problem). Think of it like nested boxes, each containing a smaller version.',
    'default': `Here's a hint about ${lesson.title}: Try breaking down the problem into smaller steps and solve each part separately.`
  };

  const topic = Object.keys(explanations).find(key => 
    question.toLowerCase().includes(key) || lesson.title.toLowerCase().includes(key)
  ) || 'default';
  return explanations[topic];
}

async function generatePlacementTest() {
  // Demo mode with predefined test tasks
  return {
    tasks: [
      {
        id: 'pt-1',
        title: 'Basic Array Sum',
        description: 'Write a function that returns the sum of all numbers in an array.',
        tests: [
          { id: 't1', input: [[1, 2, 3]], expected: 6 },
          { id: 't2', input: [[]], expected: 0 }
        ],
        hints: [{ text: 'Try using a for loop or reduce' }]
      },
      {
        id: 'pt-2',
        title: 'String Reversal',
        description: 'Write a function that reverses a string.',
        tests: [
          { id: 't1', input: ['hello'], expected: 'olleh' },
          { id: 't2', input: [''], expected: '' }
        ],
        hints: [{ text: 'Try converting the string to an array of characters' }]
      },
      {
        id: 'pt-3',
        title: 'Find Maximum',
        description: 'Write a function that finds the largest number in an array.',
        tests: [
          { id: 't1', input: [[1, 5, 3, 9, 2]], expected: 9 },
          { id: 't2', input: [[-1, -5, -2]], expected: -1 }
        ],
        hints: [{ text: 'Consider using Math.max() or a loop with a variable to track the maximum' }]
      }
    ]
  };

}

async function generatePracticeTask(topic, level) {
  // Demo mode with predefined tasks for different topics and levels
  const tasks = {
    'arrays': {
      beginner: {
        id: 'practice-arrays-1',
        title: 'Find Element in Array',
        description: 'Write a function that checks if a number exists in an array.',
        tests: [
          { id: 't1', input: [[1, 2, 3], 2], expected: true },
          { id: 't2', input: [[1, 2, 3], 4], expected: false }
        ],
        hints: [{ text: 'Try using array.includes() or a for loop' }]
      },
      intermediate: {
        id: 'practice-arrays-2',
        title: 'Remove Duplicates',
        description: 'Write a function that removes duplicate elements from an array.',
        tests: [
          { id: 't1', input: [[1, 2, 2, 3, 3]], expected: [1, 2, 3] },
          { id: 't2', input: [[1, 1, 1]], expected: [1] }
        ],
        hints: [{ text: 'Consider using Set or filtering with indexOf' }]
      },
      advanced: {
        id: 'practice-arrays-3',
        title: 'Merge Sorted Arrays',
        description: 'Write a function that merges two sorted arrays into one sorted array.',
        tests: [
          { id: 't1', input: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6] },
          { id: 't2', input: [[1], []], expected: [1] }
        ],
        hints: [{ text: 'Try using two pointers to track positions in each array' }]
      }
    },
    'default': {
      beginner: {
        id: 'practice-default-1',
        title: `${level} Practice Task`,
        description: 'Write a function that adds two numbers.',
        tests: [
          { id: 't1', input: [2, 3], expected: 5 },
          { id: 't2', input: [-1, 1], expected: 0 }
        ],
        hints: [{ text: 'Use the + operator or basic arithmetic' }]
      },
      intermediate: {
        id: 'practice-default-2',
        title: `${level} Practice Task`,
        description: 'Write a function that checks if a string is a palindrome.',
        tests: [
          { id: 't1', input: ['radar'], expected: true },
          { id: 't2', input: ['hello'], expected: false }
        ],
        hints: [{ text: 'Try comparing characters from both ends' }]
      },
      advanced: {
        id: 'practice-default-3',
        title: `${level} Practice Task`,
        description: 'Write a function that finds prime numbers up to n.',
        tests: [
          { id: 't1', input: [10], expected: [2, 3, 5, 7] },
          { id: 't2', input: [5], expected: [2, 3, 5] }
        ],
        hints: [{ text: 'Consider using the Sieve of Eratosthenes algorithm' }]
      }
    }
  };
  const topicTasks = tasks[topic] || tasks['default'];
  return topicTasks[level] || topicTasks['intermediate'];
}

module.exports = {
  generateExplanation,
  generatePlacementTest,
  generatePracticeTask
};

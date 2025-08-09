// backend/data/lessons.js
// Export LESSONS to match shared variable name
const LESSONS = [
  {
    id: 'basic-algorithms',
    title: 'Basic Algorithms & Problem Solving',
    description: 'Learn fundamental algorithmic thinking with simple problems',
    difficulty: 'Beginner',
    tasks: [
      {
        id: 'task-sum',
        title: 'Sum Two Numbers',
        description: 'Write a function that adds two numbers together. This teaches basic function structure and return values.',
        tests: [
          { id: 't1', input: [1, 2], expected: 3, name: 'Basic addition' },
          { id: 't2', input: [-1, 4], expected: 3, name: 'Negative numbers' },
          { id: 't3', input: [0, 0], expected: 0, name: 'Zero values' },
          { id: 't4', input: [100, -50], expected: 50, name: 'Large numbers' }
        ],
        hints: [
          { text: 'Define a function called "solution" that takes two parameters.' },
          { text: 'Use the + operator to add the two parameters together.' },
          { text: 'Make sure to return the result, not just calculate it.' }
        ]
      },
      {
        id: 'task-max',
        title: 'Find Maximum',
        description: 'Write a function that returns the larger of two numbers. Introduces conditional logic.',
        tests: [
          { id: 't1', input: [5, 3], expected: 5, name: 'First larger' },
          { id: 't2', input: [2, 8], expected: 8, name: 'Second larger' },
          { id: 't3', input: [7, 7], expected: 7, name: 'Equal numbers' },
          { id: 't4', input: [-3, -1], expected: -1, name: 'Negative numbers' }
        ],
        hints: [
          { text: 'Use an if statement to compare the two numbers.' },
          { text: 'Remember that -1 is greater than -3.' },
          { text: 'You can use Math.max(a, b) or write your own comparison.' }
        ]
      }
    ]
  },
  
  {
    id: 'array-algorithms',
    title: 'Array Algorithms',
    description: 'Master array manipulation and searching techniques',
    difficulty: 'Beginner',
    tasks: [
      {
        id: 'task-array-sum',
        title: 'Array Sum',
        description: 'Calculate the sum of all numbers in an array. Learn array iteration.',
        tests: [
          { id: 't1', input: [[1, 2, 3, 4]], expected: 10, name: 'Basic sum' },
          { id: 't2', input: [[-1, 1, -2, 2]], expected: 0, name: 'Mixed signs' },
          { id: 't3', input: [[]], expected: 0, name: 'Empty array' },
          { id: 't4', input: [[5]], expected: 5, name: 'Single element' }
        ],
        hints: [
          { text: 'Use a for loop or forEach to iterate through the array.' },
          { text: 'Initialize a sum variable to 0 before the loop.' },
          { text: 'Add each array element to your sum variable.' }
        ]
      },
      {
        id: 'task-find-element',
        title: 'Find Element',
        description: 'Search for a specific element in an array and return its index.',
        tests: [
          { id: 't1', input: [[1, 2, 3, 4], 3], expected: 2, name: 'Element found' },
          { id: 't2', input: [[1, 2, 3, 4], 5], expected: -1, name: 'Element not found' },
          { id: 't3', input: [[], 1], expected: -1, name: 'Empty array' },
          { id: 't4', input: [[1, 1, 1], 1], expected: 0, name: 'First occurrence' }
        ],
        hints: [
          { text: 'Loop through the array and check each element.' },
          { text: 'Return the index when you find the target element.' },
          { text: 'Return -1 if the element is not found.' }
        ]
      },
      {
        id: 'task-reverse-array',
        title: 'Reverse Array',
        description: 'Reverse the elements of an array without using built-in reverse method.',
        tests: [
          { id: 't1', input: [[1, 2, 3, 4]], expected: [4, 3, 2, 1], name: 'Basic reverse' },
          { id: 't2', input: [[1]], expected: [1], name: 'Single element' },
          { id: 't3', input: [[]], expected: [], name: 'Empty array' },
          { id: 't4', input: [['a', 'b', 'c']], expected: ['c', 'b', 'a'], name: 'String elements' }
        ],
        hints: [
          { text: 'Create a new array to store the reversed elements.' },
          { text: 'Loop through the original array from end to beginning.' },
          { text: 'Or use two pointers approach to swap elements in place.' }
        ]
      }
    ]
  },

  {
    id: 'sorting-algorithms',
    title: 'Sorting Algorithms',
    description: 'Implement classic sorting algorithms and understand their complexity',
    difficulty: 'Intermediate',
    tasks: [
      {
        id: 'task-bubble-sort',
        title: 'Bubble Sort',
        description: 'Implement bubble sort algorithm. Learn about nested loops and swapping.',
        tests: [
          { id: 't1', input: [[64, 34, 25, 12, 22, 11, 90]], expected: [11, 12, 22, 25, 34, 64, 90], name: 'Basic sort' },
          { id: 't2', input: [[1]], expected: [1], name: 'Single element' },
          { id: 't3', input: [[]], expected: [], name: 'Empty array' },
          { id: 't4', input: [[3, 2, 1]], expected: [1, 2, 3], name: 'Reverse sorted' }
        ],
        hints: [
          { text: 'Use nested loops - outer loop for passes, inner for comparisons.' },
          { text: 'Compare adjacent elements and swap if they are in wrong order.' },
          { text: 'After each pass, the largest element "bubbles" to the end.' }
        ]
      },
      {
        id: 'task-selection-sort',
        title: 'Selection Sort',
        description: 'Implement selection sort. Find minimum element and place it at the beginning.',
        tests: [
          { id: 't1', input: [[64, 25, 12, 22, 11]], expected: [11, 12, 22, 25, 64], name: 'Basic sort' },
          { id: 't2', input: [[5, 2, 8, 1, 9]], expected: [1, 2, 5, 8, 9], name: 'Random order' },
          { id: 't3', input: [[1, 2, 3]], expected: [1, 2, 3], name: 'Already sorted' },
          { id: 't4', input: [[-1, -5, 0, 3]], expected: [-5, -1, 0, 3], name: 'Negative numbers' }
        ],
        hints: [
          { text: 'For each position, find the minimum element in the remaining array.' },
          { text: 'Swap the minimum element with the current position.' },
          { text: 'Use nested loops: outer for position, inner to find minimum.' }
        ]
      }
    ]
  },

  {
    id: 'search-algorithms',
    title: 'Search Algorithms',
    description: 'Learn efficient searching techniques including binary search',
    difficulty: 'Intermediate',
    tasks: [
      {
        id: 'task-linear-search',
        title: 'Linear Search',
        description: 'Search through an array sequentially to find a target element.',
        tests: [
          { id: 't1', input: [[1, 3, 5, 7, 9], 5], expected: 2, name: 'Element found' },
          { id: 't2', input: [[1, 3, 5, 7, 9], 6], expected: -1, name: 'Element not found' },
          { id: 't3', input: [[10], 10], expected: 0, name: 'Single element found' },
          { id: 't4', input: [[], 5], expected: -1, name: 'Empty array' }
        ],
        hints: [
          { text: 'Check each element one by one from start to end.' },
          { text: 'Return the index when target is found.' },
          { text: 'Return -1 if target is not in the array.' }
        ]
      },
      {
        id: 'task-binary-search',
        title: 'Binary Search',
        description: 'Implement binary search on a sorted array. Much faster than linear search!',
        tests: [
          { id: 't1', input: [[1, 3, 5, 7, 9, 11, 13], 7], expected: 3, name: 'Element found' },
          { id: 't2', input: [[1, 3, 5, 7, 9, 11, 13], 6], expected: -1, name: 'Element not found' },
          { id: 't3', input: [[1, 2, 3, 4, 5], 1], expected: 0, name: 'First element' },
          { id: 't4', input: [[1, 2, 3, 4, 5], 5], expected: 4, name: 'Last element' }
        ],
        hints: [
          { text: 'Use two pointers: left and right to track the search range.' },
          { text: 'Calculate middle index and compare with target.' },
          { text: 'If target is smaller, search left half. If larger, search right half.' }
        ]
      }
    ]
  },

  {
    id: 'recursion-algorithms',
    title: 'Recursion & Dynamic Programming',
    description: 'Master recursive thinking and optimization techniques',
    difficulty: 'Advanced',
    tasks: [
      {
        id: 'task-factorial',
        title: 'Factorial (Recursive)',
        description: 'Calculate factorial using recursion. Learn base cases and recursive calls.',
        tests: [
          { id: 't1', input: [5], expected: 120, name: '5! = 120' },
          { id: 't2', input: [0], expected: 1, name: '0! = 1' },
          { id: 't3', input: [1], expected: 1, name: '1! = 1' },
          { id: 't4', input: [4], expected: 24, name: '4! = 24' }
        ],
        hints: [
          { text: 'Base case: factorial of 0 or 1 is 1.' },
          { text: 'Recursive case: n! = n * (n-1)!' },
          { text: 'Make sure your function calls itself with a smaller input.' }
        ]
      },
      {
        id: 'task-fibonacci',
        title: 'Fibonacci Sequence',
        description: 'Generate Fibonacci numbers. Compare recursive vs iterative approaches.',
        tests: [
          { id: 't1', input: [0], expected: 0, name: 'F(0) = 0' },
          { id: 't2', input: [1], expected: 1, name: 'F(1) = 1' },
          { id: 't3', input: [6], expected: 8, name: 'F(6) = 8' },
          { id: 't4', input: [10], expected: 55, name: 'F(10) = 55' }
        ],
        hints: [
          { text: 'Base cases: F(0) = 0, F(1) = 1' },
          { text: 'Recursive: F(n) = F(n-1) + F(n-2)' },
          { text: 'For efficiency, consider iterative approach or memoization.' }
        ]
      }
    ]
  },

  {
    id: 'string-algorithms',
    title: 'String Algorithms',
    description: 'Work with strings and text processing algorithms',
    difficulty: 'Intermediate',
    tasks: [
      {
        id: 'task-palindrome',
        title: 'Palindrome Check',
        description: 'Check if a string reads the same forwards and backwards.',
        tests: [
          { id: 't1', input: ['racecar'], expected: true, name: 'Simple palindrome' },
          { id: 't2', input: ['hello'], expected: false, name: 'Not palindrome' },
          { id: 't3', input: ['a'], expected: true, name: 'Single character' },
          { id: 't4', input: [''], expected: true, name: 'Empty string' }
        ],
        hints: [
          { text: 'Compare characters from start and end moving inward.' },
          { text: 'Use two pointers: one at beginning, one at end.' },
          { text: 'Consider case sensitivity and spaces in real applications.' }
        ]
      },
      {
        id: 'task-anagram',
        title: 'Anagram Check',
        description: 'Check if two strings are anagrams (contain same characters).',
        tests: [
          { id: 't1', input: ['listen', 'silent'], expected: true, name: 'Valid anagrams' },
          { id: 't2', input: ['hello', 'world'], expected: false, name: 'Not anagrams' },
          { id: 't3', input: ['', ''], expected: true, name: 'Empty strings' },
          { id: 't4', input: ['abc', 'bca'], expected: true, name: 'Rearranged' }
        ],
        hints: [
          { text: 'Sort both strings and compare, or count character frequencies.' },
          { text: 'Anagrams have the same characters with same frequencies.' },
          { text: 'Consider converting to lowercase for case-insensitive comparison.' }
        ]
      }
    ]
  }
];

module.exports = { LESSONS };
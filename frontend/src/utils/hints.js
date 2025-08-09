// hints module that produces `hint.text` strings based on failure patterns
export function getHintsForTask(task) {
  // Enhanced hint database with algorithm-specific hints
  const hintDB = {
    "task-sum": [
      { text: "Define a function called 'solution' that takes two parameters (a, b)." },
      { text: "Use the + operator to add the two parameters together." },
      { text: "Make sure to return the result using the 'return' keyword." }
    ],
    "task-max": [
      { text: "Use an if statement to compare the two numbers." },
      { text: "Remember that -1 is greater than -3 when working with negative numbers." },
      { text: "You can use Math.max(a, b) or write your own comparison with if/else." }
    ],
    "task-array-sum": [
      { text: "Use a for loop or forEach to iterate through the array." },
      { text: "Initialize a sum variable to 0 before the loop starts." },
      { text: "Add each array element to your sum variable inside the loop." }
    ],
    "task-find-element": [
      { text: "Loop through the array and check each element against the target." },
      { text: "Return the index (i) when you find the target element." },
      { text: "Return -1 if you finish the loop without finding the element." }
    ],
    "task-reverse-array": [
      { text: "Create a new empty array to store the reversed elements." },
      { text: "Loop through the original array from end to beginning (i = arr.length - 1; i >= 0; i--)." },
      { text: "Push each element to your new array, or use two pointers to swap in place." }
    ],
    "task-bubble-sort": [
      { text: "Use nested loops - outer loop for passes, inner loop for comparisons." },
      { text: "Compare adjacent elements (arr[j] and arr[j+1]) and swap if they're in wrong order." },
      { text: "After each pass, the largest element 'bubbles' to the end." }
    ],
    "task-selection-sort": [
      { text: "For each position, find the minimum element in the remaining unsorted portion." },
      { text: "Swap the minimum element with the element at the current position." },
      { text: "Use nested loops: outer for current position, inner to find minimum." }
    ],
    "task-linear-search": [
      { text: "Check each element one by one from start to end of the array." },
      { text: "Return the index when you find the target element." },
      { text: "Return -1 if the target is not found in the array." }
    ],
    "task-binary-search": [
      { text: "Use two pointers: left (0) and right (array.length - 1) to track search range." },
      { text: "Calculate middle index: Math.floor((left + right) / 2)." },
      { text: "If target < middle, search left half. If target > middle, search right half." }
    ],
    "task-factorial": [
      { text: "Base case: factorial of 0 or 1 is 1. Return 1 for these cases." },
      { text: "Recursive case: n! = n * factorial(n-1)." },
      { text: "Make sure your function calls itself with a smaller input to avoid infinite recursion." }
    ],
    "task-fibonacci": [
      { text: "Base cases: F(0) = 0, F(1) = 1. Handle these first." },
      { text: "Recursive approach: F(n) = F(n-1) + F(n-2)." },
      { text: "For better performance, consider iterative approach with two variables." }
    ],
    "task-palindrome": [
      { text: "Compare characters from start and end of the string, moving inward." },
      { text: "Use two pointers: one at beginning (0), one at end (string.length - 1)." },
      { text: "Return false if any pair doesn't match, true if all pairs match." }
    ],
    "task-anagram": [
      { text: "Sort both strings and compare if they're equal after sorting." },
      { text: "Alternative: Count character frequencies in both strings and compare." },
      { text: "Anagrams have exactly the same characters with the same frequencies." }
    ]
  };
  
  return hintDB[task.id] || [
    { text: "Try breaking down the problem into smaller steps." },
    { text: "Consider edge cases like empty inputs or single elements." },
    { text: "Use console.log() to debug and see what your function is returning." }
  ];
}

/**
 * Returns the next hint (hint.text) given task and submission results.
 * Always returns { text: string, index: number }.
 */
export function getNextHint(task, submissionResults) {
  const hints = getHintsForTask(task);
  const failedCount = submissionResults.filter(r => !r.passed).length;
  
  // Progressive hint revelation based on number of failures
  const index = Math.min(failedCount - 1, hints.length - 1);
  const idx = Math.max(0, index);
  
  // If all tests pass, show success message
  if (failedCount === 0) {
    return { 
      text: "🎉 Excellent! All tests passed. You've successfully implemented the algorithm!", 
      index: -1 
    };
  }
  
  return { text: hints[idx].text, index: idx };
}
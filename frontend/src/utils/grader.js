// grade locally: run tests on student's code in a safe JS eval runner for simple JS tasks.
// Important: this is a simple grader for small exercises; production should call backend sandbox for safety.

/**
 * Enhanced local grader with better error messages and debugging support
 */
export function gradeLocally(code, task) {
  // task.tests: [{input: [...], expected: ...}, ...]
  // returns submission.results: [{ testId, passed, expected, actual, error }]
  const results = [];
  
  // Enhanced code wrapping with better error handling
  const wrapped = `
    // User's code with enhanced error handling
    try {
      ${code}
    } catch (syntaxError) {
      throw new Error('Syntax Error: ' + syntaxError.message);
    }
    //# sourceURL=user-submission.js
  `;
  
  let userFn;
  
  try {
    // Enhanced function detection with better error messages
    // eslint-disable-next-line no-new-func
    const moduleFunc = new Function(`
      ${wrapped}; 
      return typeof solution === 'function' ? solution : 
             typeof add === 'function' ? add : 
             typeof sum === 'function' ? sum :
             typeof max === 'function' ? max :
             typeof findMax === 'function' ? findMax :
             typeof arraySum === 'function' ? arraySum :
             typeof findElement === 'function' ? findElement :
             typeof reverseArray === 'function' ? reverseArray :
             typeof bubbleSort === 'function' ? bubbleSort :
             typeof selectionSort === 'function' ? selectionSort :
             typeof linearSearch === 'function' ? linearSearch :
             typeof binarySearch === 'function' ? binarySearch :
             typeof factorial === 'function' ? factorial :
             typeof fibonacci === 'function' ? fibonacci :
             typeof isPalindrome === 'function' ? isPalindrome :
             typeof isAnagram === 'function' ? isAnagram :
             typeof palindrome === 'function' ? palindrome :
             typeof anagram === 'function' ? anagram :
             undefined;
    `);
    
    userFn = moduleFunc();
    
    if (typeof userFn !== "function") {
      const suggestedNames = getSuggestedFunctionNames(task.id);
      throw new Error(`No function found. Make sure you define a function named: ${suggestedNames.join(', ')}`);
    }
  } catch (err) {
    // Enhanced error reporting for compilation failures
    const errorMessage = err.message.includes('Syntax Error') ? 
      err.message : 
      `Code Error: ${err.message}. Check your syntax and function definition.`;
      
    task.tests.forEach((t, idx) => {
      results.push({
        testId: t.id || idx,
        name: t.name || `Test ${idx + 1}`,
        passed: false,
        expected: t.expected,
        actual: null,
        error: errorMessage,
      });
    });
    return results;
  }

  // Enhanced test execution with better error handling
  task.tests.forEach((t, idx) => {
    try {
      // Validate input before execution
      const input = t.input || [];
      if (!Array.isArray(input)) {
        throw new Error('Invalid test input format');
      }
      
      const actual = userFn(...input);
      const passed = deepEqual(actual, t.expected);
      
      results.push({
        testId: t.id || idx,
        name: t.name || `Test ${idx + 1}`,
        passed,
        expected: t.expected,
        actual,
        error: passed ? null : generateHelpfulError(actual, t.expected, t.name),
      });
    } catch (err) {
      const helpfulError = generateRuntimeError(err, t);
      results.push({
        testId: t.id || idx,
        name: t.name || `Test ${idx + 1}`,
        passed: false,
        expected: t.expected,
        actual: null,
        error: helpfulError,
      });
    }
  });
  return results;
}

/**
 * Get suggested function names based on task ID
 */
function getSuggestedFunctionNames(taskId) {
  const nameMap = {
    'task-sum': ['solution', 'add', 'sum'],
    'task-max': ['solution', 'max', 'findMax'],
    'task-array-sum': ['solution', 'arraySum', 'sum'],
    'task-find-element': ['solution', 'findElement', 'find'],
    'task-reverse-array': ['solution', 'reverseArray', 'reverse'],
    'task-bubble-sort': ['solution', 'bubbleSort', 'sort'],
    'task-selection-sort': ['solution', 'selectionSort', 'sort'],
    'task-linear-search': ['solution', 'linearSearch', 'search'],
    'task-binary-search': ['solution', 'binarySearch', 'search'],
    'task-factorial': ['solution', 'factorial'],
    'task-fibonacci': ['solution', 'fibonacci'],
    'task-palindrome': ['solution', 'isPalindrome', 'palindrome'],
    'task-anagram': ['solution', 'isAnagram', 'anagram']
  };
  
  return nameMap[taskId] || ['solution'];
}
function deepEqual(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return a === b;
  }
}

/**
 * Generate helpful error messages for failed tests
 */
function generateHelpfulError(actual, expected, testName) {
  if (actual === undefined) {
    return 'Function returned undefined. Make sure you have a return statement.';
  }
  
  if (typeof actual !== typeof expected) {
    return `Type mismatch: expected ${typeof expected}, got ${typeof actual}`;
  }
  
  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (actual.length !== expected.length) {
      return `Array length mismatch: expected ${expected.length} elements, got ${actual.length}`;
    }
  }
  
  return null; // No specific error, just wrong value
}
// helper that either runs local grader or defers to server
export async function grade(code, task, useServer = false, postSubmission) {
  if (useServer && typeof postSubmission === "function") {
    const submission = { 
      code, 
      lessonId: task.lessonId, 
      taskId: task.id,
/**
 * Generate helpful runtime error messages
 */
function generateRuntimeError(err, test) {
  const message = err.message.toLowerCase();
  
  if (message.includes('cannot read property') || message.includes('cannot read properties')) {
    return 'Trying to access a property of undefined/null. Check your variable initialization.';
  }
  
  if (message.includes('is not a function')) {
    return 'Trying to call something that is not a function. Check your method calls.';
  }
  
  if (message.includes('maximum call stack')) {
    return 'Infinite recursion detected. Check your base case in recursive functions.';
  }
  
  if (message.includes('out of range') || message.includes('invalid array length')) {
    return 'Array index out of bounds. Check your loop conditions.';
  }
  
  return `Runtime Error: ${err.message}`;
}
      userId: 'student-1' // Default user for now
    };
    const serverRes = await postSubmission(submission);
    // Handle special cases
    if (a === b) return true;
    if (a === null || b === null) return a === b;
    if (typeof a !== typeof b) return false;
    
    // For arrays and objects, use JSON comparison
    return serverRes.submission ? serverRes.submission.results : serverRes.results;
  } else {
    return gradeLocally(code, task);
  }
}
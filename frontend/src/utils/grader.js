// grade locally: run tests on student's code in a safe JS eval runner for simple JS tasks.
// Important: this is a simple grader for small exercises; production should call backend sandbox for safety.
export function gradeLocally(code, task) {
  // task.tests: [{input: [...], expected: ...}, ...]
  // returns submission.results: [{ testId, passed, expected, actual, error }]
  const results = [];
  
  // wrap code so that user's function is available
  const wrapped = `${code}\n//# sourceURL=user-submission.js`;
  let userFn;
  
  try {
    // Try multiple function name patterns that students might use
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
             undefined;
    `);
    
    userFn = moduleFunc();
    
    if (typeof userFn !== "function") {
      throw new Error("No function exported. Make sure you define a function with an appropriate name (e.g., 'solution', 'add', 'sum', etc.).");
    }
  } catch (err) {
    // All tests fail with error message
    task.tests.forEach((t, idx) => {
      results.push({
        testId: t.id || idx,
        name: t.name || `Test ${idx + 1}`,
        passed: false,
        expected: t.expected,
        actual: null,
        error: err.message,
      });
    });
    return results;
  }

  task.tests.forEach((t, idx) => {
    try {
      const actual = userFn(...(t.input || []));
      const passed = deepEqual(actual, t.expected);
      results.push({
        testId: t.id || idx,
        name: t.name || `Test ${idx + 1}`,
        passed,
        expected: t.expected,
        actual,
        error: passed ? null : null,
      });
    } catch (err) {
      results.push({
        testId: t.id || idx,
        name: t.name || `Test ${idx + 1}`,
        passed: false,
        expected: t.expected,
        actual: null,
        error: err.message,
      });
    }
  });
  return results;
}

function deepEqual(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return a === b;
  }
}

// helper that either runs local grader or defers to server
export async function grade(code, task, useServer = false, postSubmission) {
  if (useServer && typeof postSubmission === "function") {
    const submission = { 
      code, 
      lessonId: task.lessonId, 
      taskId: task.id,
      userId: 'student-1' // Default user for now
    };
    const serverRes = await postSubmission(submission);
    return serverRes.submission ? serverRes.submission.results : serverRes.results;
  } else {
    return gradeLocally(code, task);
  }
}
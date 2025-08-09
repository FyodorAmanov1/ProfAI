// grade locally: run tests on student's code in a safe JS eval runner for simple JS tasks.
// Important: this is a simple grader for small exercises; production should call backend sandbox for safety.
export function gradeLocally(code, task) {
    // task.tests: [{input: [...], expected: ...}, ...]
    // returns submission.results: [{ testId, passed, expected, actual, error }]
    const results = [];
    // wrap code so that user's function is available as `__user__`
    const wrapped = `${code}\n//# sourceURL=user-submission.js`;
    let userFn;
    try {
      // eslint-disable-next-line no-new-func
      const moduleFunc = new Function(`${wrapped}; return typeof add === 'function' ? add : (typeof solution === 'function' ? solution : undefined);`);
      userFn = moduleFunc();
      if (typeof userFn !== "function") {
        throw new Error("No function exported. Ensure you define `function add(...)` or `function solution(...)`.");
      }
    } catch (err) {
      // All tests fail with error message
      task.tests.forEach((t, idx) => {
        results.push({
          testId: idx,
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
          testId: idx,
          passed,
          expected: t.expected,
          actual,
          error: passed ? null : null,
        });
      } catch (err) {
        results.push({
          testId: idx,
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
      const submission = { code, lessonId: task.lessonId, taskId: task.id };
      const serverRes = await postSubmission(submission); // backend returns submission.results
      return serverRes.submission ? serverRes.submission.results : serverRes.submission.results;
    } else {
      return gradeLocally(code, task);
    }
  }
  
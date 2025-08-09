// backend/services/grader.js
// A simple JS grader. Each test case in task.tests should be:
// { id: 't1', input: [arg1, arg2, ...], expected: <value>, name: 'optional' }
// The user's submitted code must expose a function named `solution`:
// e.g. function solution(a,b){ return a+b; }
// or module.exports = { solution }
// This grader runs the solution function per test with provided inputs.

const vm = require('vm');

async function runTests(tests, userCode) {
  const results = [];

  // Build a "script" that contains the user's code and an exports shim.
  // We will run it in a sandbox context and retrieve global.solution or module.exports.solution.
  const wrapper = `
    const module = { exports: {} };
    const exports = module.exports;
    // user code starts
    ${userCode}
    // user code ends
    // expose possibility that user defined function directly as 'solution'
    if (typeof solution !== 'undefined') module.exports.solution = solution;
    exports = module.exports;
    module.exports
  `;

  const context = vm.createContext({
    console: { log: (...args) => undefined }, // disable console output
    setTimeout, // small set of host functions (use cautiously)
    setInterval: undefined,
    Buffer: undefined
  });

  let exported;
  try {
    const script = new vm.Script(wrapper, { filename: 'submission.vm.js', displayErrors: true });
    exported = script.runInContext(context, { timeout: 1000 }); // 1s to evaluate code
  } catch (err) {
    // code failed to compile/run
    return [{
      testId: 'compile',
      name: 'compile',
      passed: false,
      error: `Code failed to run: ${err.message}`
    }];
  }

  // exported might be module.exports (object). look for exported.solution
  const solutionFn = exported && exported.solution;
  if (typeof solutionFn !== 'function') {
    return [{
      testId: 'no-solution',
      name: 'no-solution',
      passed: false,
      error: 'Your submission must export a function named `solution` (either declare `function solution(...)` or `module.exports.solution = ...`).'
    }];
  }

  // For each test invoke function with inputs (safely)
  for (const t of tests) {
    const testId = t.id || (t.name || `test-${Math.random().toString(36).slice(2,6)}`);
    try {
      // Call function inside VM: create a small wrapper script to call it.
      // We serialize input and expected for comparison.
      const callWrapper = `
        const _user_solution = (${solutionFn.toString()});
        const __args = ${JSON.stringify(t.input || [])};
        const __res = _user_solution.apply(null, __args);
        __res;
      `;
      const callScript = new vm.Script(callWrapper, { filename: `call-${testId}.vm.js` });
      const value = callScript.runInContext(context, { timeout: 1000 });
      const passed = deepEqual(value, t.expected);

      results.push({
        testId,
        name: t.name || '',
        input: t.input || [],
        expected: t.expected,
        actual: value,
        passed
      });
    } catch (err) {
      results.push({
        testId,
        name: t.name || '',
        input: t.input || [],
        expected: t.expected,
        actual: null,
        passed: false,
        error: err.message
      });
    }
  }

  return results;
}

// small deep equal for primitives, arrays, objects
function deepEqual(a, b) {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch (e) {
    return a === b;
  }
}

module.exports = { runTests };

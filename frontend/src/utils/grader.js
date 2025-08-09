export async function gradeSubmission(submission) {
    // submission: { lessonId, taskId, code }
    // We'll do a very simple evaluation: call the user's function named `solve` if present.
    const results = []
    const tests = submission.tests || []
  
    try {
      // Create a function from user's code in a safe-ish wrapper.
      // WARNING: this is unsafe for production — never eval user code on the client in real apps.
      // For the MVP frontend, this helps simulate test runs.
      // We expect the user to export a function called `solve` that accepts a single arg.
      // Example user code:
      // function solve(name) { return `Hello, ${name}!` }
  
      // eslint-disable-next-line no-new-func
      const userFunc = new Function(`${submission.code}; return typeof solve === 'function' ? solve : null`)()
  
      for (const t of tests) {
        try {
          const output = await Promise.resolve(userFunc(t.input))
          const pass = output === t.expected
          results.push({ input: t.input, expected: t.expected, output, pass })
        } catch (err) {
          results.push({ input: t.input, expected: t.expected, output: String(err), pass: false, error: true })
        }
      }
    } catch (err) {
      for (const t of tests) {
        results.push({ input: t.input, expected: t.expected, output: String(err), pass: false, error: true })
      }
    }
  
    return { results, passed: results.every(r => r.pass) }
  }
  
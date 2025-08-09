// hints module that produces `hint.text` strings based on failure patterns
export function getHintsForTask(task) {
    // basic hint map per task.id (you can enhance in content files)
    const hintDB = {
      "task-01": [
        { text: "Check if your function returns the sum of two numbers." },
        { text: "Ensure you handle negative numbers correctly." },
        { text: "Are you naming the function `add` or `solution`? Use add(a,b)." }
      ]
    };
    return hintDB[task.id] || [{ text: "Try printing intermediate values to debug." }];
  }
  
  /**
   * Returns the next hint (hint.text) given task and submission results.
   * Always returns { text: string, index: number }.
   */
  export function getNextHint(task, submissionResults) {
    const hints = getHintsForTask(task);
    const failedCount = submissionResults.filter(r => !r.passed).length;
    // simple policy: reveal more hints as more failures happen
    const index = Math.min(failedCount - 1, hints.length - 1);
    const idx = Math.max(0, index);
    return { text: hints[idx].text, index: idx };
  }
  
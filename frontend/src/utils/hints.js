export function getHint(task, { attempts = 0, sentimentScore = 0 } = {}) {
    // task: { id, title }
    if (attempts === 0) return { text: 'Start by reading the task carefully. Write a function named `solve`.' }
    if (sentimentScore < -0.3) return { text: 'You seem frustrated. Try breaking the problem into smaller steps — write pseudocode first.' }
    if (attempts >= 3) return { text: 'Hint: check edge cases and input/output formats. Use console.log to debug.' }
    return { text: 'Try running your code and checking the output for the provided test cases.' }
  }
export function analyzeSentiment(text) {
    // returns a numeric sentimentScore between -1 (very negative) and +1 (very positive)
    if (!text) return 0
    const negative = ['frustrat', 'angry', 'hate', 'bad', 'stuck']
    const positive = ['good', 'nice', 'great', 'yay', 'done']
    const txt = text.toLowerCase()
    let score = 0
    for (const w of negative) if (txt.includes(w)) score -= 0.6
    for (const w of positive) if (txt.includes(w)) score += 0.6
    return Math.max(-1, Math.min(1, score))
  }
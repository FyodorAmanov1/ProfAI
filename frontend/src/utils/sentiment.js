// tiny sentiment analyzer for short text; returns numeric sentimentScore
export function analyzeSentiment(text) {
    if (!text || typeof text !== "string") return 0;
    const negative = ["bug", "error", "fail", "wrong", "stuck"];
    const positive = ["nice", "good", "works", "passed", "yay", "done"];
    let score = 0;
    const lower = text.toLowerCase();
    negative.forEach(w => { if (lower.includes(w)) score -= 1; });
    positive.forEach(w => { if (lower.includes(w)) score += 1; });
    // normalize small range
    return Math.max(-3, Math.min(3, score));
  }
  
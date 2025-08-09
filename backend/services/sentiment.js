// backend/services/sentiment.js
// Lightweight sentiment analysis using the 'sentiment' npm package.
// Returns numeric `sentimentScore` (positive -> positive, negative -> negative)

const Sentiment = require('sentiment');
const sentiment = new Sentiment();

function analyzeSentiment(text) {
  try {
    if (typeof text !== 'string') {
      return 0;
    }
    if (!text.trim().length) {
      return 0;
    }
    const r = sentiment.analyze(text.trim());
    // normalized score roughly words / positive minus negative
    // clamp between -1 and 1
    return Math.max(-1, Math.min(1, r.score || 0));
  } catch (err) {
    console.error('Error in sentiment analysis:', err);
    return 0;
  }
}

module.exports = { analyzeSentiment };

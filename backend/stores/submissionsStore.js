// backend/stores/submissionsStore.js
// very small in-memory store. Replace with DB later.

const submissions = []; // array of submission objects
const userProgress = {}; // map userId -> array of progress objects

function saveSubmission(sub) {
  if (!sub || typeof sub !== 'object') {
    throw new Error('Invalid submission object');
  }
  submissions.push(sub);
  return sub;
}

function getAllSubmissions() {
  return submissions.slice().reverse(); // newest first
}

function updateProgress(userId, progress) {
  if (!userId) {
    throw new Error('userId is required');
  }
  if (!progress || typeof progress !== 'object') {
    throw new Error('Invalid progress object');
  }
  if (!userProgress[userId]) userProgress[userId] = [];
  userProgress[userId].push(progress);
  return progress;
}

function getUserProgress(userId) {
  if (!userId) {
    throw new Error('userId is required');
  }
  return userProgress[userId] || [];
}

module.exports = { saveSubmission, getAllSubmissions, updateProgress, getUserProgress };

// small fetch wrapper; keeps frontend/backed compatibility
const API_BASE = process.env.REACT_APP_API_BASE || ""; // e.g. '', or http://localhost:4000

async function safeFetch(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const txt = await res.text();
    const error = new Error(`API ${url} failed: ${res.status} ${txt}`);
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function fetchLessons() {
  return safeFetch("/lessons");
}

export async function postSubmission(submission) {
  // expects submission to contain submission.code, plus metadata (lesson/task/user)
  return safeFetch("/submissions", {
    method: "POST",
    body: JSON.stringify(submission),
  });
}

export async function fetchSubmissions() {
  return safeFetch("/submissions");
}

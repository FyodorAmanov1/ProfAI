import React, { useState } from "react";
import { grade } from "../utils/grader";
import { postSubmission } from "../utils/api";

/**
 * Props:
 *  - task (contains task.tests and task.id)
 *  - user
 *  - onSubmissionSaved(submission)
 *  - getHint(submissionResults) -> { text, index }
 */
export default function Quiz({ task, user, onSubmissionSaved, getHint }) {
  const [code, setCode] = useState("// implement add(a,b)");
  const [results, setResults] = useState(null);
  const [useServer, setUseServer] = useState(false);
  const [hint, setHint] = useState(null);
  const [running, setRunning] = useState(false);

  async function run() {
    setRunning(true);
    try {
      const submissionResults = await grade(code, task, useServer, postSubmission);
      setResults(submissionResults);

      // compute hint if not all passed
      if (submissionResults.some(r => !r.passed)) {
        const next = getHint ? getHint(submissionResults) : null;
        if (next) setHint(next);
      } else {
        setHint({ text: "All tests passed. Well done!", index: -1 });
      }

      // build submission object for backend compatibility
      const submission = {
        code,
        lessonId: task.lessonId,
        taskId: task.id,
        userId: user?.id,
        results: submissionResults
      };

      // notify parent / optionally save
      if (typeof onSubmissionSaved === "function") onSubmissionSaved(submission);

      // optionally persist to server (we keep local control)
      if (!useServer) {
        // small optimization: fire-and-forget to /submissions to record progress (optional)
        try {
          await postSubmission({ code, lessonId: task.lessonId, taskId: task.id, userId: user?.id, results: submissionResults });
        } catch (e) {
          // ignore network errors but log for debugging
          console.warn("failed to persist submission:", e.message || e);
        }
      }

    } finally {
      setRunning(false);
    }
  }

  return (
    <div style={{marginTop: 8}}>
      <h4>Quiz</h4>
      <textarea value={code} onChange={e => setCode(e.target.value)} rows={6} style={{width:"100%"}} />
      <div style={{marginTop:8}}>
        <label>
          <input type="checkbox" checked={useServer} onChange={e => setUseServer(e.target.checked)} />
          {" "}Use server grader
        </label>
        <button onClick={run} disabled={running} style={{marginLeft:8}}>{running ? "Running..." : "Run tests"}</button>
      </div>

      {results && (
        <div style={{marginTop:8}}>
          <h5>Results</h5>
          <ul>
            {results.map((r) => (
              <li key={r.testId} style={{color: r.passed ? "green" : "red"}}>
                Test #{r.testId}: {r.passed ? "Passed" : `Failed — expected ${JSON.stringify(r.expected)}, got ${JSON.stringify(r.actual)} ${r.error ? `(error: ${r.error})` : ""}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hint && (
        <div style={{marginTop:8, padding:8, border:"1px dashed #ccc"}}>
          <strong>Hint:</strong> {hint.text}
        </div>
      )}
    </div>
  );
}

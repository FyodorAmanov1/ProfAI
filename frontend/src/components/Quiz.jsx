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
  const [code, setCode] = useState(getStarterCode(task));
  const [results, setResults] = useState(null);
  const [useServer, setUseServer] = useState(false);
  const [hint, setHint] = useState(null);
  const [running, setRunning] = useState(false);

  function getStarterCode(task) {
    // Provide helpful starter code based on task type
    const starters = {
      'task-sum': 'function solution(a, b) {\n  // Add two numbers and return the result\n  \n}',
      'task-max': 'function solution(a, b) {\n  // Return the larger of two numbers\n  \n}',
      'task-array-sum': 'function solution(arr) {\n  // Calculate sum of all numbers in array\n  \n}',
      'task-find-element': 'function solution(arr, target) {\n  // Find target in array, return index or -1\n  \n}',
      'task-reverse-array': 'function solution(arr) {\n  // Reverse array without using built-in reverse\n  \n}',
      'task-bubble-sort': 'function solution(arr) {\n  // Implement bubble sort algorithm\n  \n}',
      'task-selection-sort': 'function solution(arr) {\n  // Implement selection sort algorithm\n  \n}',
      'task-linear-search': 'function solution(arr, target) {\n  // Search for target using linear search\n  \n}',
      'task-binary-search': 'function solution(arr, target) {\n  // Search sorted array using binary search\n  \n}',
      'task-factorial': 'function solution(n) {\n  // Calculate factorial recursively\n  \n}',
      'task-fibonacci': 'function solution(n) {\n  // Calculate nth Fibonacci number\n  \n}',
      'task-palindrome': 'function solution(str) {\n  // Check if string is a palindrome\n  \n}',
      'task-anagram': 'function solution(str1, str2) {\n  // Check if two strings are anagrams\n  \n}'
    };
    
    return starters[task.id] || 'function solution() {\n  // Implement your solution here\n  \n}';
  }

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
        setHint({ text: "🎉 All tests passed! Well done!", index: -1 });
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
          await postSubmission({ 
            code, 
            lessonId: task.lessonId, 
            taskId: task.id, 
            userId: user?.id || 'student-1'
          });
        } catch (e) {
          // ignore network errors but log for debugging
          console.warn("failed to persist submission:", e.message || e);
        }
      }

    } finally {
      setRunning(false);
    }
  }

  const passedTests = results ? results.filter(r => r.passed).length : 0;
  const totalTests = results ? results.length : 0;

  return (
    <div style={{ 
      marginTop: 16, 
      padding: 16, 
      border: '1px solid #e2e8f0', 
      borderRadius: '8px',
      backgroundColor: '#f8fafc'
    }}>
      <h4 style={{ margin: '0 0 12px 0', color: '#2d3748' }}>Code Editor</h4>
      
      <textarea 
        value={code} 
        onChange={e => setCode(e.target.value)} 
        rows={12} 
        style={{
          width: '100%', 
          fontFamily: 'Monaco, Consolas, "Courier New", monospace',
          fontSize: '14px',
          padding: '12px',
          border: '1px solid #cbd5e0',
          borderRadius: '4px',
          backgroundColor: '#ffffff',
          resize: 'vertical'
        }} 
        placeholder="Write your solution here..."
      />
      
      <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', fontSize: '14px' }}>
          <input 
            type="checkbox" 
            checked={useServer} 
            onChange={e => setUseServer(e.target.checked)}
            style={{ marginRight: '6px' }}
          />
          Use server grader
        </label>
        
        <button 
          onClick={run} 
          disabled={running}
          style={{
            padding: '8px 16px',
            backgroundColor: running ? '#a0aec0' : '#3182ce',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: running ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          {running ? "Running..." : "Run Tests"}
        </button>
        
        {results && (
          <span style={{ 
            fontSize: '14px', 
            color: passedTests === totalTests ? '#38a169' : '#e53e3e',
            fontWeight: '500'
          }}>
            {passedTests}/{totalTests} tests passed
          </span>
        )}
      </div>

      {results && (
        <div style={{ marginTop: 16 }}>
          <h5 style={{ margin: '0 0 8px 0', color: '#2d3748' }}>Test Results</h5>
          <div style={{ display: 'grid', gap: '8px' }}>
            {results.map((r) => (
              <div 
                key={r.testId} 
                style={{
                  padding: '8px 12px',
                  borderRadius: '4px',
                  backgroundColor: r.passed ? '#f0fff4' : '#fed7d7',
                  border: `1px solid ${r.passed ? '#9ae6b4' : '#feb2b2'}`,
                  fontSize: '14px'
                }}
              >
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  marginBottom: r.passed ? '0' : '4px'
                }}>
                  <span style={{ fontWeight: '500' }}>
                    {r.name || `Test ${r.testId}`}
                  </span>
                  <span style={{ 
                    color: r.passed ? '#38a169' : '#e53e3e',
                    fontWeight: '600'
                  }}>
                    {r.passed ? "✓ PASS" : "✗ FAIL"}
                  </span>
                </div>
                
                {!r.passed && (
                  <div style={{ fontSize: '12px', color: '#4a5568' }}>
                    Expected: <code>{JSON.stringify(r.expected)}</code>
                    {r.actual !== null && (
                      <>, Got: <code>{JSON.stringify(r.actual)}</code></>
                    )}
                    {r.error && (
                      <div style={{ color: '#e53e3e', marginTop: '4px' }}>
                        Error: {r.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {hint && (
        <div style={{
          marginTop: 16, 
          padding: 12, 
          border: '1px dashed #3182ce',
          borderRadius: '4px',
          backgroundColor: '#ebf8ff'
        }}>
          <strong style={{ color: '#2b6cb0' }}>💡 Hint:</strong>
          <span style={{ marginLeft: '8px', color: '#2d3748' }}>{hint.text}</span>
        </div>
      )}
    </div>
  );
}
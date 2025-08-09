import React, { useState } from 'react';

const PlacementTest = ({ userId, onComplete }) => {
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);

  const startTest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/teaching/placement-test/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      const data = await response.json();
      if (data.success) {
        setTest(data.test);
        setAnswers({});
      } else {
        console.error('Failed to start test:', data.error);
      }
    } catch (err) {
      console.error('Error starting test:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitTest = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/teaching/placement-test/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, answers })
      });
      
      const data = await response.json();
      if (data.success) {
        setResults(data);
        if (onComplete) {
          onComplete(data);
        }
      } else {
        console.error('Failed to submit test:', data.error);
      }
    } catch (err) {
      console.error('Error submitting test:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateAnswer = (taskId, value) => {
    setAnswers(prev => ({
      ...prev,
      [taskId]: { code: value }
    }));
  };

  if (results) {
    return (
      <div className="placement-test-results p-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Test Results</h2>
        <div className="mb-4">
          <p className="text-lg">Your level: <span className="font-semibold capitalize">{results.level}</span></p>
          <p className="text-lg">Score: {results.score.toFixed(1)}%</p>
        </div>
        <div className="mt-4">
          <p>Tests Passed: {results.details.passedTests} / {results.details.totalTests}</p>
        </div>
        <button
          onClick={() => {
            setTest(null);
            setResults(null);
            setAnswers({});
          }}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Take Another Test
        </button>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="placement-test-start p-4 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Programming Placement Test</h2>
        <p className="mb-4">
          Take this test to determine your programming skill level. 
          The test consists of multiple programming tasks of varying difficulty.
        </p>
        <button
          onClick={startTest}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Loading...' : 'Start Test'}
        </button>
      </div>
    );
  }

  return (
    <div className="placement-test p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Placement Test</h2>
      {test.map((task, index) => (
        <div key={task.id} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Task {index + 1}</h3>
          <p className="mb-4 whitespace-pre-wrap">{task.description}</p>
          <div className="mb-4">
            <textarea
              value={answers[task.id]?.code || ''}
              onChange={(e) => updateAnswer(task.id, e.target.value)}
              className="w-full h-40 p-2 font-mono border rounded"
              placeholder="Write your solution here..."
            />
          </div>
          {task.testCases && (
            <div className="mb-4">
              <h4 className="font-semibold mb-2">Test Cases:</h4>
              <ul className="list-disc pl-5">
                {task.testCases.map((test, i) => (
                  <li key={i}>{test}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={submitTest}
        disabled={isLoading || Object.keys(answers).length === 0}
        className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
      >
        {isLoading ? 'Submitting...' : 'Submit Test'}
      </button>
    </div>
  );
};

export default PlacementTest;

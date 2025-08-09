import React, { useState } from 'react';

const AIAssistant = ({ lessonId, userId }) => {
  const [question, setQuestion] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [practiceTask, setPracticeTask] = useState(null);
  const [topic, setTopic] = useState('');

  const askQuestion = async () => {
    if (!question.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/teaching/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lessonId, question, userId })
      });
      
      const data = await response.json();
      if (data.success) {
        setExplanation(data.explanation);
      } else {
        console.error('Failed to get explanation:', data.error);
      }
    } catch (err) {
      console.error('Error asking question:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTask = async () => {
    if (!topic.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/teaching/generate-task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, userId })
      });
      
      const data = await response.json();
      if (data.success) {
        setPracticeTask(data.task);
      } else {
        console.error('Failed to generate task:', data.error);
      }
    } catch (err) {
      console.error('Error generating task:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-assistant p-4">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Ask AI Assistant</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about this lesson..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={askQuestion}
            disabled={isLoading || !question.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {isLoading ? 'Thinking...' : 'Ask'}
          </button>
        </div>
        {explanation && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <p className="whitespace-pre-wrap">{explanation}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Generate Practice Task</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter a topic for practice..."
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={generateTask}
            disabled={isLoading || !topic.trim()}
            className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          >
            {isLoading ? 'Generating...' : 'Generate Task'}
          </button>
        </div>
        {practiceTask && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold mb-2">{practiceTask.title}</h4>
            <p className="whitespace-pre-wrap">{practiceTask.description}</p>
            {practiceTask.testCases && (
              <div className="mt-4">
                <h5 className="font-semibold">Test Cases:</h5>
                <ul className="list-disc pl-5">
                  {practiceTask.testCases.map((test, i) => (
                    <li key={i}>{test}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;

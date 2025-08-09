import React, { useState } from 'react';

/**
 * AI Tutor component that provides intelligent assistance based on student's code and errors
 */
export default function AITutor({ task, submissionResults, code, onHintRequest }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tutorResponse, setTutorResponse] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeCode = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis - in production, this would call an AI service
    const analysis = await generateAIResponse(task, submissionResults, code);
    setTutorResponse(analysis);
    setIsAnalyzing(false);
  };

  const generateAIResponse = async (task, results, code) => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const failedTests = results?.filter(r => !r.passed) || [];
    const passedTests = results?.filter(r => r.passed) || [];
    
    if (failedTests.length === 0) {
      return {
        type: 'success',
        message: "Excellent work! Your solution passes all test cases. Let me explain what makes your approach effective:",
        explanation: generateSuccessExplanation(task, code),
        nextSteps: generateNextSteps(task)
      };
    }

    return {
      type: 'guidance',
      message: "I can see where you're having trouble. Let me help you understand the issue:",
      explanation: generateErrorExplanation(task, failedTests, code),
      suggestions: generateSuggestions(task, failedTests),
      encouragement: "You're on the right track! Programming is about iterating and improving."
    };
  };

  const generateSuccessExplanation = (task, code) => {
    const explanations = {
      'task-sum': "Your function correctly takes two parameters and returns their sum. This demonstrates understanding of function parameters, arithmetic operations, and return statements.",
      'task-max': "Great use of conditional logic! Your solution properly compares two values and returns the larger one.",
      'task-array-sum': "Excellent array iteration! You've successfully used a loop to process each element and accumulate the total.",
      'task-bubble-sort': "Perfect implementation of bubble sort! You've correctly used nested loops and swapping to sort the array.",
      'task-binary-search': "Outstanding! You've implemented the divide-and-conquer approach correctly, achieving O(log n) time complexity."
    };
    
    return explanations[task.id] || "Your solution demonstrates good algorithmic thinking and proper implementation.";
  };

  const generateErrorExplanation = (task, failedTests, code) => {
    // Analyze common error patterns
    if (!code.includes('return')) {
      return "I notice your function doesn't have a return statement. Functions need to return a value to pass the test cases.";
    }
    
    if (code.includes('console.log') && !code.includes('return')) {
      return "I see you're using console.log, which is great for debugging! However, the tests need your function to return the result, not just print it.";
    }

    const errorPatterns = {
      'task-sum': "For addition problems, make sure you're returning the sum of both parameters using the + operator.",
      'task-array-sum': "When working with arrays, you need to iterate through each element and add them to a running total.",
      'task-bubble-sort': "Bubble sort requires nested loops - one for passes and one for comparisons. Don't forget to swap elements when they're in the wrong order."
    };

    return errorPatterns[task.id] || "Let's look at the failing test cases to understand what's expected.";
  };

  const generateSuggestions = (task, failedTests) => {
    const suggestions = [];
    
    failedTests.forEach(test => {
      if (test.error) {
        suggestions.push(`Fix the error: ${test.error}`);
      } else {
        suggestions.push(`For test "${test.name}": Expected ${JSON.stringify(test.expected)}, but got ${JSON.stringify(test.actual)}`);
      }
    });

    return suggestions;
  };

  const generateNextSteps = (task) => {
    const nextSteps = {
      'task-sum': ["Try implementing the 'Find Maximum' problem next", "Practice with more arithmetic operations"],
      'task-max': ["Move on to array problems", "Try implementing min/max for arrays"],
      'task-array-sum': ["Try the 'Find Element' problem", "Practice with more array algorithms"],
      'task-bubble-sort': ["Learn about selection sort", "Compare time complexities of different sorting algorithms"]
    };

    return nextSteps[task.id] || ["Continue practicing with similar problems", "Try the next lesson in the series"];
  };

  return (
    <div style={{
      marginTop: '16px',
      border: '2px solid #e6fffa',
      borderRadius: '12px',
      backgroundColor: '#f0fdfa',
      overflow: 'hidden'
    }}>
      <div 
        style={{
          padding: '16px',
          backgroundColor: '#0d9488',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🤖</span>
          <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600' }}>
            AI Professor Assistant
          </h4>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!tutorResponse) analyzeCode();
          }}
          disabled={isAnalyzing}
          style={{
            padding: '6px 12px',
            backgroundColor: isAnalyzing ? '#6b7280' : '#ffffff',
            color: isAnalyzing ? '#ffffff' : '#0d9488',
            border: 'none',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: '500',
            cursor: isAnalyzing ? 'not-allowed' : 'pointer'
          }}
        >
          {isAnalyzing ? 'Analyzing...' : tutorResponse ? 'Refresh Analysis' : 'Get AI Help'}
        </button>
      </div>

      {isExpanded && (
        <div style={{ padding: '20px' }}>
          {!tutorResponse && !isAnalyzing && (
            <div style={{ textAlign: 'center', color: '#6b7280' }}>
              <p>Click "Get AI Help" to receive personalized guidance on your code!</p>
            </div>
          )}

          {isAnalyzing && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div style={{ 
                display: 'inline-block',
                width: '20px',
                height: '20px',
                border: '2px solid #0d9488',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
              <p style={{ marginTop: '12px', color: '#0d9488' }}>
                AI Professor is analyzing your code...
              </p>
              <style>
                {`
                  @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                  }
                `}
              </style>
            </div>
          )}

          {tutorResponse && (
            <div>
              <div style={{
                padding: '16px',
                backgroundColor: tutorResponse.type === 'success' ? '#d1fae5' : '#fef3c7',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                <p style={{ 
                  margin: '0 0 8px 0', 
                  fontWeight: '600',
                  color: tutorResponse.type === 'success' ? '#065f46' : '#92400e'
                }}>
                  {tutorResponse.message}
                </p>
                <p style={{ 
                  margin: 0, 
                  fontSize: '14px',
                  color: tutorResponse.type === 'success' ? '#047857' : '#a16207'
                }}>
                  {tutorResponse.explanation}
                </p>
              </div>

              {tutorResponse.suggestions && (
                <div style={{ marginBottom: '16px' }}>
                  <h5 style={{ margin: '0 0 8px 0', color: '#374151' }}>Specific Suggestions:</h5>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {tutorResponse.suggestions.map((suggestion, idx) => (
                      <li key={idx} style={{ marginBottom: '4px', fontSize: '14px', color: '#4b5563' }}>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tutorResponse.nextSteps && (
                <div>
                  <h5 style={{ margin: '0 0 8px 0', color: '#374151' }}>What's Next:</h5>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {tutorResponse.nextSteps.map((step, idx) => (
                      <li key={idx} style={{ marginBottom: '4px', fontSize: '14px', color: '#4b5563' }}>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tutorResponse.encouragement && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  backgroundColor: '#ede9fe',
                  borderRadius: '6px',
                  borderLeft: '4px solid #8b5cf6'
                }}>
                  <p style={{ margin: 0, fontSize: '14px', color: '#5b21b6', fontStyle: 'italic' }}>
                    💪 {tutorResponse.encouragement}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { LESSONS as LOCAL } from "../data/lessons";
import { fetchLessons, postSubmission } from "../utils/api";
import Quiz from "./Quiz";
import Playground from "./Playground";
import AIAssistant from "./AIAssistant";
import { getNextHint } from "../utils/hints";

export default function LessonViewer({ user, onProgressUpdate }) {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    fetchLessons().then(data => {
      const list = data.LESSONS || data || LOCAL;
      const found = list.find(l => l.id === lessonId);
      setLesson(found);
    }).catch(() => {
      const found = LOCAL.find(l => l.id === lessonId);
      setLesson(found);
    });
  }, [lessonId]);

  if (!lesson) {
    return (
      <div style={{ textAlign: 'center', padding: '48px' }}>
        <h2>Lesson not found</h2>
        <Link to="/" style={{ color: '#3182ce' }}>← Back to lessons</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '24px' }}>
        <Link 
          to="/" 
          style={{ 
            color: '#3182ce', 
            textDecoration: 'none',
            fontSize: '14px',
            display: 'inline-flex',
            alignItems: 'center',
            marginBottom: '16px'
          }}
        >
          ← Back to lessons
        </Link>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          marginBottom: '8px'
        }}>
          <h1 style={{ 
            margin: 0, 
            color: '#1a202c',
            fontSize: '28px',
            fontWeight: '700'
          }}>
            {lesson.title}
          </h1>
          <span style={{
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500',
            backgroundColor: lesson.difficulty === 'Beginner' ? '#c6f6d5' : 
                           lesson.difficulty === 'Intermediate' ? '#faf089' : '#fed7d7',
            color: lesson.difficulty === 'Beginner' ? '#22543d' : 
                   lesson.difficulty === 'Intermediate' ? '#744210' : '#742a2a'
          }}>
            {lesson.difficulty || 'Beginner'}
          </span>
        </div>
        
        <p style={{ 
          margin: 0, 
          color: '#4a5568',
          fontSize: '16px',
          lineHeight: '1.6'
        }}>
          {lesson.description}
        </p>

        <div style={{ marginTop: '20px' }}>
          <AIAssistant lessonId={lesson.id} userId={user?.id} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {lesson.tasks.map((task, index) => (
          <div 
            key={task.id} 
            style={{
              border: "1px solid #e2e8f0", 
              borderRadius: "12px",
              padding: "24px",
              backgroundColor: "#ffffff",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
            }}
          >
            <div style={{ marginBottom: '20px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px',
                marginBottom: '8px'
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#3182ce',
                  color: 'white',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {index + 1}
                </span>
                <h2 style={{ 
                  margin: 0, 
                  color: '#1a202c',
                  fontSize: '20px',
                  fontWeight: '600'
                }}>
                  {task.title}
                </h2>
              </div>
              
              <p style={{ 
                margin: 0, 
                color: '#4a5568',
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {task.description}
              </p>
            </div>

            {task.tests && task.tests.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ 
                  margin: '0 0 8px 0', 
                  color: '#2d3748',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  Test Cases:
                </h4>
                <div style={{ 
                  display: 'grid', 
                  gap: '8px',
                  fontSize: '12px'
                }}>
                  {task.tests.slice(0, 3).map((test, idx) => (
                    <div 
                      key={idx}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#f7fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        fontFamily: 'Monaco, Consolas, monospace'
                      }}
                    >
                      <span style={{ color: '#4a5568' }}>
                        Input: <code>{JSON.stringify(test.input)}</code>
                        {' → '}
                        Expected: <code>{JSON.stringify(test.expected)}</code>
                      </span>
                    </div>
                  ))}
                  {task.tests.length > 3 && (
                    <div style={{ 
                      color: '#718096', 
                      fontSize: '11px',
                      fontStyle: 'italic'
                    }}>
                      ... and {task.tests.length - 3} more test cases
                    </div>
                  )}
                </div>
              </div>
            )}

            <Quiz
              task={{...task, lessonId: lesson.id}}
              user={user}
              onSubmissionSaved={(submission) => {
                // inform parent of progress if needed
                if (onProgressUpdate) onProgressUpdate(lesson.id, task.id, submission);
              }}
              getHint={(submissionResults) => getNextHint(task, submissionResults)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
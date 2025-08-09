import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LESSONS as LOCAL } from "../data/lessons";
import { fetchLessons } from "../utils/api";

export default function LessonList({ user, progress }) {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchLessons().then(data => {
      setLessons(data.LESSONS || data || LOCAL);
      setLoading(false);
    }).catch(() => {
      // fallback
      setLessons(LOCAL);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      <h2>Algorithm Learning Path</h2>
      {loading ? <p>Loading...</p> : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {lessons.map(lesson => {
            const lessonProgress = progress && progress[lesson.id];
            const completed = lessonProgress ? lessonProgress.completed || 0 : 0;
            const total = lesson.tasks ? lesson.tasks.length : 0;
            const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            return (
              <div key={lesson.id} style={{
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '16px',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}>
                <Link 
                  to={`/lessons/${lesson.id}`} 
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <h3 style={{ 
                    margin: '0 0 8px 0', 
                    color: '#1a202c',
                    fontSize: '18px',
                    fontWeight: '600'
                  }}>
                    {lesson.title}
                  </h3>
                </Link>
                
                <p style={{ 
                  margin: '0 0 12px 0', 
                  color: '#4a5568',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}>
                  {lesson.description}
                </p>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  fontSize: '12px'
                }}>
                  <span style={{ color: '#718096' }}>
                    Difficulty: <span style={{ 
                      color: lesson.difficulty === 'Beginner' ? '#38a169' : 
                            lesson.difficulty === 'Intermediate' ? '#d69e2e' : '#e53e3e',
                      fontWeight: '500'
                    }}>
                      {lesson.difficulty || 'Beginner'}
                    </span>
                  </span>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '60px',
                      height: '4px',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        backgroundColor: progressPercent === 100 ? '#38a169' : '#3182ce',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <span style={{ color: '#718096', minWidth: '45px' }}>
                      {completed}/{total}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
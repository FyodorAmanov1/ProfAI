import React, { useEffect, useState } from "react";
import { fetchSubmissions, fetchLessons } from "../utils/api";
import { LESSONS as LOCAL } from "../data/lessons";

export default function TeacherDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('overview');

  useEffect(() => {
    Promise.all([fetchLessons().catch(() => ({ LESSONS: LOCAL })), fetchSubmissions().catch(() => ({ submissions: [] }))])
      .then(([lessRes, subRes]) => {
        const lessonList = lessRes.LESSONS || lessRes || LOCAL;
        setLessons(lessonList);
        setSubmissions(subRes.submissions || subRes || []);
        setLoading(false);
      });
  }, []);

  function computeStudentEngagement() {
    const studentActivity = {};
    submissions.forEach(s => {
      const userId = s.userId || 'anonymous';
      if (!studentActivity[userId]) {
        studentActivity[userId] = { 
          submissions: 0, 
          completedTasks: 0, 
          avgSentiment: 0,
          lastActivity: null
        };
      }
      studentActivity[userId].submissions += 1;
      if (s.results && s.results.every(r => r.passed)) {
        studentActivity[userId].completedTasks += 1;
      }
      studentActivity[userId].avgSentiment += (s.sentimentScore || 0);
      studentActivity[userId].lastActivity = s.createdAt;
    });

    // Calculate averages
    Object.keys(studentActivity).forEach(userId => {
      const student = studentActivity[userId];
      student.avgSentiment = student.submissions > 0 ? 
        (student.avgSentiment / student.submissions).toFixed(2) : 0;
    });

    return studentActivity;
  }

  function computePerLesson() {
    // returns stats keyed by lesson.id
    const stats = {};
    lessons.forEach(l => stats[l.id] = { totalSubmissions: 0, tasks: {} });

    submissions.forEach(s => {
      const lid = s.lessonId;
      if (!lid || !stats[lid]) return;
      stats[lid].totalSubmissions += 1;
      const tid = s.taskId;
      if (!stats[lid].tasks[tid]) stats[lid].tasks[tid] = { submissions: 0, failingTests: {} };
      stats[lid].tasks[tid].submissions += 1;
      const results = s.results || [];
      results.forEach(r => {
        if (!r.passed) {
          stats[lid].tasks[tid].failingTests[r.testId] = (stats[lid].tasks[tid].failingTests[r.testId] || 0) + 1;
        }
      });
    });

    return stats;
  }

  if (loading) return <div>Loading dashboard...</div>;

  const stats = computePerLesson();
  const studentEngagement = computeStudentEngagement();
  const totalStudents = Object.keys(studentEngagement).length;
  const totalSubmissions = submissions.length;

  return (
    <div style={{ maxWidth: '1200px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ 
          margin: '0 0 8px 0', 
          color: '#1a202c',
          fontSize: '28px',
          fontWeight: '700'
        }}>
          AI Professor Dashboard
        </h2>
        <p style={{ 
          margin: 0, 
          color: '#4a5568',
          fontSize: '16px'
        }}>
          Monitor student progress and identify learning opportunities
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '4px', 
        marginBottom: '24px',
        borderBottom: '1px solid #e5e7eb'
      }}>
        {[
          { id: 'overview', label: '📊 Overview' },
          { id: 'students', label: '👥 Students' },
          { id: 'lessons', label: '📚 Lesson Analytics' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedView(tab.id)}
            style={{
              padding: '8px 16px',
              border: 'none',
              backgroundColor: selectedView === tab.id ? '#3b82f6' : 'transparent',
              color: selectedView === tab.id ? 'white' : '#6b7280',
              borderRadius: '6px 6px 0 0',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {selectedView === 'overview' && (
        <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          <div style={{
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>Total Students</h3>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6' }}>
              {totalStudents}
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
              Active learners
            </p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>Total Submissions</h3>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981' }}>
              {totalSubmissions}
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
              Code attempts
            </p>
          </div>

          <div style={{
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ margin: '0 0 8px 0', color: '#1f2937' }}>Avg Success Rate</h3>
            <div style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b' }}>
              {totalSubmissions > 0 ? 
                Math.round((submissions.filter(s => s.results?.every(r => r.passed)).length / totalSubmissions) * 100) : 0}%
            </div>
            <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
              First-try success
            </p>
          </div>
        </div>
      )}

      {/* Students Tab */}
      {selectedView === 'students' && (
        <div>
          <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>Student Engagement</h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            {Object.entries(studentEngagement).map(([userId, data]) => (
              <div 
                key={userId}
                style={{
                  padding: '16px',
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#1f2937' }}>
                    Student {userId}
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                    {data.submissions} submissions • {data.completedTasks} completed tasks
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    backgroundColor: data.avgSentiment > 0 ? '#d1fae5' : data.avgSentiment < 0 ? '#fee2e2' : '#f3f4f6',
                    color: data.avgSentiment > 0 ? '#065f46' : data.avgSentiment < 0 ? '#991b1b' : '#374151'
                  }}>
                    Sentiment: {data.avgSentiment}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lessons Tab */}
      {selectedView === 'lessons' && (
        <div>
          <h3 style={{ margin: '0 0 16px 0', color: '#1f2937' }}>Lesson Performance</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {Object.entries(stats).map(([lessonId, data]) => {
              const lesson = lessons.find(l => l.id === lessonId);
              return (
                <div 
                  key={lessonId} 
                  style={{
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: '#ffffff'
                  }}
                >
                  <h4 style={{ margin: '0 0 12px 0', color: '#1f2937' }}>
                    {lesson?.title || lessonId}
                  </h4>
                  <div style={{ 
                    display: 'flex', 
                    gap: '20px', 
                    marginBottom: '16px',
                    fontSize: '14px'
                  }}>
                    <span style={{ color: '#6b7280' }}>
                      📊 {data.totalSubmissions} submissions
                    </span>
                    <span style={{ color: '#6b7280' }}>
                      📝 {Object.keys(data.tasks).length} active tasks
                    </span>
                  </div>
                  
                  <div>
                    <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#374151' }}>
                      Task Performance:
                    </h5>
                    {Object.entries(data.tasks).map(([taskId, tdata]) => (
                      <div 
                        key={taskId} 
                        style={{
                          marginBottom: '12px',
                          padding: '12px',
                          backgroundColor: '#f9fafb',
                          borderRadius: '6px'
                        }}
                      >
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          marginBottom: '8px'
                        }}>
                          <strong style={{ fontSize: '13px', color: '#374151' }}>
                            {lesson?.tasks?.find(t => t.id === taskId)?.title || taskId}
                          </strong>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>
                            {tdata.submissions} attempts
                          </span>
                        </div>
                        
                        {Object.keys(tdata.failingTests).length > 0 && (
                          <div>
                            <div style={{ fontSize: '12px', color: '#dc2626', marginBottom: '4px' }}>
                              Common Issues:
                            </div>
                            <ul style={{ 
                              margin: 0, 
                              paddingLeft: '16px',
                              fontSize: '11px',
                              color: '#6b7280'
                            }}>
                              {Object.entries(tdata.failingTests).slice(0, 3).map(([testId, count]) => (
                                <li key={testId}>Test {testId}: {count} failures</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {Object.keys(tdata.failingTests).length === 0 && (
                          <div style={{ fontSize: '12px', color: '#059669' }}>
                            ✅ No common issues detected
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

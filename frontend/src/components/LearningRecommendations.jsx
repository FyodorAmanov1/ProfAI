import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adaptiveLearning } from '../utils/adaptiveLearning';

/**
 * Component that shows personalized learning recommendations
 */
export default function LearningRecommendations({ user, lessons, submissions = [] }) {
  const [recommendations, setRecommendations] = useState([]);
  const [insights, setInsights] = useState(null);

  useEffect(() => {
    if (!user?.id || !lessons.length) return;

    // Update student profile with recent submissions
    submissions.forEach(submission => {
      adaptiveLearning.updateStudentProfile(user.id, submission);
    });

    // Generate recommendations
    const recs = adaptiveLearning.generateRecommendations(user.id, lessons);
    setRecommendations(recs);

    // Get learning insights
    const learningInsights = adaptiveLearning.getLearningInsights(user.id);
    setInsights(learningInsights);
  }, [user, lessons, submissions]);

  if (!recommendations.length && !insights) {
    return null;
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#dc2626';
      case 'medium': return '#d97706';
      case 'low': return '#059669';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'remedial': return '🎯';
      case 'progression': return '📈';
      case 'challenge': return '🚀';
      case 'beginner': return '🌱';
      default: return '📚';
    }
  };

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      marginBottom: '24px'
    }}>
      <h3 style={{ 
        margin: '0 0 16px 0', 
        color: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        🤖 AI Learning Recommendations
      </h3>

      {/* Learning Insights */}
      {insights && (
        <div style={{
          padding: '16px',
          backgroundColor: '#f0f9ff',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #0ea5e9'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#0c4a6e', fontSize: '14px' }}>
            Your Learning Profile
          </h4>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '12px',
            marginBottom: '12px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#0369a1' }}>
                {insights.totalSubmissions}
              </div>
              <div style={{ fontSize: '12px', color: '#0c4a6e' }}>Total Attempts</div>
            </div>
            
            {insights.learningTrends.recentSuccessRate !== undefined && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#0369a1' }}>
                  {insights.learningTrends.recentSuccessRate}%
                </div>
                <div style={{ fontSize: '12px', color: '#0c4a6e' }}>Recent Success</div>
              </div>
            )}
            
            {insights.learningTrends.consistencyScore !== null && (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#0369a1' }}>
                  {insights.learningTrends.consistencyScore}%
                </div>
                <div style={{ fontSize: '12px', color: '#0c4a6e' }}>Consistency</div>
              </div>
            )}
          </div>

          {insights.strengths.length > 0 && (
            <div style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#0c4a6e', fontWeight: '500' }}>
                Strengths: 
              </span>
              <span style={{ fontSize: '12px', color: '#0369a1', marginLeft: '4px' }}>
                {insights.strengths.join(', ')}
              </span>
            </div>
          )}

          {insights.learningTrends.isImproving !== null && (
            <div style={{ 
              fontSize: '12px', 
              color: insights.learningTrends.isImproving ? '#059669' : '#dc2626',
              fontWeight: '500'
            }}>
              {insights.learningTrends.isImproving ? '📈 Performance improving!' : '📉 Consider reviewing fundamentals'}
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h4 style={{ 
            margin: '0 0 12px 0', 
            color: '#374151', 
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Recommended Next Steps
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recommendations.map((rec, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '12px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '6px',
                  border: '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <span>{getTypeIcon(rec.type)}</span>
                    <Link 
                      to={`/lessons/${rec.lesson.id}`}
                      style={{ 
                        textDecoration: 'none', 
                        color: '#1f2937',
                        fontWeight: '500',
                        fontSize: '14px'
                      }}
                    >
                      {rec.lesson.title}
                    </Link>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '8px',
                      fontSize: '10px',
                      fontWeight: '500',
                      backgroundColor: getPriorityColor(rec.priority),
                      color: 'white'
                    }}>
                      {rec.priority}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {rec.reason} • {rec.lesson.difficulty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {recommendations.length === 0 && insights && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#6b7280',
          fontSize: '14px'
        }}>
          Keep practicing! More personalized recommendations will appear as you complete more lessons.
        </div>
      )}
    </div>
  );
}
import React from 'react';

/**
 * Enhanced progress tracker that shows detailed learning analytics
 */
export default function ProgressTracker({ user, progress, lessons }) {
  const calculateOverallProgress = () => {
    if (!lessons || lessons.length === 0) return { completed: 0, total: 0, percentage: 0 };
    
    let totalTasks = 0;
    let completedTasks = 0;
    
    lessons.forEach(lesson => {
      const lessonTasks = lesson.tasks?.length || 0;
      totalTasks += lessonTasks;
      
      const lessonProgress = progress[lesson.id];
      if (lessonProgress) {
        completedTasks += lessonProgress.completed || 0;
      }
    });
    
    return {
      completed: completedTasks,
      total: totalTasks,
      percentage: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  };

  const getSkillLevel = (percentage) => {
    if (percentage >= 90) return { level: 'Expert', color: '#7c3aed', icon: '🏆' };
    if (percentage >= 70) return { level: 'Advanced', color: '#059669', icon: '⭐' };
    if (percentage >= 40) return { level: 'Intermediate', color: '#d97706', icon: '📈' };
    if (percentage >= 10) return { level: 'Beginner', color: '#dc2626', icon: '🌱' };
    return { level: 'Getting Started', color: '#6b7280', icon: '🚀' };
  };

  const getRecentAchievements = () => {
    const achievements = [];
    
    Object.entries(progress).forEach(([lessonId, lessonProgress]) => {
      const lesson = lessons.find(l => l.id === lessonId);
      if (lesson && lessonProgress.completed > 0) {
        achievements.push({
          title: `Completed ${lessonProgress.completed} tasks in ${lesson.title}`,
          type: 'task_completion',
          lessonId
        });
        
        if (lessonProgress.completed === lesson.tasks?.length) {
          achievements.push({
            title: `Mastered ${lesson.title}! 🎉`,
            type: 'lesson_mastery',
            lessonId
          });
        }
      }
    });
    
    return achievements.slice(-3); // Show last 3 achievements
  };

  const overallProgress = calculateOverallProgress();
  const skillLevel = getSkillLevel(overallProgress.percentage);
  const achievements = getRecentAchievements();

  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#ffffff',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    }}>
      <h3 style={{ 
        margin: '0 0 16px 0', 
        color: '#1f2937',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        📊 Your Learning Progress
      </h3>

      {/* Overall Progress */}
      <div style={{
        padding: '16px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            Overall Progress
          </span>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            {overallProgress.completed}/{overallProgress.total} tasks
          </span>
        </div>
        
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '8px'
        }}>
          <div style={{
            width: `${overallProgress.percentage}%`,
            height: '100%',
            backgroundColor: '#3b82f6',
            transition: 'width 0.5s ease-in-out'
          }} />
        </div>
        
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center'
        }}>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            {overallProgress.percentage}% Complete
          </span>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '2px 8px',
            backgroundColor: skillLevel.color,
            color: 'white',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: '500'
          }}>
            <span>{skillLevel.icon}</span>
            <span>{skillLevel.level}</span>
          </div>
        </div>
      </div>

      {/* Recent Achievements */}
      {achievements.length > 0 && (
        <div>
          <h4 style={{ 
            margin: '0 0 12px 0', 
            fontSize: '14px', 
            fontWeight: '600', 
            color: '#374151' 
          }}>
            Recent Achievements
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {achievements.map((achievement, idx) => (
              <div 
                key={idx}
                style={{
                  padding: '8px 12px',
                  backgroundColor: achievement.type === 'lesson_mastery' ? '#fef3c7' : '#e0f2fe',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: achievement.type === 'lesson_mastery' ? '#92400e' : '#0c4a6e'
                }}
              >
                {achievement.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Streak */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#fef7ff',
        borderRadius: '6px',
        border: '1px solid #e879f9'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '12px',
          color: '#86198f'
        }}>
          <span>🔥</span>
          <span>Keep up the great work! You're building strong algorithmic thinking skills.</span>
        </div>
      </div>
    </div>
  );
}
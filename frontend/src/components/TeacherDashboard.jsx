import React, { useEffect, useState } from "react";
import { fetchSubmissions, fetchLessons } from "../utils/api";
import { LESSONS as LOCAL } from "../data/lessons";

export default function TeacherDashboard() {
  const [submissions, setSubmissions] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchLessons().catch(() => ({ LESSONS: LOCAL })), fetchSubmissions().catch(() => ({ submissions: [] }))])
      .then(([lessRes, subRes]) => {
        const lessonList = lessRes.LESSONS || lessRes || LOCAL;
        setLessons(lessonList);
        setSubmissions(subRes.submissions || subRes || []);
        setLoading(false);
      });
  }, []);

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

  return (
    <div>
      <h2>Teacher Dashboard</h2>
      <div>
        {Object.entries(stats).map(([lessonId, data]) => {
          const lesson = lessons.find(l => l.id === lessonId);
          return (
            <div key={lessonId} style={{border:"1px solid #eee", marginBottom:12, padding:8}}>
              <h3>{lesson?.title || lessonId}</h3>
              <div>Total submissions: {data.totalSubmissions}</div>
              <div style={{marginTop:8}}>
                {Object.entries(data.tasks).map(([taskId, tdata]) => (
                  <div key={taskId} style={{marginTop:6}}>
                    <strong>Task {taskId}</strong> — submissions {tdata.submissions}
                    <div style={{fontSize:13, color:"#666"}}>
                      Failing tests:
                      <ul>
                        {Object.entries(tdata.failingTests).map(([testId, count]) => (
                          <li key={testId}>Test #{testId}: {count} failures</li>
                        ))}
                        {Object.keys(tdata.failingTests).length === 0 && <li>None</li>}
                      </ul>
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

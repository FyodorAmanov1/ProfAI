import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import LessonList from "./components/LessonList";
import LessonViewer from "./components/LessonViewer";
import TeacherDashboard from "./components/TeacherDashboard";

export default function App() {
  // top-level user/progress state
  const [user] = useState({ id: "student-1" }); // in real app, pull from auth
  const [progress, setProgress] = useState({}); // progress[lessonId] = { completed: N }

  function handleProgressUpdate(lessonId, taskId, submission) {
    setProgress(prev => {
      const prevLesson = prev[lessonId] || { completed: 0, tasks: {} };
      const tasks = { ...prevLesson.tasks, [taskId]: submission.results.every(r => r.passed) };
      const completed = Object.values(tasks).filter(Boolean).length;
      return { ...prev, [lessonId]: { completed, tasks } };
    });
  }

  return (
    <BrowserRouter>
      <div style={{display:"flex", gap:24}}>
        <nav style={{minWidth:220, padding:12, borderRight:"1px solid #eee"}}>
          <h1>ProfAI</h1>
          <ul style={{listStyle:"none", padding:0}}>
            <li><Link to="/">Lessons</Link></li>
            <li><Link to="/teacher">Teacher Dashboard</Link></li>
          </ul>
        </nav>
        <main style={{padding:12, flex:1}}>
          <Routes>
            <Route path="/" element={<LessonList user={user} progress={progress} />} />
            <Route path="/lessons/:lessonId" element={<LessonViewer user={user} onProgressUpdate={handleProgressUpdate} />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
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
    <div style={{ 
        display: "flex", 
        minHeight: "100vh",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
      }}>
        <nav style={{
          minWidth: 250, 
          padding: 24, 
          borderRight: "1px solid #e2e8f0",
          backgroundColor: "#f8fafc"
        }}>
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ 
              margin: 0, 
              color: "#1a202c", 
              fontSize: "24px",
              fontWeight: "700"
            }}>
              🧠 ProfAI
            </h1>
            <p style={{ 
              margin: "4px 0 0 0", 
              color: "#718096", 
              fontSize: "14px" 
            }}>
              Learn Algorithms Interactively
            </p>
          </div>
          
          <ul style={{ 
            listStyle: "none", 
            padding: 0, 
            margin: 0,
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <li>
              <Link 
                to="/" 
                style={{ 
                  textDecoration: "none", 
                  color: "#4a5568",
                  display: "block",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={e => e.target.style.backgroundColor = "#edf2f7"}
                onMouseLeave={e => e.target.style.backgroundColor = "transparent"}
              >
                📚 Algorithm Lessons
              </Link>
            </li>
            <li>
              <Link 
                to="/teacher" 
                style={{ 
                  textDecoration: "none", 
                  color: "#4a5568",
                  display: "block",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  transition: "background-color 0.2s"
                }}
                onMouseEnter={e => e.target.style.backgroundColor = "#edf2f7"}
                onMouseLeave={e => e.target.style.backgroundColor = "transparent"}
              >
                👨‍🏫 Teacher Dashboard
              </Link>
            </li>
          </ul>
        </nav>
        
        <main style={{ 
          padding: 32, 
          flex: 1,
          backgroundColor: "#ffffff",
          overflow: "auto"
        }}>
          <Routes>
            <Route path="/" element={<LessonList user={user} progress={progress} />} />
            <Route path="/lessons/:lessonId" element={<LessonViewer user={user} onProgressUpdate={handleProgressUpdate} />} />
            <Route path="/teacher" element={<TeacherDashboard />} />
          </Routes>
        </main>
      </div>
  );
}
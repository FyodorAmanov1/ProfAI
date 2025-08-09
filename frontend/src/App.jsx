import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import LessonList from './components/LessonList'
import LessonViewer from './components/LessonViewer'
import Playground from './components/Playground'
import Quiz from './components/Quiz'
import TeacherDashboard from './components/TeacherDashboard'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto p-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">ProfAI — Vibe Coding</h1>
          <nav className="space-x-4">
            <Link to="/" className="hover:underline">Lessons</Link>
            <Link to="/playground" className="hover:underline">Playground</Link>
            <Link to="/quiz" className="hover:underline">Quiz</Link>
            <Link to="/teacher" className="hover:underline">Teacher</Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <Routes>
          <Route path="/" element={<LessonList />} />
          <Route path="/lesson/:id" element={<LessonViewer />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
        </Routes>
      </main>
    </div>
  )
}
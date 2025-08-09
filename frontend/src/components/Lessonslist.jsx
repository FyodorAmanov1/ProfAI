import React from 'react'
import { Link } from 'react-router-dom'
import LESSONS from '../data/lessons'

export default function LessonList() {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Lessons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {LESSONS.map(lesson => (
          <article key={lesson.id} className="p-4 bg-white rounded shadow-sm">
            <h3 className="text-lg font-medium">{lesson.title}</h3>
            <p className="text-sm text-gray-600">{lesson.description}</p>
            <div className="mt-3">
              <Link to={`/lesson/${lesson.id}`} className="text-sm font-medium text-indigo-600">Open lesson →</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
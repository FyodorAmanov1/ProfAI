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
      <h2>Lessons</h2>
      {loading ? <p>Loading...</p> : (
        <ul>
          {lessons.map(lesson => (
            <li key={lesson.id} style={{marginBottom:12}}>
              <Link to={`/lessons/${lesson.id}`}><strong>{lesson.title}</strong></Link>
              <div style={{fontSize:12}}>{lesson.description}</div>
              <div style={{fontSize:12, color:"#666"}}>
                Progress: {(progress && progress[lesson.id]) ? `${progress[lesson.id].completed || 0}/${lesson.tasks.length}` : `0/${lesson.tasks.length}`}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

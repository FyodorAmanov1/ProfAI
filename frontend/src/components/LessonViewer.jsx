import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LESSONS as LOCAL } from "../data/lessons";
import { fetchLessons, postSubmission } from "../utils/api";
import Quiz from "./Quiz";
import Playground from "./Playground";
import { getNextHint } from "../utils/hints";

export default function LessonViewer({ user, onProgressUpdate }) {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);

  useEffect(() => {
    fetchLessons().then(data => {
      const list = data.LESSONS || data || LOCAL;
      const found = list.find(l => l.id === lessonId);
      setLesson(found);
    }).catch(() => {
      const found = LOCAL.find(l => l.id === lessonId);
      setLesson(found);
    });
  }, [lessonId]);

  if (!lesson) return <div>Lesson not found</div>;

  return (
    <div>
      <h2>{lesson.title}</h2>
      <p>{lesson.description}</p>
      {lesson.tasks.map((task) => (
        <div key={task.id} style={{border: "1px solid #eee", padding: 12, marginBottom: 12}}>
          <h3>{task.title}</h3>
          <p>{task.description}</p>

          <Playground
            task={{...task, lessonId: lesson.id}}
            onSubmit={async (code, useServer=false) => {
              // grade locally or send to server
              // Quiz handles actual grading; Playground can forward to Quiz or API
              const submission = { code, lessonId: lesson.id, taskId: task.id, userId: user?.id };
              if (useServer) {
                // backend returns submission.results
                const serverRes = await postSubmission(submission);
                return serverRes.submission.results;
              }
              return null;
            }}
          />

          <Quiz
            task={{...task, lessonId: lesson.id}}
            user={user}
            onSubmissionSaved={(submission) => {
              // inform parent of progress if needed
              if (onProgressUpdate) onProgressUpdate(lesson.id, task.id, submission);
            }}
            getHint={(submissionResults) => getNextHint(task, submissionResults)}
          />
        </div>
      ))}
    </div>
  );
}

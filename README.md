# ProfAI · Interactive Algorithm Learning

**Learn a concept, attempt a small programming task and use feedback to choose what to practice next.**

ProfAI is an educational application prototype combining React lesson screens with JavaScript exercises and an Express backend. It explores the learning loop between explanation, practice, feedback and progress tracking.

## Learning experience

- Browse algorithm lessons and open explanations with practical tasks.
- Answer quizzes and write JavaScript solutions in the playground.
- Compare a solution's output with exercise cases and inspect error feedback.
- Request hints and rule-based tutoring responses tied to the task.
- Explore recommendation and progress components based on learner activity.

The tutor's present responses are implemented with local rules and templates. They are not evidence of a trained model or a live LLM integration. The teacher-dashboard component is currently a placeholder.

## Repository structure

| Directory | Contents |
|---|---|
| [frontend](frontend/) | React/Vite interface, lesson data, local grader, hints and learning utilities |
| [backend](backend/) | Express lesson, submission and analytics routes |

The frontend includes local lesson data and a browser-side exercise runner. The backend stores submissions in memory and includes a separate Node VM-based grading path.

## Development entry points

Install dependencies in each application directory. In the first terminal:

```bash
cd backend
npm install
npm start
```

The backend defaults to port 5000. In another terminal, from the repository root:

```bash
cd frontend
npm install
npm run dev
```

The frontend script uses port 3000. API wiring needs attention before treating these commands as a complete connected deployment: the frontend fetch helper uses relative URLs and a `process.env.REACT_APP_API_BASE` convention, while the build tool is Vite. No API proxy configuration is included. Review [the fetch helper](frontend/src/utils/api.js) when connecting the two applications.

## Design boundaries

Progress in the current application is demo state, and backend submissions do not survive a restart. The example user and teacher view are not a complete authentication or classroom-management system.

Both graders are intended for controlled exercises. Browser `new Function` and Node's `vm` should not be presented as a hardened service for arbitrary untrusted code. A public submission platform would need a separate execution boundary and persistent storage.

## Explore the code

Start with [the React application](frontend/src/App.jsx), [lesson viewer](frontend/src/components/LessonViewer.jsx), [local grader](frontend/src/utils/grader.js) and [backend routes](backend/routes/). These show the implemented interaction more accurately than the product's aspirational AI label alone.

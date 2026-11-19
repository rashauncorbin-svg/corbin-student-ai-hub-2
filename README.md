# Corbin Student AI Hub 2.0

A student-centered learning platform organized around the Corbin Learning System (CLS): **Learn It → Process It → Defend It → Apply It → Reflect On It**.

## Current build: Student experience foundation

The staging branch contains a responsive front-end preview with:

- Student overview dashboard and course cards for U.S. History Standard, U.S. History Honors, Psychology, and Sociology
- Navigation for overview, courses, learning path, and AI study partner
- CLS learning-path progress visualization
- Lesson-player preview with an essential question and written thinking checkpoint
- Guided study-partner interface showing where a secured AI integration will connect
- Mobile navigation and responsive layouts
- Baseline static-host security headers

## Important implementation boundaries

This is currently a **front-end prototype**, not a production student information system. Course progress and sample counts are illustrative preview data. Checkpoint responses are not persisted. The study-partner interface does not call a live model. There is no student authentication, teacher authorization, class isolation, gradebook, or Canvas integration in this initial build.

Do not enter real student names, grades, IEP/504 information, or other student records into this preview.

## Planned architecture

- Cloudflare Pages: static application hosting
- Cloudflare Workers: authenticated API and server-side orchestration
- Cloudflare D1: relational data for classes, enrollments, lessons, and submissions
- Cloudflare R2: controlled storage for lesson assets and uploads
- Server-side model gateway: AI tutoring with teacher-controlled permissions and usage limits

## Development

- Production baseline: `main`
- Active development: `staging/student-hub-v2`
- Keep development isolated from existing production apps.
- Never place API secrets in browser code.
- Implement authentication, role-based authorization, data validation, and class-level access controls before using real student data.
- Test each backend workflow before describing it as production-ready.

## Local preview

Open `index.html` in a modern browser, or serve this directory with any static HTTP server. No build step is required for the current front-end preview.

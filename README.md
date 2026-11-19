# Corbin Student AI Hub 2.0

A student-centered learning platform organized around the Corbin Learning System (CLS): **Learn It → Process It → Defend It → Apply It → Reflect On It**.

## Current staging build

### Student experience
- Responsive student dashboard and four course spaces: U.S. History Standard, U.S. History Honors, Psychology, and Sociology.
- Interactive lesson player with five navigable CLS phases.
- Thinking checkpoints that save locally in the current browser.
- Course-specific essential questions and guided prompts.
- Socratic study-partner interface with guided response patterns; this is not a live AI model connection.
- Student-to-teacher workspace navigation.

### Teacher workspace
- Separate teacher command-center preview at `teacher.html`.
- Local class organization for the four course spaces.
- Local assignment planner tagged to CLS phases.
- Student work review area with the security boundary clearly identified.
- Teacher preview records remain in the browser's local storage and are not connected to student accounts or a server.

### Backend foundation
- Cloudflare Worker API shell under `worker/`.
- D1 relational schema and initial migration for users, classes, enrollments, lessons, and submissions.
- Public course catalogue and health endpoints.
- Protected API routes fail closed until authentication and authorization are implemented.
- Wrangler configuration template for staging.

### Automated checks
GitHub Actions runs `node scripts/validate.mjs` on pushes to the staging and main branches and on pull requests. It checks JavaScript syntax, required frontend asset references, and the initial database table definitions.

## Important implementation boundaries

This remains a **staging prototype**, not a production student information system. Preview progress, classes, and assignment plans are stored locally in the browser only. They do not sync across devices or appear in a teacher's account. The tutor does not call a live model. There is no student authentication, teacher authorization, class isolation, gradebook, or Canvas integration yet.

Do not enter real student names, grades, IEP/504 information, or other student records into this preview. Do not put API keys or credentials in frontend files or this public repository.

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

Open `index.html` or `teacher.html` in a modern browser. No frontend build step is required. Run `node scripts/validate.mjs` to perform the repository's automated source and asset checks.

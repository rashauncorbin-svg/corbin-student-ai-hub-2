# Corbin Student AI Hub 2.0

A student-centered learning platform built around the Corbin Learning System (CLS): Learn It, Process It, Defend It, Apply It, Reflect On It.

## Status

Initial repository bootstrap. Development is isolated from existing production applications.

## Planned architecture

- Student learning dashboard and course navigation
- CLS lesson player with progress checkpoints
- Socratic AI tutor interface (provider integration required)
- Teacher command center and class-level analytics
- Role-based authentication and protected student data
- Cloudflare Pages + Workers + D1 + R2 deployment target

## Development

The staging branch is `staging/student-hub-v2`. Features must be tested before production deployment. No student records or API secrets belong in client-side code.

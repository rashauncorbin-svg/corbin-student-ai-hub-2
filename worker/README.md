# Student Hub API (staging)

This directory is the Cloudflare Workers API foundation for Corbin Student AI Hub 2.0.

## Current endpoints

- `GET /api/health` — reports service and binding configuration.
- `GET /api/courses` — returns the four course catalogue entries.
- Other `/api/*` routes fail closed with HTTP 503 until authentication and authorization are implemented.

## Required before protected workflows

1. Create a Cloudflare Worker and D1 database in the project account.
2. Replace the placeholder D1 database ID in `wrangler.toml`.
3. Configure exact staging origins in the `ALLOWED_ORIGINS` variable.
4. Select and configure a student/teacher identity provider. Validate signed tokens server-side, including issuer, audience, expiry, and subject.
5. Enforce role checks and class membership in every read/write query. A class join code is an enrollment mechanism, never proof of identity.
6. Apply the SQL schema with Wrangler migrations after reviewing the target database.
7. Add server-side AI provider credentials as Worker secrets. Never expose them in frontend JavaScript.
8. Test student isolation, teacher class boundaries, invalid tokens, cross-class access, input limits, and rate limits before enabling real student data.

## Local checks

Install Wrangler in a development environment, then run:

```sh
npx wrangler dev
```

Do not deploy this Worker or connect real student records until the authentication gate is replaced with a tested implementation. The current 503 behavior is intentional.

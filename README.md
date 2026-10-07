# Next Devotion

A modern devotion application built with Next.js, TypeScript, Tailwind CSS, shadcn/ui, PostgreSQL, and Prisma ORM.

## Stack

- Next.js 16.4
- React 19.3
- TypeScript 7
- Tailwind CSS 4.3
- shadcn 4
- PostgreSQL
- Prisma ORM 7.10
- bcrypt.js 3
- Zod 4
- Vitest 5
- Playwright 1.63

## Development

Install dependencies:

```bash
npm install
```

Create your local environment file:

```bash
cp .env.example .env
```

Set `DATABASE_URL` to a PostgreSQL connection string, then generate Prisma Client:

```bash
npm run db:generate
```

Create and apply the first development migration after a database is available:

```bash
npm run db:migrate -- --name init
```

Start the application:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Authentication

Authentication is database-backed.

- Passwords are hashed with bcrypt.
- Login sessions use cryptographically random opaque tokens.
- Only SHA-256 hashes of session tokens are stored in PostgreSQL.
- Session cookies are HttpOnly, SameSite=Lax, and Secure in production.
- Sessions expire after 30 days.
- Authenticated routes live inside the `(app)` route group and use a server-side session guard.

No separate authentication secret is required for the current opaque-session design.

## Database commands

```bash
npm run db:generate
npm run db:validate
npm run db:format
npm run db:migrate
npm run db:deploy
npm run db:studio
```

Prisma Client is generated into `src/generated/prisma` and is intentionally ignored by Git.

Whenever `prisma/schema.prisma` changes, regenerate the client and create a development migration before deploying.

## shadcn/ui

The shadcn registry is configured through `components.json` using the current `base-nova` style.

Add components with:

```bash
npx shadcn@latest add button
```

## Testing

Unit tests cover validation, privacy rules, Scripture reference helpers, UUID validation, and feed/journal/saved cursor encoding.

```bash
npm run test
npm run test:unit
npm run test:unit:watch
```

Browser tests use Playwright. Install Chromium once on a development machine:

```bash
npm run test:e2e:install
```

Then run:

```bash
npm run test:e2e
```

The public browser suite runs without an authenticated account. The authenticated lifecycle test is opt-in: configure a dedicated non-production test account through `E2E_EMAIL` and `E2E_PASSWORD`, make sure `DATABASE_URL` points to the intended test/development database, generate Prisma Client, and apply the required migrations before running Playwright.

`PLAYWRIGHT_BASE_URL` can point the browser tests at an already-running deployment. When it is unset, Playwright starts `npm run dev` automatically.

GitHub Actions runs unit tests and the public Playwright suite on `main` pushes and pull requests. Authenticated browser tests are intentionally not run in CI until a dedicated test database and credentials are configured.

# Manual Vercel Deployment

Next Devotion is configured for manual Vercel releases. Automatic Git-triggered Vercel deployments are disabled in `vercel.json`.

## 1. Install and generate the client

Use Node.js 24 (Node.js 26 is also supported):

```bash
npm ci
npm run db:generate
npm run db:validate
```

Set `DATABASE_URL` to a PostgreSQL connection in your environment. The repository now includes the initial migration; do not generate a new initial migration.

## 2. Run repository preflight

```bash
npm run deployment:check
npm run check
npm run build
npm run security:audit
```

`deployment:check` verifies Node, the lockfile, committed Prisma migrations, the build contract, and the manual Vercel deployment setting.

## 3. Create the Vercel project

Import `justinangeloperez327/next-devotion` into Vercel.

Recommended project settings:

- Framework Preset: Next.js
- Root Directory: repository root
- Node.js: 24.x
- Build Command: use the committed `vercel.json` command: `npm run db:deploy && npm run build`
- Install Command: use npm (after the lockfile is committed, Vercel can use the lockfile automatically)
- Output Directory: leave unset

Automatic Git deployment is disabled by the repository's `vercel.json`.

## 4. Configure Vercel environment variables

Production requires:

```env
DATABASE_URL="..."
```

The Prisma Postgres Vercel integration creates this variable automatically when connected.

Do not add JWT/session secrets for the current authentication design. Sessions use random opaque tokens stored as SHA-256 hashes in PostgreSQL.

Test-only variables such as `E2E_EMAIL`, `E2E_PASSWORD`, and `PLAYWRIGHT_BASE_URL` are not required in Production.

## 5. Apply production migrations

For a new, empty PostgreSQL database, apply the committed migrations from a trusted administrative environment:

```bash
npm run db:deploy
npm run db:status
```

For an existing database with tables or user data, back it up and compare its schema first. Do not reset it or blindly run the initial migration. If its schema exactly matches `20261019000000_initial_schema`, baseline that migration with `prisma migrate resolve --applied 20261019000000_initial_schema --config ./prisma7.config.ts`. If it differs, reconcile those differences before baselining. The initial migration includes `users`, `sessions`, and `rate_limit_buckets`; all three are required for authentication.

Use the production `DATABASE_URL` for this operation. `db:status` should report that the database schema is up to date.

Vercel now runs `npm run db:deploy` before `npm run build` through `vercel.json`. Manual deployment remains required. A failed migration stops the build; no reset or automatic baseline is attempted. Standalone `npm run build` remains database-independent for quality checks.

## 6. Deploy manually

Use the Vercel dashboard's Deploy action or the Vercel CLI:

```bash
vercel --prod
```

The Vercel build runs:

```bash
npm run db:deploy && npm run build
```

The second command generates Prisma Client and builds Next.js. Check the build log for successful migration application. If Prisma reports an existing non-empty schema or a failed migration, inspect and reconcile it using the existing-database instructions above; do not reset it.

## 7. Production smoke check

After deployment verify:

- `/api/health` returns HTTP 200 with `{"status":"ok","database":"ok"}`
- `/`
- `/register`
- `/login`
- account registration/login
- create a private devotion
- create a public devotion
- feed visibility
- comments
- Amen toggle
- Save toggle
- profile/settings
- logout/login again

Also inspect Vercel runtime logs for database, Prisma, CSP, or Server Action errors.

## Required before first production release

- [ ] `package-lock.json` committed
- [ ] Prisma migration files committed
- [ ] Production PostgreSQL database created
- [ ] `DATABASE_URL` configured in Vercel
- [ ] `npm run db:deploy` applied successfully
- [ ] `npm run deployment:check` passes
- [ ] `npm run check` passes
- [ ] `npm run build` passes
- [ ] production dependency audit reviewed


## Authentication troubleshooting

Both registration and login use PostgreSQL-backed rate limits before looking up an account. A missing `rate_limit_buckets` table can therefore break both flows even if `users` already exists. Check `/api/health` and the Vercel runtime logs. Authentication errors log only the operation and an error code, never credentials or connection strings. `P2021` commonly indicates a missing table; `P2022` a missing column; connection errors require checking `DATABASE_URL` and database availability. The health endpoint checks connectivity, not complete schema compatibility.

Form messages distinguish incorrect credentials, duplicate accounts, request limits, and service failures. If account creation succeeds but automatic sign-in fails, the form tells the user to log in rather than register again. Successful redirects stay outside exception handlers.

`ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` are not consumed by this repository. Adding those variables alone does not create an account. Use registration for an ordinary account; this change does not add administrator roles.

Browser CI provisions an isolated PostgreSQL service, applies the committed migrations, and tests registration → session persistence → logout → invalid password → login on desktop and mobile. To run that test against your own disposable test database, set `E2E_AUTH_ENABLED=true`. Do not point it at production.

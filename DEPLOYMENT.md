# Manual Vercel Deployment

Next Devotion is configured for manual Vercel releases. Automatic Git-triggered Vercel deployments are disabled in `vercel.json`.

## 1. Finish the two repository artifacts

Use Node.js 24 locally.

```bash
node --version
npm install
```

`npm install` must create `package-lock.json`. Commit the lockfile.

Configure a PostgreSQL connection in `.env`:

```env
DATABASE_URL="postgresql://..."
```

Prisma Postgres on Vercel provides `DATABASE_URL` automatically when the database is connected to the project.

Generate Prisma Client and create the initial migration against a development database:

```bash
npm run db:generate
npm run db:validate
npm run db:migrate -- --name init
```

Commit the generated `prisma/migrations/**/migration.sql` files.

Do not create the initial development migration directly against the production database.

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
- Build Command: use the repository `npm run build`
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

Before the first production release, apply the committed migrations against the production database from a trusted local/administrative environment:

```bash
npm run db:deploy
```

Use the production `DATABASE_URL` for this operation.

Database migrations are deliberately not executed by the Vercel application build.

## 6. Deploy manually

Use the Vercel dashboard's Deploy action or the Vercel CLI:

```bash
vercel --prod
```

The application build runs:

```bash
prisma generate --config ./prisma7.config.ts && next build
```

## 7. Production smoke check

After deployment verify:

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

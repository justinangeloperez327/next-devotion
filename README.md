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

## shadcn/ui

The shadcn registry is configured through `components.json` using the current `base-nova` style.

Add components with:

```bash
npx shadcn@latest add button
```

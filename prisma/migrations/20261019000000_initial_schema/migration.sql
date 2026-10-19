-- Initial PostgreSQL schema generated from prisma/schema.prisma.
CREATE SCHEMA IF NOT EXISTS "public";
CREATE TYPE "DevotionVisibility" AS ENUM ('PUBLIC', 'PRIVATE');

CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "username" VARCHAR(30) NOT NULL,
    "email" VARCHAR(254) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "avatarUrl" VARCHAR(2048),
    "bio" VARCHAR(280),
    "defaultDevotionVisibility" "DevotionVisibility" NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "sessions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "tokenHash" CHAR(64) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "devotions" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "scriptureReference" VARCHAR(120) NOT NULL,
    "scriptureText" VARCHAR(1200),
    "observation" VARCHAR(4000) NOT NULL,
    "application" VARCHAR(4000) NOT NULL,
    "prayer" VARCHAR(4000) NOT NULL,
    "visibility" "DevotionVisibility" NOT NULL DEFAULT 'PUBLIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "devotions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "amens" (
    "userId" UUID NOT NULL,
    "devotionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "amens_pkey" PRIMARY KEY ("userId", "devotionId")
);

CREATE TABLE "comments" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "devotionId" UUID NOT NULL,
    "body" VARCHAR(2000) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "saved_devotions" (
    "userId" UUID NOT NULL,
    "devotionId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "saved_devotions_pkey" PRIMARY KEY ("userId", "devotionId")
);

CREATE TABLE "rate_limit_buckets" (
    "key" CHAR(64) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "rate_limit_buckets_pkey" PRIMARY KEY ("key")
);

CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");
CREATE UNIQUE INDEX "sessions_tokenHash_key" ON "sessions"("tokenHash");
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");
CREATE INDEX "sessions_expiresAt_idx" ON "sessions"("expiresAt");
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "devotions_userId_createdAt_id_idx" ON "devotions"("userId", "createdAt", "id");
CREATE INDEX "devotions_userId_visibility_createdAt_id_idx" ON "devotions"("userId", "visibility", "createdAt", "id");
CREATE INDEX "devotions_visibility_createdAt_id_idx" ON "devotions"("visibility", "createdAt", "id");
ALTER TABLE "devotions" ADD CONSTRAINT "devotions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "amens_devotionId_createdAt_idx" ON "amens"("devotionId", "createdAt");
ALTER TABLE "amens" ADD CONSTRAINT "amens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "amens" ADD CONSTRAINT "amens_devotionId_fkey" FOREIGN KEY ("devotionId") REFERENCES "devotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "comments_devotionId_createdAt_id_idx" ON "comments"("devotionId", "createdAt", "id");
CREATE INDEX "comments_userId_createdAt_idx" ON "comments"("userId", "createdAt");
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "comments" ADD CONSTRAINT "comments_devotionId_fkey" FOREIGN KEY ("devotionId") REFERENCES "devotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "saved_devotions_userId_createdAt_devotionId_idx" ON "saved_devotions"("userId", "createdAt", "devotionId");
CREATE INDEX "saved_devotions_devotionId_idx" ON "saved_devotions"("devotionId");
ALTER TABLE "saved_devotions" ADD CONSTRAINT "saved_devotions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "saved_devotions" ADD CONSTRAINT "saved_devotions_devotionId_fkey" FOREIGN KEY ("devotionId") REFERENCES "devotions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
CREATE INDEX "rate_limit_buckets_expiresAt_idx" ON "rate_limit_buckets"("expiresAt");

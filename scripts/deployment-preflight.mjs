import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const errors = [];
const warnings = [];

function pass(message) {
  console.log(`✓ ${message}`);
}

function fail(message) {
  errors.push(message);
  console.error(`✗ ${message}`);
}

function warn(message) {
  warnings.push(message);
  console.warn(`! ${message}`);
}

const nodeMajor = Number(process.versions.node.split(".")[0]);

if (nodeMajor >= 24) {
  pass(`Node.js ${process.versions.node}`);
} else {
  fail(
    `Node.js 24 or newer is required; current runtime is ${process.versions.node}.`,
  );
}

const packageJson = JSON.parse(readFileSync("package.json", "utf8"));

if (packageJson.engines?.node === "24.x") {
  pass("package.json requires Node.js 24.x");
} else {
  fail("package.json must keep engines.node set to 24.x");
}

if (
  typeof packageJson.scripts?.build === "string" &&
  packageJson.scripts.build.includes("prisma generate") &&
  packageJson.scripts.build.includes("next build")
) {
  pass("Production build generates Prisma Client before Next.js build");
} else {
  fail("Build script must generate Prisma Client before next build");
}

if (existsSync("package-lock.json")) {
  pass("package-lock.json is committed/present");
} else {
  fail("package-lock.json is missing; run npm install with Node.js 24 and commit it");
}

const migrationsRoot = "prisma/migrations";
let migrationFiles = [];

if (existsSync(migrationsRoot)) {
  migrationFiles = readdirSync(migrationsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(migrationsRoot, entry.name, "migration.sql"))
    .filter((file) => existsSync(file));
}

if (migrationFiles.length > 0) {
  pass(`Found ${migrationFiles.length} Prisma migration(s)`);
} else {
  fail(
    "No Prisma migration is committed; create the initial migration before production deployment",
  );
}

if (existsSync("vercel.json")) {
  const vercel = JSON.parse(readFileSync("vercel.json", "utf8"));

  if (vercel.git?.deploymentEnabled === false) {
    pass("Automatic Vercel Git deployments are disabled");
  } else {
    fail("vercel.json must disable Git deployments for the manual deployment workflow");
  }
} else {
  fail("vercel.json is missing");
}

if (process.env.DATABASE_URL) {
  pass("DATABASE_URL is available in the current shell");
} else {
  warn(
    "DATABASE_URL is not available locally; make sure it is configured in Vercel before building",
  );
}

console.log("");

if (errors.length > 0) {
  console.error(
    `Deployment preflight failed with ${errors.length} blocking issue(s).`,
  );
  process.exit(1);
}

console.log(
  `Deployment preflight passed${warnings.length ? ` with ${warnings.length} warning(s)` : ""}.`,
);

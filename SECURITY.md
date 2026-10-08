# Security Policy

## Supported code

Security fixes target the current `main` branch.

## Reporting a vulnerability

Do not publish credentials, session tokens, database connection strings, or exploit details in a public issue.

Use GitHub's private vulnerability reporting flow for this repository when available, or contact the repository owner privately with:

- the affected route or feature
- reproduction steps
- expected and actual behavior
- security impact
- any proof-of-concept details needed to reproduce safely

## Operational requirements

Production deployments must:

- use HTTPS
- use Node.js 24 LTS
- keep `.env*` secrets outside source control
- apply Prisma migrations before serving traffic
- use a managed/trusted reverse proxy or hosting platform
- enable provider-level firewall/rate limiting in addition to application limits
- use a dedicated non-production database/account for authenticated E2E tests
- rotate compromised database credentials and invalidate affected sessions immediately

The application stores only SHA-256 hashes of random session tokens in PostgreSQL. Passwords are stored as bcrypt hashes.

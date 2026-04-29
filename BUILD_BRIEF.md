# Build Brief - Professional Software Development Process

Use this as a build brief for your AI developer. It is written to force a standard, production-style workflow from day one.

## Master Build Instruction

Build the entire project using a professional software development process from planning through deployment. Do not just generate code quickly. Follow a real-world engineering workflow with clear architecture, version control discipline, containerization, testing, documentation, and deployment readiness.

## Core Objective

Take the product idea from zero to a working, documented, deployable application that can be run locally with Docker, managed in GitHub, tested automatically, and extended safely.

## Required Working Style

1. Start by clarifying requirements before coding.
2. Produce a project plan with phases, architecture, tech stack, folder structure, and milestones.
3. Build in small increments, with each step leaving the project runnable.
4. Use clean Git practices with meaningful commits.
5. Containerize the app so it runs consistently on any machine.
6. Add automated tests and basic CI.
7. Document everything needed for another developer to run and maintain it.
8. Do not leave placeholder architecture or fake integrations unless clearly marked.
9. Prefer boring, standard, maintainable choices over trendy complexity.

## Development Process To Follow

### 1. Discovery and Requirement Definition

Before writing code:
1. Restate the product goal in plain English.
2. Identify the users, core use cases, and success criteria.
3. List assumptions.
4. List open questions that need answers.
5. Separate MVP features from later features.
6. Define non-functional requirements:
   - performance
   - security
   - scalability
   - maintainability
   - accessibility if frontend exists
   - observability/logging
7. Write a short technical specification before implementation.

**Deliverables for this phase:**
- `docs/requirements.md`
- `docs/mvp-scope.md`
- `docs/architecture.md`

### 2. Choose a Sensible Standard Stack

If the stack is not specified, default to mainstream tools with strong ecosystem support.

**Recommended default:**
- Frontend: `Next.js` with `TypeScript`
- Backend: `Node.js` with `TypeScript` using `NestJS` or `Express`
- Database: `PostgreSQL`
- ORM: `Prisma`
- Auth: JWT or session-based auth depending on app type
- Styling: `Tailwind CSS` if frontend exists
- Testing: `Vitest` or `Jest`, plus `Playwright` for e2e
- API: REST by default unless GraphQL is clearly justified
- Containerization: `Docker` and `docker-compose`
- CI/CD: `GitHub Actions`
- Lint/format: `ESLint` and `Prettier`

**If Python is better for the project, use:**
- Backend: `FastAPI`
- Database: `PostgreSQL`
- ORM: `SQLAlchemy`
- Testing: `pytest`

Only choose a different stack if there is a clear technical reason.

### 3. Repository Setup

Create a clean GitHub-ready repository structure.

**Standard structure:**
```
project-root/
  apps/
    web/
    api/
  packages/
    shared/
  docs/
  scripts/
  infrastructure/
  .github/workflows/
  .env.example
  docker-compose.yml
  README.md
```

**If monorepo is unnecessary, use:**
```
project-root/
  src/
  tests/
  docs/
  scripts/
  .github/workflows/
  Dockerfile
  docker-compose.yml
  README.md
```

**Repository standards:**
1. Initialize git immediately.
2. Add a proper `.gitignore`.
3. Add a `README.md` from the start.
4. Add license if requested.
5. Protect secrets. Never commit real credentials.
6. Add `.env.example` with all required environment variables documented.

### 4. Git and Branching Process

Use a standard Git workflow.

**Rules:**
1. `main` must always stay deployable.
2. Work in short-lived feature branches:
   - `feature/auth`
   - `feature/dashboard`
   - `fix/login-validation`
3. Use clear commit messages:
   - `feat: add user registration endpoint`
   - `fix: handle expired jwt tokens`
   - `docs: add local setup instructions`
4. Open pull-request-style summaries even if working alone.
5. Squash noisy commits before final merge if needed.
6. Do not mix unrelated changes in one commit.

### 5. Planning Before Code

Before implementation, create:
1. System architecture overview
2. Data model / ERD
3. API contract
4. Main user flows
5. Deployment model
6. Risk list

**Deliverables:**
- `docs/architecture.md`
- `docs/data-model.md`
- `docs/api-spec.md`
- `docs/deployment.md`

**Architecture doc should include:**
- app components
- how frontend talks to backend
- how backend talks to database
- auth flow
- file storage strategy if needed
- third-party integrations
- background jobs if any

### 6. Environment and Tooling

Set up the project to be reproducible.

**Required:**
1. Node/Python version file:
   - `.nvmrc` for Node
   - `.python-version` for Python
2. Dependency lock file:
   - `package-lock.json`, `pnpm-lock.yaml`, or `poetry.lock`
3. Linting and formatting
4. Pre-commit hooks if practical
5. Scripts for common tasks:
   - install
   - dev
   - build
   - test
   - lint
   - format
   - db:migrate
   - db:seed

**Example `README` commands:**
```bash
docker compose up --build
npm install
npm run dev
npm run test
npm run lint
```

### 7. Docker Standard

The project must run through Docker in a standard developer-friendly way.

**Requirements:**
1. Create a `Dockerfile` for each app if needed.
2. Create a `docker-compose.yml` for local development.
3. Include services like:
   - app/web
   - api
   - postgres
   - redis if needed
4. Use volumes where appropriate for local dev.
5. Support environment variables through `.env`.
6. Make sure one command can start the full local stack.

**Example expectations:**
- `docker compose up --build` starts the whole app
- database comes up automatically
- migrations can be run in container
- app logs are visible
- health checks exist for critical services

**Also include:**
- production-safe Dockerfile layering
- slim base images
- non-root user when practical
- `.dockerignore`

### 8. Configuration Management

Handle config properly.

**Rules:**
1. Put all environment variables in `.env.example`
2. Separate dev/test/prod configuration clearly
3. Never hardcode secrets
4. Validate env vars at startup
5. Document every env variable in `README.md`

**Typical env vars:**
```env
NODE_ENV=
PORT=
DATABASE_URL=
JWT_SECRET=
REDIS_URL=
NEXT_PUBLIC_API_URL=
```

### 9. Database Process

Use a disciplined database workflow.

**Rules:**
1. Define schema early
2. Use migrations, not manual database changes
3. Seed local development data
4. Add indexes where needed
5. Add constraints for data integrity
6. Document entities and relationships

**Deliverables:**
- migration files
- seed scripts
- schema docs

**If using Prisma:**
- include `prisma/schema.prisma`
- include migration scripts
- include seed command

### 10. API Development Standards

If the project has a backend API, follow this structure:

**Requirements:**
1. Version API routes, e.g. `/api/v1/...`
2. Validate all input
3. Return consistent error responses
4. Add authentication and authorization where required
5. Separate:
   - routes/controllers
   - services/business logic
   - repositories/data access
   - DTOs/schemas/validators
6. Log useful events, but never sensitive data
7. Add rate limiting if public-facing
8. Add health endpoint:
   - `/health`
   - `/ready`

**API docs:**
- generate OpenAPI/Swagger if possible
- document request/response examples

### 11. Frontend Development Standards

If the project has a frontend:

**Requirements:**
1. Use a clear component structure
2. Separate page-level logic from reusable UI components
3. Use typed API clients
4. Handle loading, empty, and error states
5. Make it responsive
6. Ensure accessibility basics:
   - labels
   - keyboard support
   - semantic HTML
   - color contrast
7. Avoid tightly coupling UI to backend implementation details
8. Store configuration in env vars

**Suggested structure:**
```
src/
  components/
  features/
  pages/ or app/
  hooks/
  services/
  lib/
  types/
```

### 12. Testing Strategy

Do not treat testing as optional.

**Required layers:**
1. Unit tests for core business logic
2. Integration tests for API/database flows
3. End-to-end tests for critical user journeys
4. Smoke tests for app startup and health endpoints

**Minimum critical coverage:**
- authentication
- core CRUD flows
- permissions
- validation
- failure cases

**Testing rules:**
1. Tests must run locally and in CI
2. Use a separate test database if needed
3. Avoid brittle tests tied to implementation details
4. Document how to run tests

### 13. CI/CD with GitHub Actions

Set up a basic but real CI pipeline.

**At minimum, GitHub Actions should:**
1. Install dependencies
2. Run lint
3. Run type checks
4. Run unit/integration tests
5. Build the application
6. Fail on any error

**Suggested workflows:**
- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml` if deployment is requested

**Typical CI stages:**
1. checkout
2. setup runtime
3. cache dependencies
4. install
5. lint
6. test
7. build

If Docker is central, also validate Docker build in CI.

### 14. Security Baseline

Apply standard app security, not just functionality.

**Required:**
1. Input validation everywhere
2. Secure password hashing if auth exists
3. Protection against common attacks:
   - SQL injection
   - XSS
   - CSRF where relevant
   - insecure direct object reference
4. Store secrets in env vars
5. Use least-privilege service accounts where relevant
6. Sanitize logs
7. Set secure headers
8. Keep dependencies updated
9. Do not expose internal stack traces to users

**If auth exists:**
- use proper session/JWT expiration
- secure cookies if cookie-based auth
- role/permission checks

### 15. Observability and Operations

Prepare the project so it can be debugged and operated.

**Required:**
1. Structured logs
2. Error handling middleware
3. Health endpoints
4. Startup validation with clear errors
5. Basic metrics or logging hooks if practical
6. Clear local and production run instructions

**Optional but good:**
- Sentry integration
- OpenTelemetry
- request IDs for tracing

### 16. Documentation Standards

Documentation must be complete enough for a new developer.

**Required files:**
- `README.md`
- `docs/architecture.md`
- `docs/api-spec.md`
- `docs/deployment.md`
- `docs/testing.md`

**`README.md` must include:**
1. What the project does
2. Tech stack
3. Prerequisites
4. Local setup
5. Docker setup
6. Environment variables
7. How to run tests
8. How to build
9. How to deploy
10. Common troubleshooting steps

### 17. Deployment Process

Prepare for real deployment even if not deploying yet.

**Standard deployment expectations:**
1. Build artifacts are reproducible
2. Environment variables are externalized
3. Database migrations can run safely
4. App has health checks
5. CI can be extended to CD
6. Reverse proxy / port configuration is documented

**Typical deployment targets:**
- Vercel for frontend
- Render/Railway/Fly.io for full-stack small apps
- AWS/GCP/Azure for larger systems
- Docker-based VPS deployment if requested

**Document:**
- deployment steps
- required env vars
- migration procedure
- rollback considerations

### 18. Milestone Execution Plan

Build in this order unless project needs otherwise:

1. Requirements and architecture docs
2. Repo setup and tooling
3. Docker and local environment
4. Database schema and migrations
5. Backend core setup
6. Frontend core setup
7. Authentication
8. Core MVP features
9. Tests
10. CI pipeline
11. Documentation polish
12. Deployment readiness review

**Each milestone should end with:**
- working code
- updated docs
- test coverage for new features

### 19. Coding Standards

Enforce maintainable code.

**Rules:**
1. Use TypeScript types properly, avoid `any`
2. Keep functions small and purposeful
3. Separate business logic from transport/UI layers
4. Prefer explicitness over cleverness
5. Avoid premature abstraction
6. Name files and functions clearly
7. Remove dead code
8. Keep dependencies minimal
9. Add comments only where logic is non-obvious

### 20. Definition of Done

A feature is only complete when:
1. It works locally
2. It is committed cleanly
3. It has tests
4. It passes lint/type checks
5. It is documented
6. It works in Docker
7. Config is handled correctly
8. Errors are handled properly
9. No secrets are hardcoded
10. Another developer could run it from the README

### 21. Expected Output Format From The AI

Tell the AI to report progress like this for every major step:

1. What it is building
2. Why this approach was chosen
3. What files were created or changed
4. How to run or test it
5. What assumptions remain
6. What the next step is

### 22. First Actions The AI Should Take

Tell the AI to begin with exactly this sequence:

1. Analyze the product idea and rewrite it into a technical project brief.
2. List assumptions and open questions.
3. Propose the best-fit tech stack with reasons.
4. Design the folder structure and architecture.
5. Create the initial documentation files.
6. Initialize the repository structure.
7. Add Docker, env handling, and base tooling.
8. Build the MVP step by step with tests and docs.

## Copy/Paste Prompt For Your AI Developer

```
Build this project as a professional production-style software project, not as a quick prototype.

Follow a complete standard development lifecycle:
- clarify requirements first
- define MVP scope
- propose architecture and stack
- set up a clean GitHub-ready repository
- use proper git workflow and meaningful commits
- containerize the app with Docker
- use environment variables correctly with .env.example
- set up database schema, migrations, and seed scripts
- build backend and frontend with clean separation of concerns
- add validation, error handling, auth, and security basics
- write unit, integration, and where relevant e2e tests
- set up GitHub Actions for lint, test, and build
- write complete documentation for setup, architecture, testing, and deployment
- leave the project runnable locally with one clear startup process
- make the code production-conscious, maintainable, and easy for another developer to continue

Working rules:
1. Do not start coding until you restate the requirements, assumptions, MVP scope, and architecture plan.
2. Prefer standard, widely used tools unless there is a strong reason otherwise.
3. Use Docker and docker-compose for local development.
4. Use GitHub-style project structure and documentation.
5. Never hardcode secrets or skip env documentation.
6. Every major feature must include tests and updated docs.
7. Keep the main branch deployable.
8. At each milestone, explain what was built, what files changed, how to run it, and what comes next.

Required deliverables:
- README.md
- docs/requirements.md
- docs/mvp-scope.md
- docs/architecture.md
- docs/api-spec.md
- docs/testing.md
- docs/deployment.md
- Dockerfile
- docker-compose.yml
- .env.example
- .github/workflows/ci.yml

Definition of done:
- app runs locally
- app runs through Docker
- tests pass
- lint/typecheck pass
- documentation is complete
- configuration is externalized
- project is ready for GitHub and further development

Start by producing:
1. product brief
2. assumptions and open questions
3. MVP scope
4. recommended stack
5. architecture plan
6. folder structure
7. milestone plan
Only then begin implementation.
```

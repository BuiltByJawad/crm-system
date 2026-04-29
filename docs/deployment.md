# Deployment

## Local Docker Deployment

This repository includes a `docker-compose.yml` that starts:

- Postgres
- Redis
- API (Express)
- Web (Next.js)

### Run

```bash
docker compose up --build
```

Services:

- Web: `http://localhost:3000`
- API: `http://localhost:3001`

## Environment Variables

Use `.env.example` as the reference for required configuration.

## Production Notes

- Replace all secrets (JWT, DB password, etc.)
- Use managed Postgres/Redis if possible
- Run Prisma migrations during deploy
- Enable HTTPS at the edge (reverse proxy / platform managed TLS)

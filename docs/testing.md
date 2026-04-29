# Testing

## Goals

- Verify critical API health + validation behavior
- Provide a foundation for unit + integration tests

## Test Runner

- Vitest

## Running Tests

```bash
npm run test
```

## Notes

- API tests run against the Express app instance (no network port binding required).
- Future work:
  - Add service tests with Prisma test database
  - Add e2e tests with Playwright for core CRM flows

# API Specification (v1)

## Base URL

- `http://localhost:3001/api/v1`

## Conventions

- All responses use a consistent envelope:

```json
{
  "success": true,
  "data": {},
  "message": "..."
}
```

Errors:

```json
{
  "success": false,
  "error": {
    "code": "...",
    "message": "...",
    "details": {}
  }
}
```

## Health

### `GET /health`

Returns `200` when the API process is running.

### `GET /ready`

Returns `200` when the API is ready to accept traffic.

## Authentication

### `POST /auth/register`

Creates a user.

Request body:

- `email` (string, required)
- `password` (string, required)
- `firstName` (string, required)
- `lastName` (string, required)
- `role` (`ADMIN | MANAGER | SALES_REP`, optional)

Response:

- `201` with created user (password omitted)

### `POST /auth/login`

Logs in a user.

Request body:

- `email` (string, required)
- `password` (string, required)

Response:

- `200` with `{ user, token }`

### `GET /auth/me`

Requires `Authorization: Bearer <token>`.

Response:

- `200` with current user

### `PUT /auth/me`

Requires `Authorization: Bearer <token>`.

Request body:

- Partial user fields to update.

Response:

- `200` with updated user

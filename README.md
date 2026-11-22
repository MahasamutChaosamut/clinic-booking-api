# Clinic Booking API

A REST API for a clinic appointment system: patients, doctors, appointments and a real-time waiting queue.

> 🚧 **Work in progress.** Built step by step over 30 days. See the [Roadmap](#roadmap) for the current status.

## Tech stack

- **Runtime:** Node.js, TypeScript
- **Framework:** NestJS
- **Database:** PostgreSQL 17 (Docker Compose), Prisma 7
- **Validation:** class-validator, class-transformer
- **API docs:** OpenAPI via @nestjs/swagger (CLI plugin)
- **Testing:** Vitest (unit tests with mocked dependencies), Supertest (E2E tests against a real Postgres test database)
- **Tooling:** Docker, GitHub Actions *(planned)*

## Getting started

Requirements: Node.js 20+, Docker.

```bash
# 1. Environment variables (the app refuses to start if DATABASE_URL or a JWT secret is missing)
cp .env.example .env

# 2. Start PostgreSQL
docker compose up -d

# 3. Install dependencies
npm install

# 4. Create the tables and generate the Prisma Client
npx prisma migrate deploy
npx prisma generate

# 5. (Optional) Load sample patients, doctors and appointments
docker compose exec -T postgres psql -U clinic -d clinic_booking < sql/day4-seed.sql
docker compose exec -T postgres psql -U clinic -d clinic_booking < sql/day5-seed-doctors.sql

# 6. Run the API
npm run start:dev
```

The API runs on `http://localhost:3000`.

> Login returns a short-lived access token (15 min) and a refresh token (7 days). Refresh tokens are stored as SHA-256 hashes and rotated on every use.
>
> Every route except login and refresh needs `Authorization: Bearer <accessToken>`. Access is role-based (admin / doctor / staff) and denied by default: a route without a `@Roles` rule rejects everyone. Missing or invalid token returns 401; a valid token with the wrong role returns 403. In Swagger, click **Authorize** and paste the access token.
>
> Only an admin can create accounts, so the first admin is created directly in the database (a seed script is planned):
>
> ```bash
> # 1. Hash a password of your choice
> node -e "console.log(require('bcrypt').hashSync('change-me-123', 10))"
> # 2. Insert the admin with that hash (the quoted heredoc stops the shell expanding the $ signs in the hash)
> docker compose exec -T postgres psql -U clinic -d clinic_booking <<'SQL'
> INSERT INTO users (email, password_hash, role) VALUES ('admin@example.com', '<hash from step 1>', 'admin');
> SQL
> ```

Run the unit tests with `npm test` (no database needed: dependencies such as Prisma are replaced with mocks).

The E2E tests start the whole app and send real HTTP requests to a separate database, `clinic_booking_test`, which is wiped at the start of each test file. Create it once, then run the tests:

```bash
docker compose exec postgres psql -U clinic -d postgres -c "CREATE DATABASE clinic_booking_test;"
DATABASE_URL="postgresql://clinic:clinic@localhost:5432/clinic_booking_test?schema=public" npx prisma migrate deploy
npm run test:e2e
```

Interactive API docs (Swagger UI) are at `http://localhost:3000/docs`, and the raw OpenAPI JSON is at `/docs-json`.

## Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Admin only. Create an account with a role (password hashed with bcrypt; 409 if the email exists) |
| POST | `/auth/login` | Check email and password; returns `accessToken` and `refreshToken` (401 with one message for any failure) |
| POST | `/auth/refresh` | Exchange a refresh token for a new token pair; the old refresh token is revoked |
| GET | `/patients` | List patients |
| GET | `/patients/:id` | Get one patient |
| GET | `/patients/:id/appointments` | List a patient's appointments with doctor details |
| POST | `/patients` | Create a patient |
| PATCH | `/patients/:id` | Update a patient |
| DELETE | `/patients/:id` | Delete a patient (409 if they have appointments) |
| GET | `/doctors` | List doctors |
| GET | `/doctors/:id` | Get one doctor |
| POST | `/doctors` | Create a doctor |
| PATCH | `/doctors/:id` | Update a doctor |
| DELETE | `/doctors/:id` | Soft delete a doctor |
| GET | `/appointments` | List appointments with filters and pagination (see below) |
| GET | `/appointments/:id` | Get one appointment with patient and doctor |
| POST | `/appointments` | Book an appointment on a 30-minute slot (409 if the doctor or the patient is already booked then) |
| PATCH | `/appointments/:id` | Change patient, doctor or status (400 once completed, cancelled or no-show) |
| POST | `/queue` | Check in a booked appointment and get today's next queue number (409 if already checked in) |
| PATCH | `/queue/:id/call` | Call a queue number; every connected display receives `queue:called` over WebSocket |

`GET /appointments` query parameters (all optional):

| Parameter | Example | Notes |
|---|---|---|
| `doctorId` | `1` | Positive integer |
| `status` | `booked` | One of `booked`, `completed`, `cancelled`, `no_show` |
| `date` | `2026-11-03` | `YYYY-MM-DD`, matched as a whole day in Bangkok time (UTC+7) |
| `order` | `desc` | `asc` (default) or `desc` by appointment time |
| `page` | `2` | Default `1` |
| `limit` | `20` | Default `10`, max `100` |

The response is `{ data, meta }`, where `meta` holds `page`, `limit`, `total` and `totalPages`.

Double booking is blocked by the database, not by a check in the code: two partial unique indexes allow only one active (not cancelled) appointment per doctor per time and per patient per time. Concurrent requests for the same slot get one `201` and the rest `409`. To see it, log in and run:

```bash
node scripts/race-booking.mjs <accessToken>
```

Queue displays connect with Socket.IO on the same port and listen for the `queue:called` event. The socket only accepts origins listed in `CORS_ORIGINS`, so serve the page over HTTP instead of opening the file directly (a `file://` page has origin `null` and is rejected):

```bash
npx http-server scripts -p 5500
# then open http://localhost:5500/queue-display.html and call a queue number
```

Every error uses one format:

```json
{
  "statusCode": 404,
  "error": "Not Found",
  "message": "Patient 22 not found",
  "path": "/patients/22",
  "timestamp": "2026-11-12T16:46:28.193Z"
}
```

Validation errors (400) set `message` to `"Validation failed"` and list each problem in `details`.

## Security

- **Headers:** `helmet` adds security headers (CSP, HSTS, `X-Frame-Options`, `nosniff`) and removes `X-Powered-By`.
- **CORS:** only origins in `CORS_ORIGINS` (comma-separated) may call the API or open the queue socket from a browser. With the variable unset, no cross-origin browser access is allowed.
- **Rate limiting:** every route allows 100 requests per minute per IP; `POST /auth/login` allows 5. Over the limit returns `429` with `Retry-After`.
- **SQL injection:** all queries go through Prisma's query builder, which sends values as parameters; there are no raw SQL queries.
- **Startup check:** the app refuses to start if `DATABASE_URL` or a JWT secret is missing.

Not done yet: per-account lockout or CAPTCHA after repeated failed logins (the per-IP limit alone does not stop an attacker using many IPs), reuse detection for refresh tokens, and 2FA.

## Roadmap

- [x] PostgreSQL in Docker Compose
- [x] Patients / Doctors / Appointments CRUD with Prisma
- [x] Validation, pagination & filtering
- [x] Consistent error responses, Swagger docs
- [x] Auth: JWT + refresh token, role-based access (admin / doctor / staff)
- [x] Security basics: helmet, CORS allowlist, rate limiting
- [x] Double-booking prevention (partial unique indexes, concurrency-tested)
- [x] Real-time queue via WebSocket (Socket.IO)
- [x] Unit + E2E tests (Vitest, Supertest)
- [ ] CI with GitHub Actions
- [ ] Deployed demo

Development log: [PLAN.md](PLAN.md)

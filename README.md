# Clinic Booking API

A REST API for a clinic appointment system: patients, doctors, appointments and a real-time waiting queue.

> 🚧 **Work in progress.** Built step by step over 30 days. See the [Roadmap](#roadmap) for the current status.

## Tech stack

- **Runtime:** Node.js, TypeScript
- **Framework:** NestJS
- **Database:** PostgreSQL 17 (Docker Compose), Prisma 7
- **Validation:** class-validator, class-transformer
- **API docs:** OpenAPI via @nestjs/swagger (CLI plugin)
- **Testing:** Vitest, Supertest *(planned)*
- **Tooling:** Docker, GitHub Actions *(planned)*

## Getting started

Requirements: Node.js 20+, Docker.

```bash
# 1. Environment variables
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

Interactive API docs (Swagger UI) are at `http://localhost:3000/docs`, and the raw OpenAPI JSON is at `/docs-json`.

## Endpoints

| Method | Path | Description |
|---|---|---|
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
| POST | `/appointments` | Book an appointment |
| PATCH | `/appointments/:id` | Change patient, doctor or status |

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

## Roadmap

- [x] PostgreSQL in Docker Compose
- [x] Patients / Doctors / Appointments CRUD with Prisma
- [x] Validation, pagination & filtering
- [x] Consistent error responses, Swagger docs
- [ ] Auth: JWT + refresh token, role-based access (admin / doctor / staff)
- [ ] Double-booking prevention with database transactions
- [ ] Real-time queue via WebSocket
- [ ] Unit + E2E tests, CI with GitHub Actions
- [ ] Deployed demo

Development log: [PLAN.md](PLAN.md)

# Clinic Booking API

A REST API for a clinic appointment system: patients, doctors, appointments and a real-time waiting queue.

> 🚧 **Work in progress.** Built step by step over 30 days. See the [Roadmap](#roadmap) for the current status.

## Tech stack

- **Runtime:** Node.js, TypeScript
- **Framework:** NestJS
- **Database:** PostgreSQL 17 (Docker Compose), Prisma *(planned)*
- **Testing:** Vitest, Supertest *(planned)*
- **Tooling:** Docker, GitHub Actions *(planned)*

## Getting started

Requirements: Node.js 20+, Docker.

```bash
# 1. Environment variables
cp .env.example .env

# 2. Start PostgreSQL
docker compose up -d

# 3. Create the schema and sample data (temporary, until Prisma migrations land)
docker compose exec -T postgres psql -U clinic -d clinic_booking < sql/day4-patients.sql
docker compose exec -T postgres psql -U clinic -d clinic_booking < sql/day4-seed.sql

# 4. Run the API
npm install
npm run start:dev
```

The API runs on `http://localhost:3000`.

## Roadmap

- [x] PostgreSQL in Docker Compose, initial `patients` schema
- [ ] Patients / Doctors / Appointments CRUD with Prisma
- [ ] Validation, pagination & filtering, Swagger docs
- [ ] Auth: JWT + refresh token, role-based access (admin / doctor / staff)
- [ ] Double-booking prevention with database transactions
- [ ] Real-time queue via WebSocket
- [ ] Unit + E2E tests, CI with GitHub Actions
- [ ] Deployed demo

Development log: [PLAN.md](PLAN.md)

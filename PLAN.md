# แผน 30 วัน: Node.js Back End (Clinic Booking API)

**เป้าหมาย:** มี REST API ที่ deploy ได้จริง มี test, Docker, CI และ README บน GitHub
**Stack:** Node.js · TypeScript · NestJS · PostgreSQL · Prisma · Vitest · Docker
**ช่วงเวลา:** 29 ต.ค. – 27 พ.ย. 2569 · แจ้งเตือนบน Windows ทุกวันเวลา 20:00

> ทำเสร็จวันไหน ให้เปลี่ยน `[ ]` เป็น `[x]` ตัวแจ้งเตือนจะนับความคืบหน้าจากไฟล์นี้
> ⚠️ ออกแบบใหม่ทั้งหมด ห้าม copy schema หรือโค้ดจากงานลูกค้า

## เริ่มต้นแต่ละวัน
```bash
docker compose up -d     # เปิด PostgreSQL (ต้องเปิด Docker Desktop ก่อน)
npm run start:dev        # รัน API ที่ http://localhost:3000
```

## กฎ
1. Commit ทุกวัน แม้จะเล็กน้อย
2. ทุกหัวข้อต้องจบด้วยโค้ดที่รันได้ ไม่ดูวิดีโออย่างเดียว
3. ตามไม่ทันให้ตัดเนื้อหา อย่าเลื่อนวัน (ตัด Day 19 และ Day 28 ได้ แต่ห้ามตัด Auth, Transaction, Test, Deploy)
4. ส่งใบสมัครงานไปพร้อมกัน ไม่ต้องรอให้ครบ 30 วัน

## สัปดาห์ที่ 1: พื้นฐาน Node.js + SQL
- [x] **Day 1** · 2026-10-29 — Event loop, async/await, Promise, modules, npm → อธิบาย event loop ได้ใน 1 นาที
- [x] **Day 2** · 2026-10-30 — HTTP: method, status code, header, REST → สรุป status code ที่ใช้บ่อย
- [x] **Day 3** · 2026-10-31 — Express: route, middleware, error handler → CRUD API เก็บข้อมูลใน memory (โฟลเดอร์ playground แยก)
- [x] **Day 4** · 2026-11-01 — `docker compose up -d` แล้วฝึก SELECT / WHERE / ORDER BY → ต่อ Postgres ได้
- [x] **Day 5** · 2026-11-02 — JOIN, GROUP BY, subquery → ทำโจทย์ SQL 15 ข้อ (sqlbolt.com, pgexercises.com)
- [x] **Day 6** · 2026-11-03 — Index, transaction, normalization → อธิบายได้ว่าเมื่อไรควรใส่ index
- [ ] **Day 7** · 2026-11-04 — ออกแบบ ER diagram: patients, doctors, appointments, queue, users → ไฟล์ ER ใน docs/

## สัปดาห์ที่ 2: NestJS + Prisma + CRUD
- [ ] **Day 8** · 2026-11-05 — NestJS: module, controller, service, DI → push โปรเจกต์ขึ้น GitHub
- [ ] **Day 9** · 2026-11-06 — Prisma: schema, migration, relation → มีตารางครบตาม ER
- [ ] **Day 10** · 2026-11-07 — DTO + validation (class-validator) → API patients ครบ CRUD
- [ ] **Day 11** · 2026-11-08 — Relation 1-N และ N-N → API doctors และ appointments
- [ ] **Day 12** · 2026-11-09 — Pagination, filter, search, sort → GET /appointments?date=&doctorId=&page=
- [ ] **Day 13** · 2026-11-10 — Global exception filter → ทุก error ตอบกลับในรูปแบบเดียวกัน
- [ ] **Day 14** · 2026-11-11 — Swagger (OpenAPI) → มีหน้า API docs ที่ /docs

## สัปดาห์ที่ 3: Auth, Security, Business Logic
- [ ] **Day 15** · 2026-11-12 — Hash รหัสผ่านด้วย bcrypt, register/login → POST /auth/login
- [ ] **Day 16** · 2026-11-13 — JWT access token + refresh token → ต่ออายุ token ได้
- [ ] **Day 17** · 2026-11-14 — Guard + RBAC (admin / doctor / staff) → แต่ละ role เข้าได้เฉพาะ API ของตัวเอง
- [ ] **Day 18** · 2026-11-15 — Transaction: กันการจองซ้อน → จองช่วงเวลาเดียวกันพร้อมกัน 2 คนแล้วสำเร็จแค่คนเดียว
- [ ] **Day 19** · 2026-11-16 — WebSocket Gateway: คิว realtime → เรียกคิวแล้ว client อัปเดตทันที
- [ ] **Day 20** · 2026-11-17 — OWASP พื้นฐาน: SQL injection, helmet, CORS, rate limit → ใส่ helmet และ throttler
- [ ] **Day 21** · 2026-11-18 — ทบทวนและ refactor → ไม่มี secret ในโค้ด อธิบาย JWT และการเก็บ refresh token ได้

## สัปดาห์ที่ 4: Test, Docker, Deploy
- [ ] **Day 22** · 2026-11-19 — Unit test ด้วย Vitest: พื้นฐานและการ mock → test แรกผ่าน
- [ ] **Day 23** · 2026-11-20 — Unit test ของ service หลัก (appointments, auth) → test ครอบ logic สำคัญ
- [ ] **Day 24** · 2026-11-21 — E2E test ด้วย supertest → test flow login แล้วจองนัด
- [ ] **Day 25** · 2026-11-22 — Dockerfile + เพิ่ม api เข้า docker-compose → รันทั้งระบบด้วย docker compose up
- [ ] **Day 26** · 2026-11-23 — GitHub Actions CI: lint + test + build → ได้ badge สีเขียวใน README
- [ ] **Day 27** · 2026-11-24 — Deploy ขึ้น Render, Railway หรือ Fly.io → มี URL ใช้งานจริง
- [ ] **Day 28** · 2026-11-25 — Logging (pino) + health check → GET /health
- [ ] **Day 29** · 2026-11-26 — README: สถาปัตยกรรม, ER, วิธีรัน, ลิงก์ demo → README ที่ HR และหัวหน้าทีมอ่านเข้าใจ
- [ ] **Day 30** · 2026-11-27 — อัปเดต CV และซ้อมเล่าโปรเจกต์ 3 นาที → CV ใหม่ใส่ลิงก์โปรเจกต์

## แหล่งเรียน
- https://docs.nestjs.com (Overview, Techniques, Security)
- https://www.prisma.io/docs (Getting Started กับ PostgreSQL)
- https://roadmap.sh/backend
- https://sqlbolt.com · https://pgexercises.com

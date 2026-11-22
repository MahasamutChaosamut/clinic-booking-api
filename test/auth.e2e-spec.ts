import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service.js';
import bcrypt from 'bcrypt';
import request from 'supertest';
import { createTestApp } from './utils/create-test-app.js';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;
  let staffToken: string;

  beforeAll(async () => {
    app = await createTestApp();
    prisma = app.get(PrismaService);
    await prisma.$executeRaw`TRUNCATE users, doctors, patients, appointments, queue, refresh_tokens RESTART IDENTITY CASCADE`;
    const passwordHash = await bcrypt.hash('test1234', 10);
    await prisma.user.createMany({
      data: [
        { email: 'admin@test.com', passwordHash, role: 'admin' },
        { email: 'staff@test.com', passwordHash, role: 'staff' },
      ],
    });
    const resAdmin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'admin@test.com', password: 'test1234' });
    adminToken = resAdmin.body.accessToken;
    const resStaff = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'staff@test.com', password: 'test1234' });
    staffToken = resStaff.body.accessToken;
  });

  it('rejects a request without a token', async () => {
    await request(app.getHttpServer()).get('/patients').expect(401);
  });

  it('accepts a request with a valid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/patients')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
    expect(res.body).toEqual([]);
  });

  it('forbids staff from registering users', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .set('Authorization', `Bearer ${staffToken}`)
      .expect(403);
    expect(res.body).toMatchObject({ statusCode: 403, error: 'Forbidden' });
  });

  afterAll(async () => {
    await app.close();
  });
});

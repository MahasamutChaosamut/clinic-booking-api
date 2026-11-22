import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../src/prisma/prisma.service.js';
import bcrypt from 'bcrypt';
import request from 'supertest';
import { createTestApp } from './utils/create-test-app.js';

describe('Appointment (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;

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

    await prisma.doctor.create({
      data: { firstName: 'Test', lastName: 'Doctor', specialty: 'General' },
    });
    await prisma.patient.createMany({
      data: [
        {
          firstName: 'Patient',
          lastName: 'One',
          birthDate: new Date('1990-01-01'),
        },
        {
          firstName: 'Patient',
          lastName: 'Two',
          birthDate: new Date('1992-05-10'),
        },
      ],
    });
  });

  it('rejects a request without a token', async () => {
    await request(app.getHttpServer()).get('/appointments').expect(401);
  });

  it('rejects a second booking for the same doctor and time', async () => {
    const booking = {
      patientId: 1,
      doctorId: 1,
      appointmentAt: '2026-12-01T09:00:00+07:00',
    };

    await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(booking)
      .expect(201);

    await request(app.getHttpServer())
      .post('/appointments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ...booking, patientId: 2 })
      .expect(409);
  });

  it('gives the first two check-ins queue numbers 1 and 2', async () => {
    const first = await prisma.appointment.create({
      data: {
        patientId: 1,
        doctorId: 1,
        appointmentAt: new Date('2026-12-02T09:00:00+07:00'),
      },
    });
    const second = await prisma.appointment.create({
      data: {
        patientId: 2,
        doctorId: 1,
        appointmentAt: new Date('2026-12-02T09:30:00+07:00'),
      },
    });
    const resFirst = await request(app.getHttpServer())
      .post('/queue')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ appointmentId: first.id })
      .expect(201);
    expect(resFirst.body).toMatchObject({ queueNumber: 1 });

    const resSecond = await request(app.getHttpServer())
      .post('/queue')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ appointmentId: second.id })
      .expect(201);
    expect(resSecond.body).toMatchObject({ queueNumber: 2 });
  });

  afterAll(async () => {
    await app.close();
  });
});

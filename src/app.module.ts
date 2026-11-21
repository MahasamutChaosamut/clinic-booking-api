import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PatientsModule } from './patients/patients.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
import { DoctorsModule } from './doctors/doctors.module.js';
import { AuthModule } from './auth/auth.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { QueueModule } from './queue/queue.module.js';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PatientsModule,
    AppointmentsModule,
    DoctorsModule,
    AuthModule,
    PrismaModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}

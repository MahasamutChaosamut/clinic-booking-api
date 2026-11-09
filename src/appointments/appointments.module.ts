import { Module } from '@nestjs/common';
import { PatientsModule } from '../patients/patients.module.js';
import { AppointmentsService } from './appointments.service.js';
import { AppointmentsController } from './appointments.controller.js';
import { DoctorsModule } from '../doctors/doctors.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PatientsModule, DoctorsModule, PrismaModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}

import { Module } from '@nestjs/common';
import { PatientsModule } from '../patients/patients.module.js';
import { AppointmentsService } from './appointments.service.js';
import { AppointmentsController } from './appointments.controller.js';
import { DoctorsModule } from '../doctors/doctors.module.js';

@Module({
  imports: [PatientsModule, DoctorsModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}

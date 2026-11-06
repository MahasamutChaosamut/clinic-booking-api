import { Module } from '@nestjs/common';
import { PatientsModule } from '../patients/patients.module.js';
import { AppointmentService } from './appointment.service.js';
import { AppointmentController } from './appointment.controller.js';

@Module({
  imports: [PatientsModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}

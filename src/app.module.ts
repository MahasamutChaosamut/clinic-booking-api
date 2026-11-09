import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PatientsModule } from './patients/patients.module.js';
import { AppointmentsModule } from './appointments/appointments.module.js';
import { DoctorsModule } from './doctors/doctors.module.js';

@Module({
  imports: [PatientsModule, AppointmentsModule, DoctorsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PatientsModule } from './patients/patients.module.js';
import { AppointmentModule } from './appointment/appointment.module.js';

@Module({
  imports: [PatientsModule, AppointmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

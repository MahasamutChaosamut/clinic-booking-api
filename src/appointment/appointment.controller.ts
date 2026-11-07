import { Controller, Get } from '@nestjs/common';
import { AppointmentService } from './appointment.service.js';

@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}
  @Get()
  getAppointments(): Promise<number> {
    return this.appointmentService.countPatients();
  }
}

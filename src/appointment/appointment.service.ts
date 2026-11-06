import { Injectable } from '@nestjs/common';
import { PatientsService } from '../patients/patients.service.js';

@Injectable()
export class AppointmentService {
  constructor(private readonly patientsService: PatientsService) {}

  getAppointments(): number {
    return this.patientsService.getPatients().length;
  }
}

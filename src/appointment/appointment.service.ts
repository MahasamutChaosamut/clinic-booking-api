import { Injectable } from '@nestjs/common';
import { PatientsService } from '../patients/patients.service.js';

@Injectable()
export class AppointmentService {
  constructor(private readonly patientsService: PatientsService) {}

  async countPatients() {
    return (await this.patientsService.findAll()).length;
  }
}

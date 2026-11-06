import { Controller, Get } from '@nestjs/common';
import { Patient } from './patients.interface.js';
import { PatientsService } from './patients.service.js';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}
  @Get()
  findPatients(): Patient[] {
    return this.patientsService.getPatients();
  }
}

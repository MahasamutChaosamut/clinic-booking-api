import { Injectable } from '@nestjs/common';
import { Patient } from './patients.interface.js';

@Injectable()
export class PatientsService {
  private readonly patients: Patient[] = [
    {
      id: 1,
      firstName: 'สมชาย',
      lastName: 'ใจดี',
      birthDate: new Date('1990-01-01'),
      phone: '0812345678',
    },
    {
      id: 2,
      firstName: 'มาลี',
      lastName: 'ศรีสุข',
      birthDate: new Date('1985-05-15'),
      phone: '0898765432',
    },
  ];
  getPatients(): Patient[] {
    return this.patients;
  }
}

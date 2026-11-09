import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsPositive,
} from 'class-validator';
import { AppointmentStatus } from '../../generated/prisma/browser.js';

export class CreateAppointmentDto {
  @IsPositive()
  @IsInt()
  patientId: number;

  @IsPositive()
  @IsInt()
  doctorId: number;

  @IsDateString()
  @IsNotEmpty()
  appointmentAt: string;
}

import { IsEnum, IsInt, IsOptional, IsPositive } from 'class-validator';
import { AppointmentStatus } from '../../generated/prisma/client.js';

export class UpdateAppointmentDto {
  @IsPositive()
  @IsOptional()
  @IsInt()
  patientId?: number;

  @IsOptional()
  @IsPositive()
  @IsInt()
  doctorId?: number;

  @IsOptional()
  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}

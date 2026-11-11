import { IsEnum, IsInt, IsPositive, ValidateIf } from 'class-validator';
import { AppointmentStatus } from '../../generated/prisma/client.js';

export class UpdateAppointmentDto {
  @ValidateIf((_, value) => value !== undefined)
  @IsPositive()
  @IsInt()
  patientId?: number;

  @ValidateIf((_, value) => value !== undefined)
  @IsPositive()
  @IsInt()
  doctorId?: number;

  @ValidateIf((_, value) => value !== undefined)
  @IsEnum(AppointmentStatus)
  status?: AppointmentStatus;
}

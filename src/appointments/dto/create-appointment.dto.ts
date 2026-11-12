import { IsDateString, IsInt, IsNotEmpty, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {
  @IsPositive()
  @IsInt()
  patientId: number;

  @IsPositive()
  @IsInt()
  doctorId: number;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    example: '2026-11-20T09:00:00+07:00',
  })
  appointmentAt: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    example: 'Somchai',
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @ApiProperty({
    example: 'Yokmany',
  })
  lastName: string;

  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({
    format: 'date',
    example: '2026-11-03',
  })
  birthDate: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  @ApiPropertyOptional({
    example: '0817128765',
  })
  phone?: string;
}

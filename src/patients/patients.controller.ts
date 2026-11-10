import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { PatientsService } from './patients.service.js';
import type { Appointment, Patient } from '../generated/prisma/client.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';
import { UpdatePatientDto } from './dto/update-patient.dto.js';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}
  @Get()
  async findAll(): Promise<Patient[]> {
    return await this.patientsService.findAll();
  }
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Patient> {
    return await this.patientsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    return await this.patientsService.update(id, updatePatientDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Patient> {
    return await this.patientsService.remove(id);
  }

  @Post()
  create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientsService.create(createPatientDto);
  }

  @Get(':id/appointments')
  async findAppointments(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Appointment[]> {
    return this.patientsService.findAppointments(id);
  }
}

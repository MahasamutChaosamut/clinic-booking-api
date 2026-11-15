import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PatientsService } from './patients.service.js';
import type { Appointment, Patient } from '../generated/prisma/client.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';
import { UpdatePatientDto } from './dto/update-patient.dto.js';
import { ErrorResponseDto } from '../common/dto/error-response.dto.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(['admin', 'doctor', 'staff'])
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: ErrorResponseDto })
@ApiForbiddenResponse({ type: ErrorResponseDto })
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get()
  async findAll(): Promise<Patient[]> {
    return await this.patientsService.findAll();
  }

  @Get(':id')
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Patient> {
    return await this.patientsService.findOne(id);
  }

  @Roles(['admin', 'staff'])
  @Patch(':id')
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    return await this.patientsService.update(id, updatePatientDto);
  }

  @Roles(['admin'])
  @Delete(':id')
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Patient> {
    return await this.patientsService.remove(id);
  }

  @Roles(['admin', 'staff'])
  @Post()
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientsService.create(createPatientDto);
  }

  @Get(':id/appointments')
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async findAppointments(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Appointment[]> {
    return this.patientsService.findAppointments(id);
  }
}

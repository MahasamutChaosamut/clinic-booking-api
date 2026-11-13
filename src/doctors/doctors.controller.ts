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
import { DoctorsService } from './doctors.service.js';
import { CreateDoctorDto } from './dto/create-doctor.dto.js';
import type { Doctor } from '../generated/prisma/client.js';
import { UpdateDoctorDto } from './dto/update-doctor.dto.js';
import { ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto.js';

@Controller('doctors')
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}
  @Get()
  async findAll() {
    return await this.doctorsService.findAll();
  }

  @Get(':id')
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Doctor> {
    return await this.doctorsService.findOne(id);
  }

  @Post()
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return await this.doctorsService.create(createDoctorDto);
  }

  @Patch(':id')
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    return await this.doctorsService.update(id, updateDoctorDto);
  }

  @Delete(':id')
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiNotFoundResponse({ type: ErrorResponseDto })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<Doctor> {
    return await this.doctorsService.remove(id);
  }
}

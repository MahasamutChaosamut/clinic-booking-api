import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { DoctorService } from './doctors.service.js';
import { CreateDoctorDto } from './dto/create-doctor.dto.js';
import { Doctor } from '../generated/prisma/browser.js';
import { UpdateDoctorDto } from './dto/update-doctor.dto.js';

@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}
  @Get()
  async findAll() {
    return await this.doctorService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Doctor> {
    return await this.doctorService.findOne(id);
  }

  @Post()
  async create(@Body() createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return await this.doctorService.create(createDoctorDto);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDoctorDto: UpdateDoctorDto,
  ): Promise<Doctor> {
    return await this.doctorService.patch(id, updateDoctorDto);
  }
}

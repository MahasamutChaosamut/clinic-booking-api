import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDoctorDto } from './dto/create-doctor.dto.js';
import { Doctor } from '../generated/prisma/browser.js';
import { UpdateDoctorDto } from './dto/update-doctor.dto.js';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.doctor.findMany();
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });
    if (doctor) {
      return doctor;
    }
    throw new NotFoundException(`Doctor ${id} not found`);
  }

  async create(createdoctorDto: CreateDoctorDto): Promise<Doctor> {
    return await this.prisma.doctor.create({
      data: {
        ...createdoctorDto,
      },
    });
  }

  async patch(id: number, updatedoctorDto: UpdateDoctorDto): Promise<Doctor> {
    const doctor = await this.prisma.doctor.findUnique({
      where: { id },
    });
    if (!doctor) {
      throw new NotFoundException(`Doctor ${id} not found`);
    }
    return await this.prisma.doctor.update({
      where: { id: id },
      data: {
        ...updatedoctorDto,
      },
    });
  }
}

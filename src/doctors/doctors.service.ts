import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDoctorDto } from './dto/create-doctor.dto.js';
import type { Doctor } from '../generated/prisma/client.js';
import { UpdateDoctorDto } from './dto/update-doctor.dto.js';

@Injectable()
export class DoctorsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.doctor.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.prisma.doctor.findFirst({
      where: { id, deletedAt: null },
    });
    if (doctor) {
      return doctor;
    }
    throw new NotFoundException(`Doctor ${id} not found`);
  }

  async create(createDoctorDto: CreateDoctorDto): Promise<Doctor> {
    return await this.prisma.doctor.create({
      data: {
        ...createDoctorDto,
      },
    });
  }

  async update(id: number, updateDoctorDto: UpdateDoctorDto): Promise<Doctor> {
    await this.findOne(id);
    return this.prisma.doctor.update({
      where: { id: id },
      data: {
        ...updateDoctorDto,
      },
    });
  }

  async remove(id: number): Promise<Doctor> {
    await this.findOne(id);
    return this.prisma.doctor.update({
      where: { id: id },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

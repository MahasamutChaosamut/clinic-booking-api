import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Patient, Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePatientDto } from './dto/create-patient.dto.js';
import { UpdatePatientDto } from './dto/update-patient.dto.js';

@Injectable()
export class PatientsService {
  constructor(private readonly prismaService: PrismaService) {}
  async findAll(): Promise<Patient[]> {
    return await this.prismaService.patient.findMany();
  }

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    return await this.prismaService.patient.create({
      data: {
        ...createPatientDto,
        birthDate: new Date(createPatientDto.birthDate),
      },
    });
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.prismaService.patient.findUnique({
      where: { id },
    });
    if (patient) {
      return patient;
    }
    throw new NotFoundException(`Patient ${id} not found`);
  }

  async update(
    id: number,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    await this.findOne(id);
    return await this.prismaService.patient.update({
      where: { id },
      data: {
        ...updatePatientDto,
        birthDate: updatePatientDto.birthDate
          ? new Date(updatePatientDto.birthDate)
          : undefined,
      },
    });
  }

  async remove(id: number): Promise<Patient> {
    await this.findOne(id);

    try {
      return await this.prismaService.patient.delete({ where: { id } });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2003'
      ) {
        throw new ConflictException(`Patient ${id} still has appointments`);
      }
      throw error;
    }
  }
}

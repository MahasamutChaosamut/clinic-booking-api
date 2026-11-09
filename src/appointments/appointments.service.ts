import { Injectable, NotFoundException } from '@nestjs/common';
import { PatientsService } from '../patients/patients.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { DoctorsService } from '../doctors/doctors.service.js';
import type { Appointment } from '../generated/prisma/client.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { UpdateAppointmentDto } from './dto/update-appointment.dto.js';

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly prismaService: PrismaService,
    private readonly doctorsService: DoctorsService,
  ) {}

  async findAll(): Promise<Appointment[]> {
    return await this.prismaService.appointment.findMany({
      include: {
        patient: true,
        doctor: true,
      },
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.prismaService.appointment.findUnique({
      where: { id },
      include: {
        patient: true,
        doctor: true,
      },
    });

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    await this.patientsService.findOne(createAppointmentDto.patientId);
    await this.doctorsService.findOne(createAppointmentDto.doctorId);

    const appointment = await this.prismaService.appointment.create({
      data: {
        ...createAppointmentDto,
        appointmentAt: new Date(createAppointmentDto.appointmentAt),
      },
    });

    return appointment;
  }

  async update(
    id: number,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<Appointment> {
    await this.findOne(id);
    if (updateAppointmentDto.patientId) {
      await this.patientsService.findOne(updateAppointmentDto.patientId);
    }
    if (updateAppointmentDto.doctorId) {
      await this.doctorsService.findOne(updateAppointmentDto.doctorId);
    }
    return await this.prismaService.appointment.update({
      where: { id },
      data: {
        ...updateAppointmentDto,
      },
    });
  }
}

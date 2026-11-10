import { Injectable, NotFoundException } from '@nestjs/common';
import { PatientsService } from '../patients/patients.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { DoctorsService } from '../doctors/doctors.service.js';
import type { Appointment } from '../generated/prisma/client.js';
import { CreateAppointmentDto } from './dto/create-appointment.dto.js';
import { UpdateAppointmentDto } from './dto/update-appointment.dto.js';
import { FindAppointmentsQueryDto } from './dto/find-appointments-query.dto.js';

export interface PaginatedAppointments {
  data: Appointment[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly patientsService: PatientsService,
    private readonly prismaService: PrismaService,
    private readonly doctorsService: DoctorsService,
  ) {}

  async findAll(
    query: FindAppointmentsQueryDto,
  ): Promise<PaginatedAppointments> {
    const start = new Date(`${query.date}T00:00:00+07:00`);
    const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = {
      doctorId: query.doctorId,
      status: query.status,
      appointmentAt: query.date ? { gte: start, lt: end } : undefined,
    };
    const data = await this.prismaService.appointment.findMany({
      where,
      include: {
        patient: true,
        doctor: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [{ appointmentAt: query.order ?? 'asc' }, { id: 'asc' }],
    });
    const total = await this.prismaService.appointment.count({ where });
    const totalPages = Math.ceil(total / limit);
    return { data, meta: { page, limit, total, totalPages } };
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
    if (updateAppointmentDto.patientId !== undefined) {
      await this.patientsService.findOne(updateAppointmentDto.patientId);
    }
    if (updateAppointmentDto.doctorId !== undefined) {
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

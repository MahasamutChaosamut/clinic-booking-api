import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  AppointmentStatus,
  Prisma,
  Queue,
  QueueStatus,
} from '../generated/prisma/client.js';
import { AppointmentsService } from '../appointments/appointments.service.js';
import { QueueGateway } from './queue.gateway.js';

@Injectable()
export class QueueService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly appointmentService: AppointmentsService,
    private readonly queueGateway: QueueGateway,
  ) {}

  async ensureNotCheckedIn(appointmentId: number) {
    const existingQueue = await this.prismaService.queue.findUnique({
      where: { appointmentId },
    });
    if (existingQueue) {
      throw new ConflictException(
        `Appointment ${appointmentId} is already checked in`,
      );
    }
  }

  async checkIn(appointmentId: number, attempt = 1): Promise<Queue> {
    await this.ensureNotCheckedIn(appointmentId);
    const appointment = await this.appointmentService.findOne(appointmentId);
    if (appointment.status !== AppointmentStatus.booked) {
      throw new BadRequestException(
        `Appointment ${appointmentId} is ${appointment.status} and cannot be checked in`,
      );
    }
    const queueDate = todayInBangkok();
    const { _max } = await this.prismaService.queue.aggregate({
      where: { queueDate },
      _max: { queueNumber: true },
    });
    try {
      return await this.prismaService.queue.create({
        data: {
          appointmentId,
          queueDate,
          queueNumber: (_max.queueNumber ?? 0) + 1,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002' &&
        attempt < 3
      ) {
        return this.checkIn(appointmentId, attempt + 1);
      }
      throw error;
    }
  }
  async call(id: number): Promise<Queue> {
    const existingQueue = await this.prismaService.queue.findUnique({
      where: { id },
    });
    if (!existingQueue) {
      throw new NotFoundException(`Queue ${id} not found`);
    }
    const queue = await this.prismaService.queue.update({
      where: { id },
      data: { status: QueueStatus.called, calledAt: new Date() },
    });

    this.queueGateway.notifyCalled(queue.queueNumber);
    return queue;
  }
}

function todayInBangkok(): Date {
  const ymd = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
  }).format(new Date());
  return new Date(`${ymd}T00:00:00Z`);
}

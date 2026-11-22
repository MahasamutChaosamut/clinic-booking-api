import { NotFoundException } from '@nestjs/common';
import type { AppointmentsService } from '../appointments/appointments.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import type { QueueGateway } from './queue.gateway.js';
import { QueueService } from './queue.service.js';
import { Prisma } from '../generated/prisma/client.js';

describe('QueueService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const prisma = {
    queue: {
      findUnique: vi.fn(),
      update: vi.fn(),
      aggregate: vi.fn(),
      create: vi.fn(),
    },
  };
  const appointments = { findOne: vi.fn() };

  const gateway = { notifyCalled: vi.fn() };
  const service = new QueueService(
    prisma as unknown as PrismaService,
    appointments as unknown as AppointmentsService,
    gateway as unknown as QueueGateway,
  );

  it('throws NotFoundException when the queue does not exist', async () => {
    prisma.queue.findUnique.mockResolvedValue(null);

    await expect(service.call(99)).rejects.toThrow(NotFoundException);
    expect(prisma.queue.update).not.toHaveBeenCalled();
    expect(gateway.notifyCalled).not.toHaveBeenCalled();
  });
  it('marks the queue as called and notifies the display', async () => {
    prisma.queue.findUnique.mockResolvedValue({
      id: 1,
      queueNumber: 7,
      status: 'waiting',
    });
    prisma.queue.update.mockResolvedValue({
      id: 1,
      queueNumber: 7,
      status: 'called',
    });

    const result = await service.call(1);

    expect(result.status).toBe('called');
    expect(gateway.notifyCalled).toHaveBeenCalledWith(7);
  });

  it('creates the next queue number for today', async () => {
    prisma.queue.findUnique.mockResolvedValue(null);
    appointments.findOne.mockResolvedValue({ id: 38, status: 'booked' });
    prisma.queue.aggregate.mockResolvedValue({ _max: { queueNumber: 4 } });
    prisma.queue.create.mockResolvedValue({ id: 10, queueNumber: 5 });

    await service.checkIn(38);

    expect(prisma.queue.create.mock.calls[0][0].data.queueNumber).toBe(5);
  });

  it('starts at queue number 1 when there is no queue today', async () => {
    prisma.queue.findUnique.mockResolvedValue(null);
    appointments.findOne.mockResolvedValue({ id: 38, status: 'booked' });
    prisma.queue.aggregate.mockResolvedValue({ _max: { queueNumber: null } });
    prisma.queue.create.mockResolvedValue({ id: 1, queueNumber: 1 });

    await service.checkIn(38);

    expect(prisma.queue.create.mock.calls[0][0].data.queueNumber).toBe(1);
  });

  it('retries with a new number when another check-in took it first', async () => {
    const p2002 = new Prisma.PrismaClientKnownRequestError(
      'Unique constraint failed',
      {
        code: 'P2002',
        clientVersion: 'test',
      },
    );
    prisma.queue.findUnique.mockResolvedValue(null);
    appointments.findOne.mockResolvedValue({ id: 38, status: 'booked' });
    prisma.queue.aggregate
      .mockResolvedValueOnce({ _max: { queueNumber: 4 } })
      .mockResolvedValueOnce({ _max: { queueNumber: 5 } });
    prisma.queue.create
      .mockRejectedValueOnce(p2002)
      .mockResolvedValueOnce({ id: 11, queueNumber: 6 });

    await service.checkIn(38);

    expect(prisma.queue.create).toHaveBeenCalledTimes(2);
    expect(prisma.queue.create.mock.calls[1][0].data.queueNumber).toBe(6);
  });
});

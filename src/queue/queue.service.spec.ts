import { NotFoundException } from '@nestjs/common';
import type { AppointmentsService } from '../appointments/appointments.service.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import type { QueueGateway } from './queue.gateway.js';
import { QueueService } from './queue.service.js';

describe('QueueService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const prisma = { queue: { findUnique: vi.fn(), update: vi.fn() } };
  const gateway = { notifyCalled: vi.fn() };
  const service = new QueueService(
    prisma as unknown as PrismaService,
    {} as AppointmentsService,
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
});

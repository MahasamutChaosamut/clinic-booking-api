import { Module } from '@nestjs/common';
import { QueueGateway } from './queue.gateway.js';
import { QueueService } from './queue.service.js';
import { AppointmentsModule } from '../appointments/appointments.module.js';
import { QueueController } from './queue.controller.js';

@Module({
  imports: [AppointmentsModule],
  providers: [QueueGateway, QueueService],
  controllers: [QueueController],
  exports: [QueueService],
})
export class QueueModule {}

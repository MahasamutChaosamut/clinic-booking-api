import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { DoctorService } from './doctors.service.js';
import { DoctorController } from './doctors.controller.js';

@Module({
  providers: [DoctorService],
  imports: [PrismaModule],
  controllers: [DoctorController],
  exports: [DoctorService],
})
export class DoctorModule {}

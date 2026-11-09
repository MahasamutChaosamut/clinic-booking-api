import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { DoctorsService } from './doctors.service.js';
import { DoctorsController } from './doctors.controller.js';

@Module({
  providers: [DoctorsService],
  imports: [PrismaModule],
  controllers: [DoctorsController],
  exports: [DoctorsService],
})
export class DoctorsModule {}

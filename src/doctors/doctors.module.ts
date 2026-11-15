import { Module } from '@nestjs/common';
import { DoctorsService } from './doctors.service.js';
import { DoctorsController } from './doctors.controller.js';

@Module({
  providers: [DoctorsService],
  controllers: [DoctorsController],
  exports: [DoctorsService],
})
export class DoctorsModule {}

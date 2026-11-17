import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CheckInDto } from './dto/check-in.dto.js';
import type { Queue } from '../generated/prisma/client.js';
import { QueueService } from './queue.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../common/dto/error-response.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(['admin', 'doctor', 'staff'])
@ApiNotFoundResponse({ type: ErrorResponseDto })
@ApiBadRequestResponse({ type: ErrorResponseDto })
@ApiBearerAuth()
@ApiUnauthorizedResponse({ type: ErrorResponseDto })
@ApiForbiddenResponse({ type: ErrorResponseDto })
@Controller('queue')
export class QueueController {
  constructor(private readonly queueService: QueueService) {}
  @ApiConflictResponse({ type: ErrorResponseDto })
  @Roles(['admin', 'staff'])
  @Post()
  async checkIn(@Body() dto: CheckInDto): Promise<Queue> {
    return await this.queueService.checkIn(dto.appointmentId);
  }

  @Patch(':id/call')
  async call(@Param('id', ParseIntPipe) id: number): Promise<Queue> {
    return await this.queueService.call(id);
  }
}

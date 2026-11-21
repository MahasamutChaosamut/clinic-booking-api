import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import type { User } from '../generated/prisma/client.js';
import { ErrorResponseDto } from '../common/dto/error-response.dto.js';
import { LoginDto } from './dto/login.dto.js';
import { RefreshDto } from './dto/refresh.dto.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { RolesGuard } from './guards/roles.guard.js';
import { Roles } from './decorators/roles.decorator.js';
import { Throttle } from '@nestjs/throttler';

@ApiUnauthorizedResponse({ type: ErrorResponseDto })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(['admin'])
  @ApiBearerAuth()
  @ApiForbiddenResponse({ type: ErrorResponseDto })
  @Post('register')
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  register(@Body() dto: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
    return this.authService.register(dto);
  }

  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @Post('login')
  @HttpCode(200)
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  login(
    @Body() dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  refresh(
    @Body() dto: RefreshDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refresh(dto);
  }
}

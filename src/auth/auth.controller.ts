import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service.js';
import { RegisterDto } from './dto/register.dto.js';
import type { User } from '../generated/prisma/client.js';
import { ErrorResponseDto } from '../common/dto/error-response.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiConflictResponse({ type: ErrorResponseDto })
  register(@Body() dto: RegisterDto): Promise<Omit<User, 'passwordHash'>> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(200)
  @ApiBadRequestResponse({ type: ErrorResponseDto })
  @ApiUnauthorizedResponse({ type: ErrorResponseDto })
  login(@Body() dto: LoginDto): Promise<Omit<User, 'passwordHash'>> {
    return this.authService.login(dto);
  }
}

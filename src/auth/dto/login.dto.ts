import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'clinic@example.com' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'example123' })
  password: string;
}

import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @MaxLength(100)
  @ApiProperty({
    example: 'clinic@example.com',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  @Matches(/^[\x20-\x7E]+$/, {
    message: 'password must contain English letters, numbers or symbols only',
  })
  @ApiProperty({
    example: 'example123',
  })
  password: string;
}

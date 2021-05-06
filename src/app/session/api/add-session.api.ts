import { ApiProperty } from '@nestjs/swagger';
import { SessionApiModel } from './models/session.model';
import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class AddSessionPayload {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'john@example.com'
  })
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'johndoe1234'
  })
  readonly password: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    example: 'response'
  })
  readonly captcha_response?: string;
}

export class AddSessionResponse201 extends SessionApiModel { }

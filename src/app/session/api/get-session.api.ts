import { ApiProperty } from '@nestjs/swagger';
import { SessionApiModel } from './models/session.model';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetSessionParams {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: '000000000000000000000001'
  })
  readonly id: string;
}

export class GetSessionResponse200 extends SessionApiModel { }

import { UserApiModel } from './models/user.model';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class GetUserParams {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    default: '000000000000000000000001'
  })
  readonly id: string;
}

export class GetUserResponse200 extends UserApiModel { }

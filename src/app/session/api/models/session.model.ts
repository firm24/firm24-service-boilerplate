import { UserApiModel } from './../../../user/api/models/user.model';
import { UserModel } from './../../../user/models/user.model';
import { ApiProperty } from '@nestjs/swagger';
import { SessionModel as Session } from '../../models/session.model';

export class SessionApiModel extends Session {
  @ApiProperty({
    type: String,
    example: '000000000000000000000001'
  })
  readonly id: string;

  @ApiProperty({
    type: String,
    example: '2019-01-01T00:00:00'
  })
  readonly created: Date;

  @ApiProperty({
    type: UserApiModel
  })
  readonly user: UserModel;
}

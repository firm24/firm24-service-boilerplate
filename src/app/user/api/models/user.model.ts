import { UserRoleEnum } from './../../enums/role.enum';
import { ApiProperty } from '@nestjs/swagger';
import { UserModel as User } from '../../models/user.model';
import { GenderEnum } from '../../../common/modules/gender/enums/gender.enum';
import { Locale } from 'locale-enum';

export class UserApiModel extends User {
  @ApiProperty({
    type: String,
    example: '000000000000000000000001'
  })
  readonly id: string;

  @ApiProperty({
    type: String,
    example: 'John'
  })
  readonly first_name: string;

  @ApiProperty({
    type: String,
    example: 'Doe'
  })
  readonly last_name: string;

  @ApiProperty({
    type: String,
    example: 'John Doe'
  })
  readonly display_name: string;

  @ApiProperty({
    type: String,
    example: 'male'
  })
  readonly gender: GenderEnum;

  @ApiProperty({
    type: String,
    example: 'john@example.com'
  })
  readonly email: string;

  @ApiProperty({
    type: String,
    example: '+31612345678'
  })
  readonly phone: string;

  @ApiProperty({
    enum: Locale,
    example: Locale.nl_NL
  })
  readonly locale: Locale;

  @ApiProperty({
    type: Date,
    example: '01-31-2020'
  })
  readonly birth_date: Date;

  @ApiProperty({
    type: String,
    example: 'Netherlands'
  })
  readonly birth_country: string;
}

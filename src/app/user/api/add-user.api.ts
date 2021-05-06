import { UserApiModel } from './models/user.model';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { AddressModel } from '../../common/modules/address/models/address.model';
import { AddressPayload } from '../../common/modules/address/address.api';
import { Type } from 'class-transformer';
import { GenderEnum } from '../../common/modules/gender/enums/gender.enum';
import { Locale } from 'locale-enum';

export class AddUserPayload {
  @IsString()
  @ApiProperty({
    type: String,
    example: 'John',
  })
  readonly first_name: string;

  @IsString()
  @ApiProperty({
    type: String,
    example: 'Doe',
  })
  readonly last_name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    example: 'John Doe',
  })
  readonly display_name?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'male'
  })
  readonly gender?: GenderEnum;

  @IsString()
  @IsEmail()
  @ApiProperty({
    type: String,
    example: 'john@example.com',
  })
  readonly email: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    example: 'johndoe1234',
  })
  readonly password?: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    example: '+31612345678',
  })
  readonly phone?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'response'
  })
  readonly captcha_response?: string;

  @IsOptional()
  @ApiPropertyOptional({
    type: AddressPayload
  })
  @Type(() => AddressPayload)
  readonly address?: AddressModel;

  @IsEnum(Locale)
  @IsOptional()
  @ApiPropertyOptional({
    type: Locale,
    enum: Locale,
    example: Locale.nl_NL
  })
  readonly locale?: Locale;

  @IsDateString()
  @IsOptional()
  @ApiPropertyOptional({
    type: Date,
    example: '2020-01-31'
  })
  readonly birth_date?: Date;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({
    type: String,
    example: 'Netherlands'
  })
  readonly birth_country?: string;
}

export class AddUserResponse201 extends UserApiModel { }

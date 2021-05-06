import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AddressPayload {
  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'Jan Ligthartstraat'
  })
  readonly street?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: '1964 HH'
  })
  readonly postal_code?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: '132'
  })
  readonly number?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'a'
  })
  readonly addition?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'Heemskerk'
  })
  readonly city?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'Noord-Holland'
  })
  readonly province?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    type: String,
    example: 'Netherlands'
  })
  readonly country?: string;
}

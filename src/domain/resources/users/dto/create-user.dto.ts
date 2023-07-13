import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'The firstname of a user.' })
  @IsString()
  @IsNotEmpty()
  readonly firstname: string;

  @ApiProperty({ description: 'The lastname of a user.' })
  @IsString()
  @IsNotEmpty()
  readonly lastname: string;

  @ApiProperty({ description: 'The email of a user.' })
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @ApiProperty({ description: 'The password of a user.' })
  @IsString()
  @MinLength(12)
  @IsNotEmpty()
  readonly password: string;

  @ApiProperty({ description: 'The company ID of a user.' })
  @IsUUID()
  @IsOptional()
  readonly companyId?: string;
}

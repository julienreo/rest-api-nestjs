import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class SignUpDto {
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
  @MinLength(12)
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}

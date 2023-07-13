import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCompanyDto {
  @ApiProperty({ description: 'The name of a company.' })
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @ApiProperty({ description: 'The address of a company.' })
  @IsString()
  @IsNotEmpty()
  readonly address: string;

  @ApiProperty({ description: 'The post code of a company.' })
  @IsString()
  @IsNotEmpty()
  readonly postcode: string;

  @ApiProperty({ description: 'The city of a company.' })
  @IsString()
  @IsNotEmpty()
  readonly city: string;

  @ApiProperty({ description: 'The country of a company.' })
  @IsString()
  @IsNotEmpty()
  readonly country: string;
}

import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) // Convert type from string to number
  limit?: number;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  offset?: number;
}

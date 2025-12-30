import { IsOptional, IsNumber, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RentFilterDto {
  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  endDate?: string;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  minMonthlyValue?: number;

  @ApiPropertyOptional()
  @Type(() => Number)
  @IsOptional()
  maxMonthlyValue?: number;
}

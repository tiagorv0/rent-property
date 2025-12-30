import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { EmptyToUndefined } from '../decorator/empty-to-undefined.decorator';

export class PaginateOptionsDto {
  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  limitPerPage: number;

  @ApiProperty()
  totalItems: number;
}

export class PaginateDto<T> {
  @ApiProperty()
  data: T[];

  @ApiProperty()
  pagination: PaginateOptionsDto;
}

export class PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 15;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @EmptyToUndefined()
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc', 'ASC', 'DESC'])
  sortOrder?: string = 'desc';
}

export class SearchWithPaginationDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @EmptyToUndefined()
  search?: string;
}

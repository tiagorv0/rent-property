import { PaginationDto } from 'src/common/dto/paginate.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { EmptyToUndefined } from 'src/common/decorator/empty-to-undefined.decorator';
import { Type } from 'class-transformer';

export class FindAllPropertyFilterDto extends PaginationDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @EmptyToUndefined()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @EmptyToUndefined()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @EmptyToUndefined()
  state?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @EmptyToUndefined()
  registrationValueGTE?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @EmptyToUndefined()
  registrationValueLTE?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @EmptyToUndefined()
  marketValueGTE?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @EmptyToUndefined()
  marketValueLTE?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @EmptyToUndefined()
  squareMetersGTE?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @EmptyToUndefined()
  squareMetersLTE?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @EmptyToUndefined()
  isRented?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  @EmptyToUndefined()
  active?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  createdAtStart?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  createdAtEnd?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  updatedAtStart?: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  updatedAtEnd?: Date;
}

import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class PropertyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  zipCode: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  registration: string;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  @IsNumber()
  registrationValue: number;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  boughtAt: Date;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  marketValue: number | null;

  @ApiProperty({ type: Number, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  squareMeters: number | null;
}

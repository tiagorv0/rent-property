import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Min,
  Max,
  ValidateIf,
} from 'class-validator';
import { Types } from 'mongoose';
import { ParseObjectId } from 'nestjs-object-id';
import { InflationIndices, InflationIndicesHelper } from 'src/common/enum/inflation-indices.enum';
import { PaymentMethod, PaymentMethodHelper } from 'src/common/enum/payment-method.enum';
import { IsBankAccountRequiredIfPix } from 'src/common/decorator/is-required-if-pix.decorator';

export class RentDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Number)
  monthlyValue: number;

  @ApiProperty()
  @IsNotEmpty()
  @Min(1)
  @Max(31)
  @Type(() => Number)
  paymentDay: number;

  @ApiProperty({
    enum: PaymentMethod,
    description: `Método de pagamento: ${PaymentMethodHelper.getAll().map(i => `${i.value} - ${i.label}`).join(', ')}`
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  @Type(() => Number)
  paymentMethod: PaymentMethod;

  @ApiProperty()
  @IsNotEmpty()
  includesTaxes: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateIf(o => o.includesTaxes, { message: 'valueTaxes is required when includesTaxes is true' })
  @IsNumber()
  @Type(() => Number)
  valueTaxes?: number;

  @ApiProperty({
    enum: InflationIndices,
    description: `Índice de inflação: ${InflationIndicesHelper.getAll().map(i => `${i.value} - ${i.label}`).join(', ')}`
  })
  @IsEnum(InflationIndices)
  @IsNotEmpty()
  @Type(() => Number)
  inflationIndice: InflationIndices;

  @ApiProperty({
    type: String
  })
  @IsNotEmpty()
  @ParseObjectId()
  property: Types.ObjectId;

  @ApiProperty({
    type: String
  })
  @IsNotEmpty()
  @ParseObjectId()
  tenant: Types.ObjectId;

  @ApiPropertyOptional({
    type: String,
  })
  @IsBankAccountRequiredIfPix()
  bankAccount?: Types.ObjectId;

  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  @IsOptional()
  contractFilePath?: Express.Multer.File;
}

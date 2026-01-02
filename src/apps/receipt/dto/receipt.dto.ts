import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsDateString, IsString } from 'class-validator';
import { PaymentMethod, PaymentMethodHelper } from 'src/common/enum/payment-method.enum';

export class ReceiptDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  paymentDueDate: Date;

  @ApiProperty({ 
      enum: PaymentMethod,   
      description: `Método de pagamento: ${PaymentMethodHelper.getAll().map(i => `${i.value} - ${i.label}`).join(', ')}` 
    })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @ApiPropertyOptional()
  @IsString()
  observation?: string | null;
}

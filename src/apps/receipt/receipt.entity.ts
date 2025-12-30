import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/baseEntity';
import { HydratedDocument, Types } from 'mongoose';
import { PaymentMethod, PaymentMethodHelper } from 'src/common/enum/payment-method.enum';
import { Rent } from 'src/apps/rent/rent.entity';
import { PaymentStatus, PaymentStatusHelper } from 'src/common/enum/payment-status.enum';

export type ReceiptDocument = HydratedDocument<Receipt>;

@Schema({
  timestamps: true,
})
export class Receipt extends BaseEntity {
  @Prop()
  value: number;

  @Prop()
  paymentDate: Date;

  @Prop({ type: Date, required: false })
  paymentDueDate?: Date | null;

  @Prop()
  paymentMethod: PaymentMethod;

  @Prop()
  paymentStatus: PaymentStatus;

  @Prop({ type: String, required: false })
  observation?: string | null;

  @Prop({ type: Types.ObjectId, ref: 'Rent' })
  rent: Rent;
}

export const ReceiptSchema = SchemaFactory.createForClass(Receipt);

// ReceiptSchema.virtual('paymentMethodLabel').get(function () {
//   return PaymentMethodHelper.getDescription(this.paymentMethod);
// });

// ReceiptSchema.virtual('paymentStatusLabel').get(function () {
//   return PaymentStatusHelper.getDescription(this.paymentStatus);
// });

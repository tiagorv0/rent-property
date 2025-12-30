import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/baseEntity';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Property } from 'src/apps/property/property.entity';
import { PaymentMethod, PaymentMethodHelper } from 'src/common/enum/payment-method.enum';
import { InflationIndices, InflationIndicesHelper } from 'src/common/enum/inflation-indices.enum';
import { BankAccount } from 'src/apps/bankaccount/bank-account.entity';
import { Tenant } from 'src/apps/tenant/tenant.entity';
import { Receipt } from 'src/apps/receipt/receipt.entity';

export type RentDocument = HydratedDocument<Rent>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true }
})
export class Rent extends BaseEntity {
  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ type: Number, required: true })
  monthlyValue: number;

  @Prop({ type: Number, required: true })
  paymentDay: number;

  @Prop()
  paymentMethod: PaymentMethod;

  @Prop()
  includesTaxes: boolean;

  @Prop({ type: Types.Decimal128, required: false })
  valueTaxes: number | null;

  @Prop()
  inflationIndice: InflationIndices;

  @Prop({ type: Types.ObjectId, ref: Property.name })
  property: Property;

  @Prop({ type: Types.ObjectId, ref: Tenant.name })
  tenant: Tenant;

  @Prop({ type: Types.ObjectId, ref: BankAccount.name, required: false })
  bankAccount?: BankAccount | null;

  receipts: Receipt[];

  @Prop({ type: String, required: false })
  contractFilePath: string | null;

  constructor(
    startDate: Date,
    endDate: Date,
    monthlyValue: number,
    paymentDay: number,
    paymentMethod: PaymentMethod,
    includesTaxes: boolean,
    valueTaxes: number | null,
    inflationIndice: InflationIndices,
    property: Property,
    tenant: Tenant,
    bankAccount?: BankAccount | null,
  ) {
    super();
    this.startDate = startDate;
    this.endDate = endDate;
    this.monthlyValue = monthlyValue;
    this.paymentDay = paymentDay;
    this.paymentMethod = paymentMethod;
    this.includesTaxes = includesTaxes;
    this.valueTaxes = valueTaxes;
    this.inflationIndice = inflationIndice;
    this.property = property;
    this.tenant = tenant;
    this.bankAccount = bankAccount;
    this.active = true;
    this.contractFilePath = null;
  }
}

export const RentSchema = SchemaFactory.createForClass(Rent);

RentSchema.virtual('receipts', {
  ref: 'Receipt',
  localField: '_id',
  foreignField: 'rent',
});

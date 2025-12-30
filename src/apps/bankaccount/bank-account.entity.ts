import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types,  HydratedDocument } from 'mongoose';
import { BaseEntity } from 'src/common/baseEntity';
import { AccountType, AccountTypeHelper } from 'src/common/enum/account-type.enum';
import { User } from 'src/apps/user/user.entity';

export type BankAccountDocument = HydratedDocument<BankAccount>;

@Schema({
  timestamps: true,
  toJSON: { virtuals: true }
})
export class BankAccount extends BaseEntity {
  @Prop({ required: true })
  bankName: string;

  @Prop({ required: true })
  account: string;

  @Prop({ required: true })
  agency: string;

  @Prop({ required: true, enum: AccountType })
  accountType: AccountType;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId | User;

  constructor(
    bankName: string,
    account: string,
    agency: string,
    accountType: AccountType,
    user: Types.ObjectId | User,
  ) {
    super();
    this.bankName = bankName;
    this.account = account;
    this.agency = agency;
    this.accountType = accountType;
    this.user = user;
    this.active = true;
  }
}

export const BankAccountSchema = SchemaFactory.createForClass(BankAccount);

BankAccountSchema.virtual('accountTypeLabel').get(function () {
  return AccountTypeHelper.getDescription(this.accountType);
});

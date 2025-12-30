import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { BaseEntity } from 'src/common/baseEntity';
import { Property } from 'src/apps/property/property.entity';
import * as bcrypt from 'bcrypt';
import { BankAccount } from 'src/apps/bankaccount/bank-account.entity';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User extends BaseEntity {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Property' }] })
  properties: Types.ObjectId[] | Property[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'BankAccount' }] })
  bankAccounts: Types.ObjectId[] | BankAccount[];

  constructor(name: string, email: string, username: string) {
    super();
    this.name = name;
    this.email = email;
    this.username = username;
    this.active = true;
  }

  async setPassword(password: string): Promise<void> {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

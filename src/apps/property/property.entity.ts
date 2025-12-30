import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/baseEntity';
import { HydratedDocument, set, Types } from 'mongoose';
import { User } from 'src/apps/user/user.entity';
import { Rent } from '../rent/rent.entity';

export type PropertyDocument = HydratedDocument<Property>;

@Schema({ timestamps: true })
export class Property extends BaseEntity {
  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  zipCode: string;

  @Prop({ unique: true })
  registration: string;

  @Prop({ type: Types.Decimal128 })
  registrationValue: number;

  @Prop()
  boughtAt: Date;

  @Prop({ type: Types.Decimal128, required: false  })
  marketValue: number | null;

  @Prop({ type: Number, required: false })
  squareMeters: number | null;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId | User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Rent' }] })
  rents: Types.ObjectId[] | Rent[];

  constructor(
    name: string,
    address: string,
    city: string,
    state: string,
    zipCode: string,
    registration: string,
    registrationValue: number,
    boughtAt: Date,
    marketValue: number | null,
    squareMeters: number | null,
    user: Types.ObjectId | User,
  ) {
    super();
    this.name = name;
    this.address = address;
    this.city = city;
    this.state = state;
    this.zipCode = zipCode;
    this.registration = registration;
    this.registrationValue = registrationValue;
    this.boughtAt = boughtAt;
    this.marketValue = marketValue;
    this.squareMeters = squareMeters;
    this.user = user;
    this.active = true;
  }
}

export const PropertySchema = SchemaFactory.createForClass(Property);

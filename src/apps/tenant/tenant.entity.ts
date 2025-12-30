import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from 'src/common/baseEntity';
import { User } from 'src/apps/user/user.entity';
import { Rent } from 'src/apps/rent/rent.entity';

export type TenantDocument = HydratedDocument<Tenant>;

@Schema({ timestamps: true })
export class Tenant extends BaseEntity {
  @Prop()
  name: string;

  @Prop()
  cpf: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId | User;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Rent' }] })
  rents: Types.ObjectId[] | Rent[];

  constructor(name: string, cpf: string, userId: Types.ObjectId | User) {
    super();
    this.name = name;
    this.cpf = cpf;
    this.user = userId;
    this.active = true;
  }
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

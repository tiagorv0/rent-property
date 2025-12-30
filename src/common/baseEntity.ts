import { Prop } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export abstract class BaseEntity {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: string;

  @Prop()
  active: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  disable() {
    this.active = false;
  }
}

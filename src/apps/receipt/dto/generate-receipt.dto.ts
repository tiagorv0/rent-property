import { Types } from 'mongoose';
import { Rent } from 'src/apps/rent/rent.entity';
import { User } from 'src/apps/user/user.entity';

export class GenerateReceiptDto {
  rent: Rent;
  user: string | User;

  constructor(
    rent: Rent,
    user: string | User,
  ) {
    this.rent = rent;
    this.user = user;
  }
}

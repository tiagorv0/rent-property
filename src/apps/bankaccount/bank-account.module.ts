import { Module } from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BankAccount, BankAccountSchema } from './bank-account.entity';
import { BankAccountController } from './bank-account.controller';

@Module({
  controllers: [BankAccountController],
  imports: [
    MongooseModule.forFeature([
      {
        name: BankAccount.name,
        schema: BankAccountSchema,
      },
    ]),
  ],
  providers: [BankAccountService],
  exports: [BankAccountService],
})
export class BankAccountModule { }

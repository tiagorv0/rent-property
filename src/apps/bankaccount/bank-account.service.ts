import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BankAccount, BankAccountDocument } from './bank-account.entity';
import { Model, Types } from 'mongoose';
import { BankAccountDto } from './dto/bankaccount.dto';

@Injectable()
export class BankAccountService {
  constructor(
    @InjectModel(BankAccount.name)
    private bankModel: Model<BankAccountDocument>,
  ) { }

  async createBankAccount(
    bankAccountDto: BankAccountDto,
    userId: string,
  ): Promise<BankAccount> {
    if (
      await this.bankModel
        .findOne({ account: bankAccountDto.account })
        .lean()
        .exec()
    ) {
      throw new BadRequestException('Conta já cadastrada');
    }

    const bankAccount = {
      ...bankAccountDto,
      user: userId,
      active: true,
    };
    return await this.bankModel.create(bankAccount);
  }

  async getBankAccountsByUserId(userId: string): Promise<BankAccount[]> {
    return await this.bankModel.find({ user: userId }).exec();
  }

  async getBankAccountById(id: string | Types.ObjectId): Promise<BankAccount | null> {
    return await this.bankModel.findById(id).exec();
  }

  async updateBankAccount(
    id: string,
    bankAccountDto: BankAccountDto,
  ): Promise<BankAccount | null> {
    if (
      await this.bankModel
        .findOne({ account: bankAccountDto.account })
        .lean()
        .exec()
    ) {
      throw new BadRequestException('Conta já cadastrada');
    }

    return await this.bankModel
      .findByIdAndUpdate(id, bankAccountDto, { new: true, runValidators: true })
      .exec();
  }

  async deleteBankAccount(id: string): Promise<void> {
    await this.bankModel.findByIdAndDelete(id).exec();
  }
}

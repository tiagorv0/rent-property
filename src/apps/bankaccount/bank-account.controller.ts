import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BankAccountService } from './bank-account.service';
import { JwtAuthGuard } from 'src/apps/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUserId } from 'src/common/decorator/current-userid.decorator';
import { ParseObjectIdPipe } from 'nestjs-object-id';
import { BankAccountDto } from './dto/bankaccount.dto';

@Controller('bankaccounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BankAccountController {
  constructor(private readonly bankService: BankAccountService) { }

  @Post()
  async createBankAccount(
    @Body() bankAccountDto: BankAccountDto,
    @CurrentUserId(ParseObjectIdPipe) userId: string,
  ) {
    return await this.bankService.createBankAccount(bankAccountDto, userId);
  }

  @Get('my-bankaccounts')
  async getBankAccounts(@CurrentUserId(ParseObjectIdPipe) userId: string) {
    return await this.bankService.getBankAccountsByUserId(userId);
  }

  @Get(':id')
  async getBankAccountById(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.bankService.getBankAccountById(id);
  }

  @Put(':id')
  async updateBankAccount(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() bankAccountDto: BankAccountDto,
  ) {
    return await this.bankService.updateBankAccount(id, bankAccountDto);
  }

  @Delete(':id')
  async deleteBankAccount(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.bankService.deleteBankAccount(id);
  }
}

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Rent, RentDocument } from './rent.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RentDto } from './dto/rent.dto';
import { RentFilterDto } from './dto/rent-filter.dto';
import { GenerateReceiptDto } from 'src/apps/receipt/dto/generate-receipt.dto';
import { EventService } from 'src/providers/event/event.service';
import { EventKey } from 'src/providers/event/event-key.enum';
import { IndexInflationFactoryService } from 'src/providers/external-http/bcb-api/index-inflation-factory.service';
import { InflationIndices } from 'src/common/enum/inflation-indices.enum';
import { InflationCalculationResult } from 'src/providers/external-http/bcb-api/dto/inflation-result.dto';
import { BankAccountService } from 'src/apps/bankaccount/bank-account.service';
import { TenantService } from 'src/apps/tenant/tenant.service';
import { PaymentMethod } from 'src/common/enum/payment-method.enum';
import { DisableReceiptDto } from '../receipt/dto/disable-receipt.dto';
import { Receipt } from '../receipt/receipt.entity';

@Injectable()
export class RentService {
  constructor(
    @InjectModel(Rent.name) private rentModel: Model<RentDocument>,
    private bankAccountService: BankAccountService,
    private tenantService: TenantService,
    private eventEmitterService: EventService,
    private IndexInflationService: IndexInflationFactoryService,
  ) { }

  async createAsync(
    rentDto: RentDto,
    userId: string,
    contractFilePath?: string,
  ): Promise<Rent> {
    await this.validateDto(rentDto);

    const newRent = {
      ...rentDto,
      active: true,
      contractFilePath: contractFilePath || null,
    };

    const createdRent = await new this.rentModel(newRent).save();

    this.eventEmitterService.emit(
      EventKey.GenerateNewReceipts,
      new GenerateReceiptDto(
        createdRent,
        userId
      ),
    );

    return createdRent;
  }

  private async validateDto(rentDto: RentDto) {
    const isRented = await this.rentModel
      .findOne({
        property: rentDto.property,
        active: true,
      })
      .lean()
      .exec();

    if (isRented) {
      throw new BadRequestException('Propriedade já está alugada');
    }

    const tenant = await this.tenantService.getTenantById(new Types.ObjectId(rentDto.tenant));

    if (!tenant) {
      throw new NotFoundException('Locatário não encontrado');
    }

    if (rentDto.bankAccount && rentDto.paymentMethod === PaymentMethod.PIX) {
      const bankAccount = await this.bankAccountService.getBankAccountById(new Types.ObjectId(rentDto.bankAccount));
      if (!bankAccount) {
        throw new NotFoundException('Conta bancária não encontrada');
      }
    }
  }

  async getAllRentsByUserIdAsync(
    userId: string,
    filter: RentFilterDto,
  ): Promise<Rent[]> {
    const query: any = {
    };

    if (filter.startDate || filter.endDate) {
      if (filter.startDate) {
        query.startDate = { $gte: new Date(filter.startDate) };
      }
      if (filter.endDate) {
        query.endDate = { $lte: new Date(filter.endDate) };
      }
    }

    if (filter.minMonthlyValue || filter.maxMonthlyValue) {
      query.monthlyValue = {};
      if (filter.minMonthlyValue)
        query.monthlyValue.$gte = filter.minMonthlyValue;
      if (filter.maxMonthlyValue)
        query.monthlyValue.$lte = filter.maxMonthlyValue;
    }

    const rents = await this.rentModel
      .find(query)
      .populate({
        path: 'property',
        match: { user: userId },
      })
      .populate({
        path: 'receipts',
        match: { active: true },
        model: Receipt.name
      })
      .exec();

    return rents.filter(rent => rent.property !== null);
  }

  async getRentByIdAsync(id: string): Promise<Rent | null> {
    return await this.rentModel.findById(id)
      .populate({
        path: "receipts",
        match: { active: true },
        model: Receipt.name
      })
      .lean().exec();
  }

  async updateRentAsync(
    id: string,
    rentDto: RentDto,
    userId: string,
    contractFilePath?: string,
  ): Promise<Rent | null> {
    const updateData: any = { ...rentDto };
    if (contractFilePath) {
      updateData.contractFilePath = contractFilePath;
    }
    const result = await this.rentModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .lean()
      .exec();

    if (result) {
      this.eventEmitterService.emit(
        EventKey.UpdateReceipts,
        new GenerateReceiptDto(
          result,
          userId
        ),
      );
    }

    return result;
  }

  async disableRentAsync(id: string): Promise<void> {
    const result = await this.rentModel.findByIdAndUpdate(id, { active: false }).exec();
    if (result) {
      this.eventEmitterService.emit(
        EventKey.DisableReceipts,
        new DisableReceiptDto(
          result._id
        ),
      );
    }
  }

  async deleteRentAsync(id: string): Promise<void> {
    const result = await this.rentModel.findByIdAndDelete(id).exec();
    if (result) {
      this.eventEmitterService.emit(
        EventKey.DeleteReceipts,
        new DisableReceiptDto(
          result._id
        ),
      );
    }
  }

  async calculateMonthlyValueByInflation(id: string, indexInflation: InflationIndices): Promise<InflationCalculationResult> {
    const rent = await this.rentModel.findById(id).select('monthlyValue startDate').lean().exec();
    if (!rent) throw new NotFoundException('Aluguel não encontrado');

    const indexInflationService = this.IndexInflationService.createIndexInflationService(indexInflation);
    return await indexInflationService.updateValueByDate({ value: rent.monthlyValue, startDate: rent.startDate, endDate: new Date() });
  }
}

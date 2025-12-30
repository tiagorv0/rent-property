import { BadRequestException, Injectable } from '@nestjs/common';
import { Receipt, ReceiptDocument } from './receipt.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ReceiptDto } from './dto/receipt.dto';
import { GenerateReceiptDto } from './dto/generate-receipt.dto';
import { OnEvent } from '@nestjs/event-emitter';
import { EventKey } from 'src/providers/event/event-key.enum';
import { PaymentStatus } from 'src/common/enum/payment-status.enum';
import { DisableReceiptDto } from './dto/disable-receipt.dto';
import { Types } from 'mongoose';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectModel(Receipt.name) private receiptModel: Model<ReceiptDocument>,
  ) { }

  async confirmReceiptAsync(id: string, receiptDto: ReceiptDto): Promise<Receipt | null> {
    const receipt = await this.receiptModel.findById(id).lean().exec();
    if (!receipt) {
      throw new BadRequestException('Recibo não encontrado');
    }

    const updatedReceipt = {
      ...receipt,
      ...receiptDto,
    };

    return await this.receiptModel
      .findByIdAndUpdate(id, updatedReceipt, { new: true })
      .exec();
  }

  @OnEvent(EventKey.GenerateNewReceipts)
  async generateReceiptAsync(payload: GenerateReceiptDto): Promise<void> {
    const startDate = new Date(payload.rent.startDate);
    const endDate = new Date(payload.rent.endDate);
    const paymentDay = payload.rent.paymentDay;

    const receipts: Receipt[] = [];
    const currentMonth = new Date(
      startDate.getUTCFullYear(),
      startDate.getUTCMonth(),
      1,
    );
    const endMonth = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), 1);

    while (currentMonth <= endMonth) {
      const paymentDate = new Date(
        currentMonth.getUTCFullYear(),
        currentMonth.getUTCMonth(),
        paymentDay,
      );

      const receipt = new this.receiptModel({
        value: payload.rent.monthlyValue,
        paymentDate: paymentDate,
        paymentMethod: payload.rent.paymentMethod,
        rent: payload.rent,
        user: payload.user,
        active: true,
        paymentStatus: PaymentStatus.PENDING,
      });
      receipts.push(receipt);

      currentMonth.setMonth(currentMonth.getUTCMonth() + 1);
    }
    await this.receiptModel.insertMany(receipts);
  }

  @OnEvent(EventKey.UpdateReceipts)
  async updateReceiptsAsync(payload: GenerateReceiptDto): Promise<void> {
    const { rent, user } = payload;
    console.log(rent);
    console.log(user);
    const allReceipts = await this.receiptModel.find({ rent: rent._id}).exec();
    const receiptsByMonth = new Map<string, ReceiptDocument>();

    for (const receipt of allReceipts) {
      const key = `${receipt.paymentDate.getUTCFullYear()}-${receipt.paymentDate.getUTCMonth()}`;
      receiptsByMonth.set(key, receipt);
    }

    const processedReceiptIds = new Set<string>();
    const startDate = new Date(rent.startDate);
    const endDate = new Date(rent.endDate);
    const currentIterDate = new Date(startDate.getUTCFullYear(), startDate.getUTCMonth(), 1);
    const endIterDate = new Date(endDate.getUTCFullYear(), endDate.getUTCMonth(), 1);

    while (currentIterDate <= endIterDate) {
      const year = currentIterDate.getUTCFullYear();
      const month = currentIterDate.getUTCMonth();
      const key = `${year}-${month}`;

      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const day = Math.min(rent.paymentDay, daysInMonth);
      const targetPaymentDate = new Date(year, month, day);

      const existingReceipt = receiptsByMonth.get(key);

      if (existingReceipt) {
        processedReceiptIds.add(existingReceipt._id.toString());
        if (existingReceipt.paymentStatus === PaymentStatus.PENDING) {
          existingReceipt.value = rent.monthlyValue;
          existingReceipt.paymentDate = targetPaymentDate;
          existingReceipt.paymentMethod = rent.paymentMethod;
          existingReceipt.active = rent.active;
          await existingReceipt.save();
        }
      } else {
        await this.receiptModel.create({
          value: rent.monthlyValue,
          paymentDate: targetPaymentDate,
          paymentMethod: rent.paymentMethod,
          rent: rent._id,
          user: user,
          active: rent.active,
          paymentStatus: PaymentStatus.PENDING,
        });
      }
      currentIterDate.setMonth(currentIterDate.getUTCMonth() + 1);
    }

    for (const receipt of allReceipts) {
      if (!processedReceiptIds.has(receipt._id.toString()) && receipt.paymentStatus === PaymentStatus.PENDING) {
        await this.receiptModel.findByIdAndDelete(receipt._id).exec();
      }
    }
  }

  @OnEvent(EventKey.DisableReceipts)
  async disableReceiptsAsync(payload: DisableReceiptDto): Promise<void> {
    const { rentId } = payload;
    await this.receiptModel.updateMany({ rent: rentId, paymentStatus: PaymentStatus.PENDING }, { $set:{ active: false }}).exec();
  }

  @OnEvent(EventKey.DeleteReceipts)
  async deleteReceiptsAsync(payload: DisableReceiptDto): Promise<void> {
    const { rentId } = payload;
    await this.receiptModel.deleteMany({ rent: rentId }).exec();
  }
}

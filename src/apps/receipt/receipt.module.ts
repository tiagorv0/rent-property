import { Module } from '@nestjs/common';
import { ReceiptController } from './receipt.controller';
import { ReceiptService } from './receipt.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Receipt } from './receipt.entity';
import { ReceiptSchema } from './receipt.entity';

@Module({
  controllers: [ReceiptController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Receipt.name,
        schema: ReceiptSchema,
      },
    ]),
  ],
  providers: [ReceiptService],
  exports: [ReceiptService, MongooseModule],
})
export class ReceiptModule {}

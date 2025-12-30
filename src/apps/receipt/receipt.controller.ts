import { Controller, Patch, Body, Param } from '@nestjs/common';
import { ReceiptService } from './receipt.service';
import { ReceiptDto } from './dto/receipt.dto';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { JwtAuthGuard } from 'src/apps/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';

@Controller('receipt')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReceiptController {
    constructor(private receiptService: ReceiptService) {}

    @Patch(":id")
    async confirmReceiptAsync(
        @Param("id", ParseObjectIdPipe) id: string,
        @Body() receiptDto: ReceiptDto,
    ) {
        return await this.receiptService.confirmReceiptAsync(id, receiptDto);
    }
}

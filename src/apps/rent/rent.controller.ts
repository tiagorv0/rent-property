import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  Patch,
  ValidationPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { createMulterOptions } from 'src/common/config/multer.config';
import { CurrentUserId } from 'src/common/decorator/current-userid.decorator';
import { JwtAuthGuard } from 'src/apps/auth/auth.guard';
import { ApiBearerAuth, ApiConsumes, ApiQuery } from '@nestjs/swagger';
import { RentDto } from './dto/rent.dto';
import { RentService } from './rent.service';
import { ParseObjectIdPipe } from 'nestjs-object-id';
import { RentFilterDto } from './dto/rent-filter.dto';
import { InflationIndices } from 'src/common/enum/inflation-indices.enum';

@Controller('rents')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RentController {
  constructor(private readonly rentService: RentService) { }

  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'contractFilePath',
    ),
  )
  async createRent(
    @Body() rentDto: RentDto,
    @CurrentUserId(ParseObjectIdPipe) userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2000000 }),
          new FileTypeValidator({
            fileType: 'application/pdf', 
            fallbackToMimetype: true,    
            skipMagicNumbersValidation: true
          }),
        ],
        fileIsRequired: false,
        exceptionFactory: (error) => {
          return new BadRequestException('Arquivo inválido');
        },
      }),
    )
    contractFilePath?: Express.Multer.File,
  ) {

    return await this.rentService.createAsync(
      rentDto,
      userId,
      contractFilePath?.path,
    );
  }

  @Get('my-rents')
  async getAllMyRents(
    @CurrentUserId(ParseObjectIdPipe) userId: string,
    @Query() filter: RentFilterDto,
  ) {
    return await this.rentService.getAllRentsByUserIdAsync(userId, filter);
  }

  @Get(':id')
  async getRentById(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.rentService.getRentByIdAsync(id);
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor(
      'contractFilePath',
    ),
  )
  async updateRent(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() rentDto: RentDto,
    @CurrentUserId(ParseObjectIdPipe) userId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ 
            fileType: 'application/pdf',
            fallbackToMimetype: true,    
            skipMagicNumbersValidation: true
          }),
          new MaxFileSizeValidator({ maxSize: 2000000 }),
        ],
        fileIsRequired: false,
      }),
    )
    contractFilePath?: Express.Multer.File,
  ) {
    return await this.rentService.updateRentAsync(
      id,
      rentDto,
      userId,
      contractFilePath?.path,
    );
  }

  @Delete(':id')
  async deleteRent(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.rentService.deleteRentAsync(id);
  }

  @Patch('disable/:id')
  async disableRent(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.rentService.disableRentAsync(id);
  }

  @Get(':id/calculate-monthly-value-by-inflation')
  @ApiQuery({ name: 'indexInflation', enum: InflationIndices, required: true })
  async calculateMonthlyValueByInflation(@Param('id', ParseObjectIdPipe) id: string,
    @Query() query: { indexInflation: InflationIndices }) {
    return await this.rentService.calculateMonthlyValueByInflation(id, query.indexInflation);
  }
}

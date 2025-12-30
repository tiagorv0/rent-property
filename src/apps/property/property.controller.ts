import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { PropertyDto } from './dto/property.dto';
import { CurrentUserId } from 'src/common/decorator/current-userid.decorator';
import { JwtAuthGuard } from 'src/apps/auth/auth.guard';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';
import { FindAllPropertyFilterDto } from './dto/find-all-property-filter.dto';
import { InflationIndices } from 'src/common/enum/inflation-indices.enum';

@Controller('properties')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  async createProperty(
    @CurrentUserId(ParseObjectIdPipe) userId: string,
    @Body() dto: PropertyDto,
  ) {
    return await this.propertyService.createProperty(dto, userId);
  }

  @Get('my-properties')
  async getMyProperties(
    @CurrentUserId(ParseObjectIdPipe) userId: string,
    @Query() query: FindAllPropertyFilterDto,
  ) {
    return await this.propertyService.getPropertiesByUserIdPaginated(
      userId,
      query,
    );
  }

  @Get(':id')
  async getPropertyById(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.propertyService.getPropertyById(id);
  }

  @Put(':id')
  async updateProperty(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: PropertyDto,
  ) {
    return await this.propertyService.updateProperty(id, dto);
  }

  @Delete(':id')
  async deleteProperty(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.propertyService.deleteProperty(id);
  }

  @Get(':id/calculate-updated-registration-value')
  @ApiQuery({ name: 'indexInflation', enum: InflationIndices, required: true })
  async calculateUpdatedRegistrationValue(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query() query: { indexInflation: InflationIndices },
  ) {
    return await this.propertyService.calculateUpdatedRegistrationValue(
      id,
      query.indexInflation,
    );
  }
}

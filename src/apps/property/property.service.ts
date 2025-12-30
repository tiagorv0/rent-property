import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Property, PropertyDocument } from './property.entity';
import { Model, FilterQuery } from 'mongoose';
import { PropertyDto } from './dto/property.dto';
import { PropertyResponseDto } from './dto/property-response.dto';
import { User, UserDocument } from 'src/apps/user/user.entity';
import { FindAllPropertyFilterDto } from './dto/find-all-property-filter.dto';
import { PaginateDto } from 'src/common/dto/paginate.dto';
import { paginate } from 'src/common/helpers/paginate-mongoose.helper';
import { Decimal128Helper } from 'src/common/helpers/decimal.helper';
import { IndexInflationFactoryService } from 'src/providers/external-http/bcb-api/index-inflation-factory.service';
import { InflationIndices } from 'src/common/enum/inflation-indices.enum';
import { InflationCalculationResult } from 'src/providers/external-http/bcb-api/dto/inflation-result.dto';

@Injectable()
export class PropertyService {
  constructor(
    @InjectModel(Property.name) private propertyModel: Model<PropertyDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly indexInflationFactoryService: IndexInflationFactoryService,
  ) {}

  async createProperty(
    property: PropertyDto,
    userId: string,
  ): Promise<PropertyResponseDto> {
    const user = await this.userModel.findById(userId).lean().exec();
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const newProperty = {
      ...property,
      user: userId,
      active: true,
      isRented: false,
    };

    return await new this.propertyModel(newProperty).save();
  }

  async getPropertyById(id: string): Promise<PropertyResponseDto | null> {
    return await this.propertyModel.findById(id).lean().exec();
  }

  async updateProperty(
    id: string,
    property: PropertyDto,
  ): Promise<PropertyResponseDto | null> {
    return await this.propertyModel
      .findByIdAndUpdate(id, property, { new: true, runValidators: true })
      .exec();
  }

  async deleteProperty(id: string): Promise<void> {
    await this.propertyModel.findByIdAndDelete(id).exec();
  }

  async getPropertiesByUserIdPaginated(
    userId: string,
    query: FindAllPropertyFilterDto,
  ): Promise<PaginateDto<Property>> {
    const {
      page = 1,
      limit = 15,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;
    
    const filterQuery: FilterQuery<PropertyDocument> = { user: userId };

    if (query.name) filterQuery.name = { $regex: query.name, $options: 'i' };
    if (query.active) filterQuery.active = query.active;
    if (query.city) filterQuery.city = { $regex: query.city, $options: 'i' };
    if (query.state) filterQuery.state = { $regex: query.state, $options: 'i' };

    if (
      query.registrationValueGTE !== undefined ||
      query.registrationValueLTE !== undefined
    ) {
      const registrationFilter = Decimal128Helper.createRangeFilter(
        query.registrationValueGTE,
        query.registrationValueLTE,
      );
      if (registrationFilter) {
        filterQuery.registrationValue = registrationFilter;
      }
    }

    if (
      query.marketValueGTE !== undefined ||
      query.marketValueLTE !== undefined
    ) {
      filterQuery.marketValue = {};
      if (query.marketValueGTE)
        filterQuery.marketValue.$gte = query.marketValueGTE;
      if (query.marketValueLTE)
        filterQuery.marketValue.$lte = query.marketValueLTE;
    }

    if (
      query.squareMetersGTE !== undefined ||
      query.squareMetersLTE !== undefined
    ) {
      filterQuery.squareMeters = {};
      if (query.squareMetersGTE)
        filterQuery.squareMeters.$gte = query.squareMetersGTE;
      if (query.squareMetersLTE)
        filterQuery.squareMeters.$lte = query.squareMetersLTE;
    }

    if (
      query.createdAtStart !== undefined ||
      query.createdAtEnd !== undefined
    ) {
      filterQuery.createdAt = {};
      if (query.createdAtStart)
        filterQuery.createdAt.$gte = query.createdAtStart;
      if (query.createdAtEnd) filterQuery.createdAt.$lte = query.createdAtEnd;
    }
    if (
      query.updatedAtStart !== undefined ||
      query.updatedAtEnd !== undefined
    ) {
      filterQuery.updatedAt = {};
      if (query.updatedAtStart)
        filterQuery.updatedAt.$gte = query.updatedAtStart;
      if (query.updatedAtEnd) filterQuery.updatedAt.$lte = query.updatedAtEnd;
    }

    return await paginate<Property, PropertyDocument>(
      this.propertyModel,
      filterQuery,
      { page, limit, sortBy, sortOrder },
    );
  }

  async calculateUpdatedRegistrationValue(id: string, indexInflation: InflationIndices): Promise<InflationCalculationResult> {
    const property = await this.propertyModel.findById(id).select('registrationValue boughtAt').lean().exec();
    if (!property) throw new NotFoundException('Imóvel não encontrado');

    const indexInflationService = this.indexInflationFactoryService.createIndexInflationService(indexInflation);
    return await indexInflationService.updateValueByDate({ value: property.registrationValue, startDate: property.boughtAt, endDate: new Date()});
  }
    
}

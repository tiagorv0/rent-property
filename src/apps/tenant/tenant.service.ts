import { Model, Types } from 'mongoose';
import { Tenant, TenantDocument } from './tenant.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TenantDto } from './dto/tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
  ) {}

  async createTenant(tenantDto: TenantDto, userId: string): Promise<Tenant> {
    if (await this.tenantModel.findOne({ cpf: tenantDto.cpf })) {
      throw new BadRequestException('CPF já cadastrado');
    }

    const tenant = {
      ...tenantDto,
      user: userId,
      active: true,
    };
    return await this.tenantModel.create(tenant);
  }

  async getTenants(userId: string): Promise<Tenant[]> {
    return await this.tenantModel.find({ user: userId }).lean().exec();
  }

  async getTenantById(id: string | Types.ObjectId): Promise<Tenant | null> {
    const result = await this.tenantModel.findById(id).lean().exec();
    return result;
  }

  async updateTenant(id: string, tenantDto: TenantDto): Promise<Tenant | null> {
    if (
      await this.tenantModel.findOne({
        cpf: tenantDto.cpf,
        _id: { $ne: id },
      })
    ) {
      throw new BadRequestException('CPF já cadastrado');
    }

    return await this.tenantModel
      .findByIdAndUpdate(id, tenantDto, { new: true })
      .lean()
      .exec();
  }

  async deleteTenant(id: string): Promise<void> {
    await this.tenantModel.findByIdAndDelete(id).exec();
  }
}

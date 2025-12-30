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
import { TenantService } from './tenant.service';
import { TenantDto } from './dto/tenant.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/apps/auth/auth.guard';
import { CurrentUserId } from 'src/common/decorator/current-userid.decorator';
import { ParseObjectIdPipe } from 'nestjs-object-id';

@Controller('tenants')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TenantController {
  constructor(private readonly tenantService: TenantService) {}

  @Post()
  async createTenant(
    @Body() tenantDto: TenantDto,
    @CurrentUserId(ParseObjectIdPipe) userId: string,
  ) {
    return await this.tenantService.createTenant(tenantDto, userId);
  }

  @Get('my-tenants')
  async getTenants(@CurrentUserId(ParseObjectIdPipe) userId: string) {
    return await this.tenantService.getTenants(userId);
  }

  @Get(':id')
  async getTenantById(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.tenantService.getTenantById(id);
  }

  @Put(':id')
  async updateTenant(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() tenantDto: TenantDto,
  ) {
    return await this.tenantService.updateTenant(id, tenantDto);
  }

  @Delete(':id')
  async deleteTenant(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.tenantService.deleteTenant(id);
  }
}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PropertyService } from './property.service';
import { Property, PropertySchema } from './property.entity';
import { PropertyController } from './property.controller';
import { UserModule } from 'src/apps/user/user.module';
import { BcbApiModule } from 'src/providers/external-http/bcb-api/bcb-api.module';

@Module({
  controllers: [PropertyController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Property.name,
        schema: PropertySchema,
      },
    ]),
    UserModule,
    BcbApiModule,
  ],
  providers: [PropertyService],
  exports: [PropertyService, MongooseModule],
})
export class PropertyModule {}

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Rent, RentSchema } from './rent.entity';
import { RentController } from './rent.controller';
import { RentService } from './rent.service';
import { EventModule } from '../../providers/event/event.module';
import { BcbApiModule } from 'src/providers/external-http/bcb-api/bcb-api.module';
import { BankAccountModule } from '../bankaccount/bank-account.module';
import { TenantModule } from '../tenant/tenant.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  controllers: [RentController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Rent.name,
        schema: RentSchema,
      },
    ]),
    EventModule,
    BcbApiModule,
    BankAccountModule,
    TenantModule,
    MulterModule.registerAsync({
      useFactory: () => ({
        dest: './uploads/contracts',
      }),
    })
  ],
  providers: [RentService],
})
export class RentModule {}

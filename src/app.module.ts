import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/providers/database/database.module';
import { UserModule } from 'src/apps/user/user.module';
import { PropertyModule } from 'src/apps/property/property.module';
import { AuthModule } from 'src/apps/auth/auth.module';
import { RentModule } from 'src/apps/rent/rent.module';
import { BankAccountModule } from 'src/apps/bankaccount/bank-account.module';
import { TenantModule } from 'src/apps/tenant/tenant.module';
import { ReceiptModule } from 'src/apps/receipt/receipt.module';
import { BcbApiModule } from './providers/external-http/bcb-api/bcb-api.module';
import { EventModule } from './providers/event/event.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    UserModule,
    PropertyModule,
    AuthModule,
    RentModule,
    BankAccountModule,
    TenantModule,
    ReceiptModule,
    EventModule,
    BcbApiModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

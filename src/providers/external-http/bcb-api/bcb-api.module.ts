import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { IndexInflationFactoryService } from './index-inflation-factory.service';
import { IpcaService } from './ipca.service';
import { InpcService } from './inpc.service';
import { IgpmService } from './igpm.service';
import { IpcService } from './ipc.service';

@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [IndexInflationFactoryService, IpcaService, InpcService, IgpmService, IpcService],
  exports: [IndexInflationFactoryService],
})
export class BcbApiModule {}

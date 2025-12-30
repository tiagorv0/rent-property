import { Injectable } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { InflationIndices } from "src/common/enum/inflation-indices.enum";
import { BcbApiService } from "./bcb-api.service";
import { IpcaService } from "./ipca.service";
import { InpcService } from "./inpc.service";
import { IgpmService } from "./igpm.service";
import { IpcService } from "./ipc.service";

@Injectable()
export class IndexInflationFactoryService {
    constructor(private readonly moduleRef: ModuleRef) {}

    createIndexInflationService(indexInflation: InflationIndices): BcbApiService {
        switch (indexInflation) {
            case InflationIndices.IPCA:
                return this.moduleRef.get(IpcaService);
            case InflationIndices.INPC:
                return this.moduleRef.get(InpcService);
            case InflationIndices.IGPM:
                return this.moduleRef.get(IgpmService);
            case InflationIndices.IPC:
                return this.moduleRef.get(IpcService);
            default:
                throw new Error('Índice de inflação inválido');
        }
    }
}
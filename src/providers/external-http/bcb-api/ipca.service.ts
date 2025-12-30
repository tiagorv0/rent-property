import { Injectable } from "@nestjs/common";
import { BcbApiService } from "./bcb-api.service";
import { InflationIndices, InflationIndicesHelper } from "src/common/enum/inflation-indices.enum";

@Injectable()
export class IpcaService extends BcbApiService {
    
    getCode(): string {
        return '433';
    }

    getName(): string {
        return InflationIndicesHelper.getDescription(InflationIndices.IPCA);
    }
}
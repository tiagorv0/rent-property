import { Injectable } from "@nestjs/common";
import { BcbApiService } from "./bcb-api.service";
import { InflationIndices, InflationIndicesHelper } from "src/common/enum/inflation-indices.enum";

@Injectable()
export class IgpmService extends BcbApiService {
    
    getCode(): string {
        return '189';
    }

    getName(): string {
        return InflationIndicesHelper.getDescription(InflationIndices.IGPM);
    }
}
import { BcbData } from "src/providers/external-http/bcb-api/dto/bcb-data";

export interface InflationCalculationResult {
  updatedValue: number;
  variationPercentage: number;
  monthsConsidered: number;
  details: BcbData[];
}
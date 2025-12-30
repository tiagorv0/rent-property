import { EnumHelper } from "../helpers/enum.helper";

export enum InflationIndices {
  IPCA = 1,
  INPC = 2,
  IGPM = 3,
  IPC = 4,
}

export const InflationIndicesHelper = new EnumHelper(InflationIndices, {
    [InflationIndices.IPCA]: 'IPCA',
    [InflationIndices.INPC]: 'INPC',
    [InflationIndices.IGPM]: 'IGP-M',
    [InflationIndices.IPC]: 'IPC-BR',
});


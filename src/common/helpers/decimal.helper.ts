import { Types } from 'mongoose';

export class Decimal128Helper {
  /**
   * Converte number para Decimal128
   */
  static toDecimal128(
    value: number | string | undefined,
  ): Types.Decimal128 | undefined {
    if (value === undefined || value === null) {
      return undefined;
    }

    try {
      return Types.Decimal128.fromString(value.toString());
    } catch (error) {
      console.error('Erro ao converter para Decimal128:', error);
      return undefined;
    }
  }

  /**
   * Converte Decimal128 para number
   */
  static toNumber(value: Types.Decimal128 | undefined): number | undefined {
    if (!value) {
      return undefined;
    }

    try {
      return parseFloat(value.toString());
    } catch (error) {
      console.error('Erro ao converter Decimal128 para number:', error);
      return undefined;
    }
  }

  /**
   * Cria filtro de range para campos Decimal128
   */
  static createRangeFilter(
    min?: number,
    max?: number,
  ): { $gte?: Types.Decimal128; $lte?: Types.Decimal128 } | undefined {
    const filter: any = {};

    if (min !== undefined) {
      filter.$gte = this.toDecimal128(min);
    }

    if (max !== undefined) {
      filter.$lte = this.toDecimal128(max);
    }

    return filter;
  }

  /**
   * Cria filtro de igualdade para campo Decimal128
   */
  static createEqualFilter(value?: number): Types.Decimal128 | undefined {
    return value !== undefined ? this.toDecimal128(value) : undefined;
  }

  /**
   * Valida se um valor pode ser convertido para Decimal128
   */
  static isValid(value: any): boolean {
    if (value === undefined || value === null) {
      return false;
    }

    try {
      Types.Decimal128.fromString(value.toString());
      return true;
    } catch {
      return false;
    }
  }
}

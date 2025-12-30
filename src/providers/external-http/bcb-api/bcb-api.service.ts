import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Logger } from '@nestjs/common';
import { BcbData } from './dto/bcb-data';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { InflationCalculateDto } from './dto/inflation-calculate.dto';
import { InflationCalculationResult } from './dto/inflation-result.dto';
import { DateHelper } from 'src/common/helpers/date.helpers';

@Injectable()
export abstract class BcbApiService {
  protected readonly logger = new Logger(BcbApiService.name);
  protected readonly BCB_API_URL: string;

  abstract getCode(): string;
  abstract getName(): string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.BCB_API_URL = this.configService.get<string>('BCB_API_URL', '');
  }

  async getData(dateStart: Date, dateEnd: Date): Promise<BcbData[]> {
    try {

      const dateStartFormatted = DateHelper.formatDateToPtBr(dateStart);
      const dateEndFormatted = DateHelper.formatDateToPtBr(dateEnd);

      this.logger.log(
        `Buscando ${this.getName()} de ${dateStartFormatted} até ${dateEndFormatted}`,
      );
      const url = `${this.BCB_API_URL}.${this.getCode()}/dados`;
      const response = await firstValueFrom(
        this.httpService.get<BcbData[]>(url, {
          params: {
            formato: 'json',
            dataInicial: dateStartFormatted,
            dataFinal: dateEndFormatted,
          },
        }),
      );

      if (!response.data || response.data.length === 0) {
        throw new HttpException(
          `Nenhum dado de ${this.getName()} encontrado para o período informado`,
          HttpStatus.NOT_FOUND,
        );
      }

      return response.data;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.log(error);
      this.logger.error(`Erro ao buscar dados do ${this.getName()}:`, error.message);
      throw new HttpException(
        `Erro ao comunicar com a API do Banco Central`,
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async updateValueByDate(dto: InflationCalculateDto): Promise<InflationCalculationResult> {
    const data = await this.getData(dto.startDate, dto.endDate);

    let indexAcumulated = 1;
    data.forEach((item) => {
      indexAcumulated *= 1 + parseFloat(item.valor) / 100;
    });

    const updatedValue = Number((dto.value * indexAcumulated).toFixed(2));
    const variationPercentage = Number(((indexAcumulated - 1) * 100).toFixed(2));
    const monthsConsidered = data.length;
    const details = data;
    return { updatedValue, variationPercentage, monthsConsidered, details };
  }
}

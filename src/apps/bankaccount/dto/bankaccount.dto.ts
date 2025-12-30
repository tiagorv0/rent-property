import { ApiProperty } from '@nestjs/swagger';
import { AccountType, AccountTypeHelper } from 'src/common/enum/account-type.enum';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class BankAccountDto {
  @ApiProperty({ example: 'Caixa' })
  @IsString()
  @IsNotEmpty()
  bankName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  account: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  agency: string;

  @ApiProperty({ 
      enum: AccountType,   
      description: `Tipo de conta: ${AccountTypeHelper.getAll().map(i => `${i.value} - ${i.label}`).join(', ')}` 
    })
  @IsNotEmpty()
  @IsEnum(AccountType)
  @Type(() => Number)

  accountType: AccountType;
}

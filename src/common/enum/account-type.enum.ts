import { EnumHelper } from "../helpers/enum.helper";

export enum AccountType {
  PF = 1,
  PJ = 2,
}

export const AccountTypeHelper = new EnumHelper(AccountType, {
    [AccountType.PF]: 'Pessoa Física',
    [AccountType.PJ]: 'Pessoa Jurídica',
});

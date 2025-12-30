import { EnumHelper } from "../helpers/enum.helper";

export enum PaymentMethod {
  CASH = 1,
  CHECK = 2,
  BILLET = 3,
  PIX = 4,
}

export const PaymentMethodHelper = new EnumHelper(PaymentMethod, {
    [PaymentMethod.CASH]: 'Dinheiro',
    [PaymentMethod.CHECK]: 'Cheque',
    [PaymentMethod.BILLET]: 'Boleto',
    [PaymentMethod.PIX]: 'Pix',
});


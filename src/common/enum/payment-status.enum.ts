import { EnumHelper } from "../helpers/enum.helper";

export enum PaymentStatus {
  PENDING = 1,

  PAID = 2,

  CANCELED = 3,

  OVERDUE = 4,
}

export const PaymentStatusHelper = new EnumHelper(PaymentStatus, {
    [PaymentStatus.PENDING]: 'Pendente',
    [PaymentStatus.PAID]: 'Pago',
    [PaymentStatus.CANCELED]: 'Cancelado',
    [PaymentStatus.OVERDUE]: 'Em Atraso',
});
import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';
import { PaymentMethod } from '../enum/payment-method.enum';
import { Types } from 'mongoose';

export function IsBankAccountRequiredIfPix(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            name: 'isBankAccountRequiredIfPix',
            target: object.constructor,
            propertyName: propertyName,
            constraints: [],
            options: {
                message: 'Conta bancária é obrigatória quando o método de pagamento é PIX e deve ser um ID válido',
                ...validationOptions,
            },
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const object = args.object as any;

                    // Se o método de pagamento for PIX
                    if (object.paymentMethod === PaymentMethod.PIX) {
                        // Valor é obrigatório e deve ser um ObjectId válido
                        if (!value) return false;
                        return Types.ObjectId.isValid(value);
                    }

                    // Se não for PIX, o valor é opcional, mas se existir, deve ser um ObjectId válido
                    if (value) {
                        return Types.ObjectId.isValid(value);
                    }

                    return true;
                },
            },
        });
    };
}

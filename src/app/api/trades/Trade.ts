import { OperationType, Prisma } from '.prisma/client';
import { z } from 'zod'

export type Trade = {
  id: string;
  name: string;
  price: string;
  stopLoss: string;
  takeProfit: string;
  profit: string;
  swap: string;
  pipsStopLoss: string;
  pipsTakeProfit: string;
  comment: string;
  accountId: string;
  symbolId: string;
};

const validateNumber = (value: string) => {
    try {
        const decimal = new Prisma.Decimal(value);
        return !isNaN(decimal.toNumber());
      } catch (error) {
        return !new Boolean(error);
      }
}

export const tradeValidator = z.object({
  id: z.string().uuid(),
  accountId: z.string().uuid(),
  symbolId: z.string().uuid(),
  comment: z.string().optional(),
  price: z.string({ required_error: 'Ingrese un precio.' }).refine(validateNumber, { message: 'Ingrese un precio válido.' }),
  stopLoss: z.string({ required_error: 'Ingrese un stop loss.' }).refine(validateNumber, { message: 'Ingrese un valor válido.' }),
  takeProfit: z.string({ required_error: 'Ingrese un take profit.' }).refine(validateNumber, { message: 'Ingrese un valor válido.' }),
  profit: z.string({ required_error: 'Ingrese un profit loss.' }).refine(validateNumber, { message: 'Ingrese un valor válido.' }),
  swap: z.string().refine(validateNumber, { message: 'Ingrese un swap válido.' }),
  pipsStopLoss: z.string().refine(validateNumber, { message: 'Ingrese un valor válido.' }),
  pipsTakeProfit: z.string().refine(validateNumber, { message: 'Ingrese un valor válido.' }),
  type: z.enum([OperationType.BUY, OperationType.SELL]),
  open: z.date({ required_error: 'Ingrese fecha de apertura.' }),
  close: z.date({ required_error: 'Ingrese fecha de cierre.' }),
});
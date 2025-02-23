import { Prisma } from '@prisma/client';
import { z } from 'zod'
import { Trade } from '../trades/Trade';

export type Account = {
  id: string;
  name: string;
  value: string;
  createAt: string;
  brokerId: string;
  trades: Trade[]
};

const validateNumber = (value: string) => {
    try {
        const decimal = new Prisma.Decimal(value);
        return !isNaN(decimal.toNumber());
      } catch (error) {
        return !new Boolean(error);
      }
}

export const accountValidator = z.object({
  id: z.string().uuid(),
  brokerId: z.string().uuid(),
  name: z
    .string({ required_error: 'Ingrese un nombre.' })
    .min(3, { message: 'Mínimo 3 caracteres.' }),
  value: z.string({ required_error: 'Ingrese un valor.' }).refine(validateNumber, { message: 'Ingrese un valor válido.' }),
  createAt: z.date({ required_error: 'Ingrese fecha de cierre.' })
});
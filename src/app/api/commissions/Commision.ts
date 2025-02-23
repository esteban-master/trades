import { z } from 'zod'
import { Prisma } from '@prisma/client'

export type Commission = {
  id: string;
  volume: string;
  value: string;
  symbolId: string
  brokerId: string
};

export const commissionValidator = z.object({
  id: z.string().uuid(),
  symbolId: z.string().uuid(),
  brokerId: z.string().uuid(),
  volume: z.string({ required_error: 'Ingrese un lote.' }).refine(
    (valor) => {
      try {
        const decimal = new Prisma.Decimal(valor);
        return !isNaN(decimal.toNumber());
      } catch (error) {
        return !new Boolean(error);
      }
    },
    { message: 'Ingrese un monto válido.' },
  ),
  value: z.string({ required_error: 'Ingrese un valor.' }).refine(
    (valor) => {
      try {
        const decimal = new Prisma.Decimal(valor);
        return !isNaN(decimal.toNumber());
      } catch (error) {
        return !new Boolean(error);
      }
    },
    { message: 'Ingrese un valor válido.' },
  ),
});
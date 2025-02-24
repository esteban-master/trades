import { z } from 'zod'
import { Commission } from '../commissions/Commision';

export type Symbol = {
  id: string;
  name: string;
  commissions: Commission
};

export const symbolValidator = z.object({
  id: z.string().uuid(),
  name: z
    .string({ required_error: 'Ingrese un nombre.' })
    .min(3, { message: 'Mínimo 3 caracteres.' }),
});
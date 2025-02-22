import { z } from 'zod'

export type Symbol = {
  id: string;
  name: string;
};

export const symbolValidator = z.object({
  id: z.string().uuid(),
  name: z
    .string({ required_error: 'Ingrese un nombre.' })
    .min(3, { message: 'Mínimo 3 caracteres.' }),
});
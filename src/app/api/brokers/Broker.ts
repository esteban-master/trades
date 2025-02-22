import { z } from 'zod'

export type Broker = {
  id: string;
  name: string;
};

export const brokerValidator = z.object({
  id: z.string().uuid(),
  name: z
    .string({ required_error: 'Ingrese un nombre.' })
    .min(3, { message: 'Mínimo 3 caracteres.' }),
});
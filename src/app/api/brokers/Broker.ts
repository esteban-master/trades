import { z } from 'zod'
import { Company } from '../company/Company';

export type Broker = {
  id: string;
  name: string;
  companyId: string;
  company: Company
};

export const brokerValidator = z.object({
  id: z.string().uuid(),
  companyId: z.string().uuid(),
  name: z
    .string({ required_error: 'Ingrese un nombre.' })
    .min(3, { message: 'Mínimo 3 caracteres.' }),
});
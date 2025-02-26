import { z } from 'zod'
import { Account } from '../accounts/Account';
import { Broker } from '../brokers/Broker';

export type Company = {
  id: string;
  name: string;
  accounts: Account[]
  brokers: Broker[]
};

export const companyValidator = z.object({
  id: z.string().uuid(),
  name: z
    .string({ required_error: 'Ingrese un nombre.' })
    .min(3, { message: 'Mínimo 3 caracteres.' }),
});
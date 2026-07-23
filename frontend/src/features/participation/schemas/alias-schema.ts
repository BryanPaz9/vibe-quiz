import { z } from 'zod';

export const aliasSchema = z.object({
  alias: z
    .string()
    .trim()
    .min(1, 'Ingresa un alias para comenzar.')
    .max(80, 'El alias no puede superar 80 caracteres.'),
});

export type AliasFormValues = z.infer<typeof aliasSchema>;

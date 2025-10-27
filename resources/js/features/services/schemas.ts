import { z } from 'zod';

// Service form schema
export const serviceFormSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().optional(),
  price: z.string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'El precio debe ser un número positivo',
    }),
  active: z.boolean().default(true),
});

// Service filter schema
export const serviceFilterSchema = z.object({
  search: z.string().optional(),
  active: z.enum(['all', 'true', 'false']).optional(),
});

// Inferred types
export type ServiceFormInput = z.infer<typeof serviceFormSchema>;
export type ServiceFilterInput = z.infer<typeof serviceFilterSchema>;

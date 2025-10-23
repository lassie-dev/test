import { z } from 'zod';
import { TipoContrato } from './types';

// Schemas básicos
export const rutSchema = z
  .string()
  .regex(/^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$/, 'Formato de RUT inválido');

export const telefonoSchema = z
  .string()
  .min(8, 'Teléfono debe tener al menos 8 dígitos');

// Schema de cliente
export const clienteSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  rut: rutSchema,
  telefono: telefonoSchema,
  email: z.string().email('Email inválido').optional(),
});

// Schema de difunto
export const difuntoSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  fecha_fallecimiento: z.date(),
  lugar_fallecimiento: z.string().optional(),
});

// Schema de servicio en contrato
export const contratoServicioSchema = z.object({
  servicio_id: z.number(),
  cantidad: z.number().min(1, 'La cantidad debe ser al menos 1'),
  precio_unitario: z.number().positive('El precio debe ser positivo'),
});

// Schema principal de contrato
export const contratoFormSchema = z.object({
  tipo: z.nativeEnum(TipoContrato),
  cliente: clienteSchema,
  difunto: difuntoSchema.optional(),
  servicios: z.array(contratoServicioSchema).min(1, 'Debe seleccionar al menos un servicio'),
  descuento: z.enum(['0', '3', '5', '8', '10', '15', '25', '30']).default('0'),
  forma_pago: z.enum(['contado', 'credito']),
});

// Tipos inferidos desde schemas
export type ContratoFormInput = z.infer<typeof contratoFormSchema>;
export type ClienteInput = z.infer<typeof clienteSchema>;
export type DifuntoInput = z.infer<typeof difuntoSchema>;

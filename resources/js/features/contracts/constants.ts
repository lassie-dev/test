export const PORCENTAJES_DESCUENTO = [0, 3, 5, 8, 10, 15, 25, 30] as const;

export const TIPOS_CONTRATO_OPTIONS = [
  { value: 'necesidad_inmediata', label: 'Necesidad Inmediata' },
  { value: 'necesidad_futura', label: 'Necesidad Futura' },
] as const;

export const ESTADOS_CONTRATO_OPTIONS = [
  { value: 'cotizacion', label: 'Cotización' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'cancelado', label: 'Cancelado' },
] as const;

export const FORMAS_PAGO_OPTIONS = [
  { value: 'contado', label: 'Contado' },
  { value: 'credito', label: 'Crédito' },
] as const;

export const DEFAULT_CONTRATO_VALUES = {
  tipo: 'necesidad_inmediata',
  descuento: '0',
  forma_pago: 'contado',
} as const;

export const COMISION_BASE_PORCENTAJE = 5;
export const COMISION_NOCTURNA_EXTRA = 2;
export const COMISION_FESTIVO_EXTRA = 3;

export const PORCENTAJES_DESCUENTO = [0, 3, 5, 8, 10, 15, 25, 30] as const;

export const TIPOS_CONTRATO_OPTIONS = [
  { value: 'necesidad_inmediata', labelKey: 'contracts.immediateNeed' },
  { value: 'necesidad_futura', labelKey: 'contracts.futureNeed' },
] as const;

export const ESTADOS_CONTRATO_OPTIONS = [
  { value: 'cotizacion', labelKey: 'contracts.quotation' },
  { value: 'contrato', labelKey: 'contracts.contract' },
  { value: 'finalizado', labelKey: 'contracts.finished' },
  { value: 'cancelado', labelKey: 'contracts.canceled' },
] as const;

export const FORMAS_PAGO_OPTIONS = [
  { value: 'contado', labelKey: 'contracts.cash' },
  { value: 'credito', labelKey: 'contracts.credit' },
] as const;

export const DEFAULT_CONTRATO_VALUES = {
  tipo: 'necesidad_inmediata',
  descuento: '0',
  forma_pago: 'contado',
} as const;

export const COMISION_BASE_PORCENTAJE = 5;
export const COMISION_NOCTURNA_EXTRA = 2;
export const COMISION_FESTIVO_EXTRA = 3;

// Payment method options (English keys for backend compatibility)
export const PAYMENT_METHOD_OPTIONS = [
  { value: 'cash', labelKey: 'contracts.cash' },
  { value: 'credit', labelKey: 'contracts.credit' },
] as const;

// Installment options (1-12 months)
export const INSTALLMENT_OPTIONS = Array.from({ length: 12 }, (_, i) => i + 1);

// Default payment values
export const DEFAULT_PAYMENT_VALUES = {
  payment_method: 'cash',
  installments: 1,
  down_payment: 0,
} as const;

// ============================================================================
// Badge Variants and Labels
// ============================================================================

export const ESTADO_BADGE_VARIANTS = {
  cotizacion: 'secondary',
  contrato: 'default',
  finalizado: 'outline',
  cancelado: 'destructive',
} as const;

export const ESTADO_LABEL_KEYS = {
  cotizacion: 'contracts.quotation',
  contrato: 'contracts.contract',
  finalizado: 'contracts.finished',
  cancelado: 'contracts.canceled',
} as const;

export const TIPO_LABEL_KEYS = {
  necesidad_inmediata: 'contracts.immediateShort',
  necesidad_futura: 'contracts.futureShort',
} as const;

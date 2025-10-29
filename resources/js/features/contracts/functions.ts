import {
  Contrato,
  ContratoServicio,
  EstadoContrato,
  TipoContrato,
  Product,
  ServiceItem,
  ProductItem
} from './types';
import {
  PORCENTAJES_DESCUENTO,
  COMISION_BASE_PORCENTAJE,
  COMISION_NOCTURNA_EXTRA,
  COMISION_FESTIVO_EXTRA,
  ESTADO_BADGE_VARIANTS,
  ESTADO_LABEL_KEYS,
  TIPO_LABEL_KEYS,
} from './constants';

// Funciones básicas (sin dependencias)
export function formatearRut(rut: string): string {
  const limpio = rut.replace(/[^0-9kK]/g, '');
  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1);
  return cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.') + '-' + dv;
}

export function validarRut(rut: string): boolean {
  const limpio = rut.replace(/[^0-9kK]/g, '');
  if (limpio.length < 2) return false;

  const cuerpo = limpio.slice(0, -1);
  const dv = limpio.slice(-1).toUpperCase();

  let suma = 0;
  let multiplo = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += multiplo * parseInt(cuerpo[i]);
    multiplo = multiplo < 7 ? multiplo + 1 : 2;
  }

  const dvEsperado = 11 - (suma % 11);
  const dvCalculado = dvEsperado === 11 ? '0' : dvEsperado === 10 ? 'K' : dvEsperado.toString();

  return dv === dvCalculado;
}

// Funciones de cálculo (usan constantes)
export function calcularSubtotal(servicios: ContratoServicio[]): number {
  return servicios.reduce((acc, item) => acc + item.subtotal, 0);
}

export function calcularDescuento(subtotal: number, porcentaje: number): number {
  if (!PORCENTAJES_DESCUENTO.includes(porcentaje as any)) {
    throw new Error(`Porcentaje de descuento inválido: ${porcentaje}`);
  }
  return (subtotal * porcentaje) / 100;
}

export function calcularTotal(subtotal: number, descuentoMonto: number): number {
  return Math.max(0, subtotal - descuentoMonto);
}

// Funciones complejas (usan tipos y otras funciones)
export function calcularTotalesContrato(
  servicios: ContratoServicio[],
  descuentoPorcentaje: number
): {
  subtotal: number;
  descuentoMonto: number;
  total: number;
} {
  const subtotal = calcularSubtotal(servicios);
  const descuentoMonto = calcularDescuento(subtotal, descuentoPorcentaje);
  const total = calcularTotal(subtotal, descuentoMonto);

  return { subtotal, descuentoMonto, total };
}

export function calcularComisionSecretaria(contrato: Contrato): number {
  let porcentajeComision = COMISION_BASE_PORCENTAJE;

  if (contrato.es_nocturno) {
    porcentajeComision += COMISION_NOCTURNA_EXTRA;
  }

  if (contrato.es_festivo) {
    porcentajeComision += COMISION_FESTIVO_EXTRA;
  }

  return (contrato.total * porcentajeComision) / 100;
}

// Funciones de transformación
export function contratoToFormData(contrato: Contrato): Partial<Contrato> {
  return {
    tipo: contrato.tipo,
    cliente: contrato.cliente,
    difunto: contrato.difunto,
    servicios: contrato.servicios,
    descuento_porcentaje: contrato.descuento_porcentaje,
  };
}

export function formatearNumeroContrato(numero: number): string {
  return `CTR-${numero.toString().padStart(6, '0')}`;
}

export function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
  }).format(valor);
}

// ============================================================================
// Date Formatting Functions
// ============================================================================

/**
 * Formats a date to Chilean locale format
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "15 ene 2024")
 */
export function formatearFecha(date: Date | string): string {
  return new Date(date).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ============================================================================
// Badge and Label Helper Functions
// ============================================================================

/**
 * Gets the badge variant for a contract status
 * @param estado - Contract status
 * @returns Badge variant string
 */
export function obtenerVarianteBadgeEstado(estado: EstadoContrato): string {
  return ESTADO_BADGE_VARIANTS[estado] || 'default';
}

/**
 * Gets the translation key for a contract status
 * @param estado - Contract status
 * @returns Translation key for the status label
 */
export function obtenerEtiquetaEstado(estado: EstadoContrato): string {
  return ESTADO_LABEL_KEYS[estado] || estado;
}

/**
 * Gets the translation key for a contract type
 * @param tipo - Contract type
 * @returns Translation key for the type label
 */
export function obtenerEtiquetaTipo(tipo: TipoContrato): string {
  return TIPO_LABEL_KEYS[tipo] || tipo;
}

// ============================================================================
// Item Calculation Functions (for Create form)
// ============================================================================

/**
 * Calculates subtotal for a service item
 */
export function calculateServiceSubtotal(item: ServiceItem): number {
  return item.quantity * item.unit_price;
}

/**
 * Calculates subtotal for a product item
 */
export function calculateProductSubtotal(item: ProductItem): number {
  return item.quantity * item.unit_price;
}

/**
 * Calculates total subtotals including both services and products
 * New logic: subtotal -> insurance coverage -> remaining -> discount -> final total
 */
export function calculateItemsTotals(
  services: ServiceItem[],
  products: ProductItem[],
  discountPercentage: number,
  agreementCompanyPaysPercentage: number = 0
): {
  servicesSubtotal: number;
  productsSubtotal: number;
  subtotal: number;
  insuranceCoverage: number;
  amountAfterInsurance: number;
  discountAmount: number;
  total: number;
} {
  const servicesSubtotal = services.reduce((sum, item) => sum + calculateServiceSubtotal(item), 0);
  const productsSubtotal = products.reduce((sum, item) => sum + calculateProductSubtotal(item), 0);
  const subtotal = servicesSubtotal + productsSubtotal;

  // Step 1: Calculate insurance coverage from subtotal
  const insuranceCoverage = (subtotal * agreementCompanyPaysPercentage) / 100;

  // Step 2: Amount remaining after insurance coverage
  const amountAfterInsurance = subtotal - insuranceCoverage;

  // Step 3: Apply discount to the amount after insurance
  const discountAmount = (amountAfterInsurance * discountPercentage) / 100;

  // Step 4: Final total client pays
  const total = amountAfterInsurance - discountAmount;

  return {
    servicesSubtotal,
    productsSubtotal,
    subtotal,
    insuranceCoverage,
    amountAfterInsurance,
    discountAmount,
    total,
  };
}

/**
 * Calculates commission based on total and modifiers
 */
export function calculateCommission(
  total: number,
  isNightShift: boolean,
  isHoliday: boolean
): {
  commissionRate: number;
  commissionAmount: number;
} {
  let commissionRate = COMISION_BASE_PORCENTAJE;

  if (isNightShift) {
    commissionRate += COMISION_NOCTURNA_EXTRA;
  }

  if (isHoliday) {
    commissionRate += COMISION_FESTIVO_EXTRA;
  }

  const commissionAmount = (total * commissionRate) / 100;

  return { commissionRate, commissionAmount };
}

// ============================================================================
// Product Helper Functions
// ============================================================================

/**
 * Checks if product is low on stock
 */
export function isProductLowStock(product: Product): boolean {
  return product.stock <= product.min_stock && product.stock > 0;
}

/**
 * Checks if product is out of stock
 */
export function isProductOutOfStock(product: Product): boolean {
  return product.stock === 0;
}

/**
 * Gets stock status indicator class
 */
export function getStockStatusClass(product: Product): string {
  if (isProductOutOfStock(product)) return 'text-red-500';
  if (isProductLowStock(product)) return 'text-yellow-500';
  return 'text-green-500';
}

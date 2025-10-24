import { Contrato, ContratoServicio } from './types';
import { PORCENTAJES_DESCUENTO, COMISION_BASE_PORCENTAJE, COMISION_NOCTURNA_EXTRA, COMISION_FESTIVO_EXTRA } from './constants';

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

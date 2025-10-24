// Enums básicos (sin dependencias)
export enum TipoContrato {
  NECESIDAD_INMEDIATA = 'necesidad_inmediata',
  NECESIDAD_FUTURA = 'necesidad_futura',
}

export enum EstadoContrato {
  COTIZACION = 'cotizacion',
  CONTRATO = 'contrato',
  FINALIZADO = 'finalizado',
  CANCELADO = 'cancelado',
}

// Tipos básicos
export type Rut = string;
export type Telefono = string;

// Interfaces básicas
export interface Cliente {
  id: number;
  nombre: string;
  rut: Rut;
  telefono: Telefono;
  email?: string;
}

export interface Difunto {
  id: number;
  nombre: string;
  fecha_fallecimiento: Date;
  lugar_fallecimiento?: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
}

// Interfaces que dependen de tipos básicos
export interface ContratoServicio {
  servicio: Servicio;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

// Interfaces complejas
export interface Contrato {
  id: number;
  numero_contrato: string;
  tipo: TipoContrato;
  estado: EstadoContrato;
  cliente: Cliente;
  difunto?: Difunto;
  servicios: ContratoServicio[];
  subtotal: number;
  descuento_porcentaje: number;
  descuento_monto: number;
  total: number;
  es_festivo: boolean;
  es_nocturno: boolean;
  created_at: Date;
  updated_at: Date;
}

// Tipos derivados usando utility types
export type ContratoFormData = Omit<Contrato, 'id' | 'numero_contrato' | 'created_at' | 'updated_at'>;
export type ContratoPartial = Partial<Contrato>;
export type ContratoPicker = Pick<Contrato, 'id' | 'numero_contrato' | 'cliente' | 'total'>;

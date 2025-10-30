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
  direccion?: string;
  parentesco?: string;
  ocupacion?: string;
}

export interface Difunto {
  id: number;
  nombre: string;
  fecha_fallecimiento: string | Date;
  hora_fallecimiento?: string;
  lugar_fallecimiento?: string;
  edad?: number;
  causa_fallecimiento?: string;
  nivel_estudio?: string;
  profesion?: string;
  estado_civil?: string;
  religion?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: 'service' | 'product';
  icon?: string;
}

export interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  category_id?: number;
  category?: Category;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export interface Convenio {
  id: number;
  nombre_empresa: string;
  empresa_paga_porcentaje: number;
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
  productos?: ContratoProductoDetalle[];
  convenio?: Convenio;
  iglesia?: { id: number; name: string; city: string };
  cementerio?: { id: number; name: string; city: string };
  sala_velacion?: { id: number; name: string; city: string };
  subtotal: number;
  descuento_porcentaje: number;
  descuento_monto: number;
  total: number;
  metodo_pago?: string;
  cuotas?: number;
  pie?: number;
  ubicacion_servicio?: string;
  fecha_hora_servicio?: string | Date;
  solicitudes_especiales?: string;
  ubicacion_recepcion?: string;
  modelo_ataud?: string;
  sector_cementerio?: string;
  detalles_cortejo?: string;
  notas_personal_adicional?: string;
  conductor_asignado?: Usuario;
  auxiliar_asignado?: Usuario;
  vehiculo_asignado?: Usuario;
  porcentaje_comision?: number;
  monto_comision?: number;
  secretaria?: Usuario;
  es_festivo: boolean;
  es_nocturno: boolean;
  created_at: Date;
  updated_at: Date;
}

// Product types (for contract items)
export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  category: string;
  precio: number;
  stock: number;
  min_stock: number;
  is_active: boolean;
}

export interface ContratoProductoDetalle {
  producto: Product;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

// Staff types (for contract assignments)
export interface Staff {
  id: number;
  name: string;
  email: string;
  role: string;
}

// Contract item types
export interface ContratoProducto {
  product_id: number;
  quantity: number;
  unit_price: number;
}

// Service item type for forms
export interface ServiceItem {
  service_id: number;
  quantity: number;
  unit_price: number;
}

// Product item type for forms
export interface ProductItem {
  product_id: number;
  quantity: number;
  unit_price: number;
}

// Tipos derivados usando utility types
export type ContratoFormData = Omit<Contrato, 'id' | 'numero_contrato' | 'created_at' | 'updated_at'>;
export type ContratoPartial = Partial<Contrato>;
export type ContratoPicker = Pick<Contrato, 'id' | 'numero_contrato' | 'cliente' | 'total'>;

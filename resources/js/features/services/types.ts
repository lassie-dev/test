// Basic types (no dependencies)
export interface Service {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  activo: boolean;
  category?: {
    id: number;
    name: string;
    slug: string;
  } | null;
  created_at: string;
  updated_at: string;
}

// Form data types using utility types
export type ServiceFormData = Pick<Service, 'nombre' | 'descripcion' | 'precio' | 'activo'>;
export type ServiceCreateInput = Omit<ServiceFormData, 'activo'> & { activo?: boolean };
export type ServiceUpdateInput = Partial<ServiceFormData>;

// Filter types
export interface ServiceFilters {
  search?: string;
  category?: string;
  status?: string;
}

// Stats types
export interface ServiceStats {
  total: number;
  active: number;
  inactive: number;
}

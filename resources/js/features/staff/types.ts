// Basic types (no dependencies)
export interface Branch {
  id: number;
  name: string;
}

export interface StaffMember {
  id: number;
  name: string;
  rut: string;
  role: 'secretaria' | 'conductor' | 'auxiliar' | 'administrador' | 'propietario';
  role_name: string;
  email: string | null;
  phone: string;
  address: string | null;
  hire_date: string;
  base_salary: number;
  bank_account: string | null;
  bank_name: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  vehicle_plate: string | null;
  vehicle_model: string | null;
  is_active: boolean;
  branch: Branch | null;
  notes: string | null;
  created_at: string;
  updated_at?: string;
}

// Form data types
export interface StaffFormData {
  name: string;
  rut: string;
  role: string;
  email: string;
  phone: string;
  address: string;
  hire_date: string;
  base_salary: number | string;
  bank_account: string;
  bank_name: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  vehicle_plate: string;
  vehicle_model: string;
  is_active: boolean;
  branch_id: string;
  notes: string;
}

// Filter types
export interface StaffFilters {
  search?: string;
  role?: string;
  status?: string;
  branch?: string;
}

// Stats types
export interface StaffStats {
  total: number;
  active: number;
  inactive: number;
  by_role: {
    secretaria: number;
    conductor: number;
    auxiliar: number;
    administrador: number;
    propietario: number;
  };
}

// Role options
export interface RoleOption {
  value: string;
  label: string;
  labelKey: string;
}

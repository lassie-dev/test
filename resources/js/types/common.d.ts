// Pagination types
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedData<T> {
  data: T[];
  links: PaginationLink[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

// Common form error type
export interface FormErrors {
  [key: string]: string;
}

// Common API response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  errors?: FormErrors;
}

// Inertia page props wrapper
export interface InertiaPageProps<T = Record<string, any>> {
  props: T;
  url: string;
  component: string;
}

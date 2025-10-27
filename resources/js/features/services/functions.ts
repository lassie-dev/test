import type { Service, ServiceStats, ServiceFilters } from './types';
import { SERVICE_STATUS_VARIANTS } from './constants';

/**
 * Formats currency to Chilean Peso (CLP)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Gets the badge variant for a service status
 */
export function getServiceStatusVariant(isActive: boolean): string {
  return isActive ? SERVICE_STATUS_VARIANTS.active : SERVICE_STATUS_VARIANTS.inactive;
}

/**
 * Calculates service statistics
 */
export function calculateServiceStats(services: Service[]): ServiceStats {
  const active = services.filter(s => s.activo).length;
  const inactive = services.filter(s => !s.activo).length;

  return {
    total: services.length,
    active,
    inactive,
  };
}

/**
 * Filters services based on search query and active status
 */
export function filterServices(
  services: Service[],
  filters: ServiceFilters
): Service[] {
  let filtered = [...services];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      s =>
        s.nombre.toLowerCase().includes(searchLower) ||
        s.descripcion?.toLowerCase().includes(searchLower)
    );
  }

  if (filters.active && filters.active !== 'all') {
    const isActive = filters.active === 'true';
    filtered = filtered.filter(s => s.activo === isActive);
  }

  return filtered;
}

/**
 * Validates service form data
 */
export function validateServicePrice(price: string): boolean {
  const numericPrice = Number(price);
  return !isNaN(numericPrice) && numericPrice > 0;
}

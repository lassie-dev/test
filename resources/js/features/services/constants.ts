// Service status options
export const SERVICE_STATUS_OPTIONS = [
  { value: 'all', labelKey: 'services.allStatuses' },
  { value: 'true', labelKey: 'services.active' },
  { value: 'false', labelKey: 'services.inactive' },
] as const;

// Default form values
export const DEFAULT_SERVICE_VALUES = {
  name: '',
  description: '',
  price: '',
  active: true,
} as const;

// Badge variants
export const SERVICE_STATUS_VARIANTS = {
  active: 'success',
  inactive: 'secondary',
} as const;

// Category options (if needed in the future)
export const SERVICE_CATEGORIES = [] as const;

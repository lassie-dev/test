import {
  FileSignature,
  Wallet,
  Archive,
  Calendar,
  TrendingUp,
  Heart,
} from 'lucide-react';
import type { StatCard, StatusBadgeMap } from './types';

// ============================================================================
// Branch Selector Constants
// ============================================================================

export const ALL_BRANCHES_VALUE = '0';

// ============================================================================
// Status Badge Configuration
// ============================================================================

export const STATUS_BADGES: StatusBadgeMap = {
  pending: {
    label: 'Pendiente',
    className: 'bg-amber-100 text-amber-800',
  },
  active: {
    label: 'Activo',
    className: 'bg-blue-100 text-blue-800',
  },
  completed: {
    label: 'Completado',
    className: 'bg-green-100 text-green-800',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-gray-100 text-gray-800',
  },
};

export const DEFAULT_STATUS_BADGE = {
  label: '',
  className: 'bg-gray-100 text-gray-800',
};

// ============================================================================
// Stat Cards Configuration
// ============================================================================

export const STAT_CARDS_CONFIG: Omit<StatCard, 'value'>[] = [
  {
    title: 'Servicios Activos',
    icon: Calendar,
    description: 'En proceso esta semana',
    color: 'text-text-accent',
    bgColor: 'bg-primary-50',
    href: '/contracts?status=active',
  },
  {
    title: 'Familias Atendidas',
    icon: Heart,
    description: 'Este mes',
    color: 'text-text-accent',
    bgColor: 'bg-primary-50',
    href: '/contracts',
  },
  {
    title: 'Arreglos Pendientes',
    icon: FileSignature,
    description: 'Requieren atención',
    color: 'text-warning',
    bgColor: 'bg-amber-50',
    href: '/contracts?status=pending',
  },
  {
    title: 'Pagos Pendientes',
    icon: Wallet,
    description: 'Por cobrar',
    color: 'text-error',
    bgColor: 'bg-red-50',
    href: '/payments',
  },
  {
    title: 'Ingresos del Mes',
    icon: TrendingUp,
    description: 'Total facturado',
    color: 'text-text-secondary',
    bgColor: 'bg-green-50',
    href: '/reports',
  },
  {
    title: 'Alertas de Inventario',
    icon: Archive,
    description: 'Stock bajo',
    color: 'text-warning',
    bgColor: 'bg-amber-50',
    href: '/inventory',
  },
];

// ============================================================================
// Quick Actions Configuration
// ============================================================================

export const QUICK_ACTIONS = [
  {
    title: 'Nuevo Contrato',
    description: 'Registrar servicio',
    icon: FileSignature,
    iconColor: 'text-text-accent',
    iconBg: 'bg-primary-100',
    href: '/contracts/create',
  },
  {
    title: 'Registrar Pago',
    description: 'Procesar cobro',
    icon: Wallet,
    iconColor: 'text-green-700',
    iconBg: 'bg-green-100',
    href: '/payments',
  },
  {
    title: 'Ver Inventario',
    description: 'Stock disponible',
    icon: Archive,
    iconColor: 'text-amber-700',
    iconBg: 'bg-amber-100',
    href: '/inventory',
  },
  {
    title: 'Ver Reportes',
    description: 'Análisis y métricas',
    icon: TrendingUp,
    iconColor: 'text-blue-700',
    iconBg: 'bg-blue-100',
    href: '/reports',
  },
];

// ============================================================================
// Display Limits
// ============================================================================

export const MAX_RECENT_CONTRACTS = 5;
export const MAX_UPCOMING_SERVICES = 5;

// ============================================================================
// Date Format Configuration
// ============================================================================

export const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
};

export const LOCALE = 'es-CL';

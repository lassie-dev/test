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
    label: 'dashboard.pending',
    className: 'bg-amber-100 text-amber-800',
  },
  active: {
    label: 'dashboard.active',
    className: 'bg-blue-100 text-blue-800',
  },
  completed: {
    label: 'dashboard.completed',
    className: 'bg-green-100 text-green-800',
  },
  cancelled: {
    label: 'dashboard.canceled',
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
    title: 'dashboard.activeServices',
    icon: Calendar,
    description: 'dashboard.inProcessThisWeek',
    color: 'text-text-accent',
    bgColor: 'bg-primary-50',
    href: '/contracts?status=active',
  },
  {
    title: 'dashboard.familiesServed',
    icon: Heart,
    description: 'dashboard.thisMonth',
    color: 'text-text-accent',
    bgColor: 'bg-primary-50',
    href: '/contracts',
  },
  {
    title: 'dashboard.pendingArrangements',
    icon: FileSignature,
    description: 'dashboard.requireAttention',
    color: 'text-warning',
    bgColor: 'bg-amber-50',
    href: '/contracts?status=pending',
  },
  {
    title: 'dashboard.pendingPayments',
    icon: Wallet,
    description: 'dashboard.toCollect',
    color: 'text-error',
    bgColor: 'bg-red-50',
    href: '/payments',
  },
  {
    title: 'dashboard.monthlyRevenue',
    icon: TrendingUp,
    description: 'dashboard.totalBilled',
    color: 'text-text-secondary',
    bgColor: 'bg-green-50',
    href: '/reports',
  },
  {
    title: 'dashboard.inventoryAlerts',
    icon: Archive,
    description: 'dashboard.lowStock',
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
    title: 'dashboard.newContract',
    description: 'dashboard.registerService',
    icon: FileSignature,
    iconColor: 'text-text-accent',
    iconBg: 'bg-primary-100',
    href: '/contracts/create',
  },
  {
    title: 'dashboard.registerPayment',
    description: 'dashboard.processPayment',
    icon: Wallet,
    iconColor: 'text-green-700',
    iconBg: 'bg-green-100',
    href: '/payments',
  },
  {
    title: 'dashboard.viewInventory',
    description: 'dashboard.availableStock',
    icon: Archive,
    iconColor: 'text-amber-700',
    iconBg: 'bg-amber-100',
    href: '/inventory',
  },
  {
    title: 'dashboard.viewReports',
    description: 'dashboard.analysisMetrics',
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

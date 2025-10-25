import { router } from '@inertiajs/react';
import type { DashboardStats, StatCard, StatusBadge, ContractStatus } from './types';
import {
  STATUS_BADGES,
  DEFAULT_STATUS_BADGE,
  STAT_CARDS_CONFIG,
  DATE_FORMAT_OPTIONS,
  LOCALE,
  ALL_BRANCHES_VALUE,
} from './constants';

// ============================================================================
// Branch Handling Functions
// ============================================================================

/**
 * Handles branch selection change in the dashboard
 * @param value - The selected branch ID as string ('0' for all branches)
 */
export function handleBranchChange(value: string): void {
  const branchId = value === '' || value === ALL_BRANCHES_VALUE ? 0 : parseInt(value, 10);

  router.get(
    '/dashboard',
    { branch_id: branchId },
    {
      preserveState: true,
      preserveScroll: true,
    }
  );
}

// ============================================================================
// Status Badge Functions
// ============================================================================

/**
 * Gets the status badge configuration for a given status
 * @param status - The contract status
 * @returns StatusBadge configuration with label and className
 */
export function getStatusBadge(status: string): StatusBadge {
  return STATUS_BADGES[status as ContractStatus] || {
    ...DEFAULT_STATUS_BADGE,
    label: status,
  };
}

// ============================================================================
// Date Formatting Functions
// ============================================================================

/**
 * Formats a date string to Chilean locale format
 * @param date - ISO date string
 * @returns Formatted date string (e.g., "15 ene 2024")
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString(LOCALE, DATE_FORMAT_OPTIONS);
}

// ============================================================================
// Currency Formatting Functions
// ============================================================================

/**
 * Formats a number as Chilean currency
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "$1.234.567")
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString(LOCALE)}`;
}

// ============================================================================
// Stat Card Data Functions
// ============================================================================

/**
 * Generates stat card data from dashboard stats
 * @param stats - Dashboard statistics
 * @returns Array of StatCard objects with populated values
 */
export function generateStatCards(stats: DashboardStats): StatCard[] {
  return [
    {
      ...STAT_CARDS_CONFIG[0],
      value: stats.active_services || 0,
    },
    {
      ...STAT_CARDS_CONFIG[1],
      value: stats.families_served || stats.contracts_month || 0,
    },
    {
      ...STAT_CARDS_CONFIG[2],
      value: stats.pending_arrangements || 0,
    },
    {
      ...STAT_CARDS_CONFIG[3],
      value: stats.pending_payments || 0,
    },
    {
      ...STAT_CARDS_CONFIG[4],
      value: formatCurrency(stats.revenue_month || 0),
    },
    {
      ...STAT_CARDS_CONFIG[5],
      value: stats.inventory_low || 0,
    },
  ];
}

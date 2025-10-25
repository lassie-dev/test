import type { LucideIcon } from 'lucide-react';

// ============================================================================
// Basic Types
// ============================================================================

export type ContractStatus = 'pending' | 'active' | 'completed' | 'cancelled';

// ============================================================================
// Core Entity Types
// ============================================================================

export interface Branch {
  id: number;
  name: string;
  code: string;
  city: string | null;
}

export interface Contract {
  id: number;
  contract_number: string;
  deceased_name: string;
  family_contact: string;
  status: string;
  service_date: string | null;
  created_at: string;
  total: number;
}

// ============================================================================
// Dashboard Stats Types
// ============================================================================

export interface DashboardStats {
  contracts_month: number;
  revenue_month: number;
  inventory_low: number;
  pending_payments: number;
  active_services: number;
  families_served: number;
  pending_arrangements: number;
}

// ============================================================================
// Chart Data Types
// ============================================================================

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  previous_revenue: number;
}

export interface ContractStatusData {
  status: string;
  current_month: number;
  previous_month: number;
  label: string;
  color: string;
}

export interface ServicesTimelineData {
  date: string;
  scheduled: number;
  completed: number;
}

export interface PaymentStatusData {
  status: string;
  value: number;
  label: string;
  color: string;
}

export interface BranchPerformanceData {
  branch_name: string;
  revenue: number;
  contracts: number;
  services: number;
}

export interface ChartsData {
  revenue_trends: RevenueDataPoint[];
  contract_status: ContractStatusData[];
  services_timeline: ServicesTimelineData[];
  payment_status: PaymentStatusData[];
  branch_performance: BranchPerformanceData[];
}

// ============================================================================
// UI Component Types
// ============================================================================

export interface StatCard {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description: string;
  color: string;
  bgColor: string;
  href: string;
}

export interface StatusBadge {
  label: string;
  className: string;
}

// ============================================================================
// Page Props Types
// ============================================================================

export interface DashboardProps {
  stats: DashboardStats;
  recent_contracts: Contract[];
  upcoming_services: Contract[];
  branches: Branch[];
  current_branch: Branch | null;
  is_admin: boolean;
}

// ============================================================================
// Utility Types
// ============================================================================

export type StatusBadgeMap = Record<ContractStatus, StatusBadge>;

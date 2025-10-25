import { z } from 'zod';

// ============================================================================
// Branch Selector Schema
// ============================================================================

export const branchSelectorSchema = z.object({
  branch_id: z.union([z.number(), z.literal(0)]),
});

export type BranchSelectorData = z.infer<typeof branchSelectorSchema>;

// ============================================================================
// Dashboard Filter Schema
// ============================================================================

export const dashboardFilterSchema = z.object({
  branch_id: z.number().optional(),
  date_from: z.string().optional(),
  date_to: z.string().optional(),
});

export type DashboardFilterData = z.infer<typeof dashboardFilterSchema>;

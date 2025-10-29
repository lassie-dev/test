<?php

namespace App\Services;

use App\Models\Contract;
use App\Models\Payroll;
use App\Models\Staff;
use App\Models\User;
use Carbon\Carbon;

class PayrollService
{
    /**
     * Chilean tax brackets for 2025 (Impuesto Único de Segunda Categoría)
     * Values in UTA (Unidad Tributaria Anual)
     */
    const TAX_BRACKETS = [
        ['min' => 0, 'max' => 13.5, 'rate' => 0.00, 'deduction' => 0],
        ['min' => 13.5, 'max' => 30, 'rate' => 0.04, 'deduction' => 0.54],
        ['min' => 30, 'max' => 50, 'rate' => 0.08, 'deduction' => 1.74],
        ['min' => 50, 'max' => 70, 'rate' => 0.135, 'deduction' => 4.49],
        ['min' => 70, 'max' => 90, 'rate' => 0.23, 'deduction' => 11.14],
        ['min' => 90, 'max' => 120, 'rate' => 0.304, 'deduction' => 17.80],
        ['min' => 120, 'max' => 310, 'rate' => 0.35, 'deduction' => 23.32],
        ['min' => 310, 'max' => PHP_FLOAT_MAX, 'rate' => 0.40, 'deduction' => 38.82],
    ];

    /**
     * Chilean AFP (pension) contribution rate
     */
    const AFP_RATE = 0.1000; // 10%

    /**
     * Chilean Isapre/Fonasa (health) minimum contribution rate
     */
    const HEALTH_RATE = 0.0700; // 7%

    /**
     * UTA value for 2025 (approximate, update annually)
     */
    const UTA_VALUE = 726984; // CLP

    /**
     * Per-service bonus amounts
     */
    const DRIVER_SERVICE_BONUS = 15000; // CLP per service
    const ASSISTANT_SERVICE_BONUS = 15000; // CLP per service
    const NIGHT_SERVICE_BONUS = 5000; // CLP per night service

    /**
     * Generate payroll for all active staff for a specific period
     *
     * @param string $period Format: YYYY-MM
     * @return array
     */
    public function generateMonthlyPayroll(string $period): array
    {
        $periodDate = Carbon::createFromFormat('Y-m', $period);
        $periodStart = $periodDate->startOfMonth()->copy();
        $periodEnd = $periodDate->endOfMonth()->copy();

        $results = [
            'success' => [],
            'errors' => [],
            'summary' => [
                'total_processed' => 0,
                'total_gross' => 0,
                'total_net' => 0,
                'total_deductions' => 0,
            ],
        ];

        // Get all active staff
        $staffMembers = Staff::active()->get();

        foreach ($staffMembers as $staff) {
            try {
                // Check if payroll already exists for this period
                $existingPayroll = Payroll::where('user_id', $staff->id)
                    ->where('period', $period)
                    ->first();

                if ($existingPayroll) {
                    $results['errors'][] = [
                        'staff' => $staff->name,
                        'message' => 'Payroll already exists for this period',
                    ];
                    continue;
                }

                // Generate payroll for this staff member
                $payrollData = $this->calculatePayrollForStaff($staff, $periodStart, $periodEnd, $period);

                $payroll = Payroll::create($payrollData);

                $results['success'][] = [
                    'staff' => $staff->name,
                    'payroll_id' => $payroll->id,
                    'net_salary' => $payroll->net_salary,
                ];

                $results['summary']['total_processed']++;
                $results['summary']['total_gross'] += $payroll->gross_salary;
                $results['summary']['total_net'] += $payroll->net_salary;
                $results['summary']['total_deductions'] += $payroll->total_deductions;

            } catch (\Exception $e) {
                $results['errors'][] = [
                    'staff' => $staff->name,
                    'message' => $e->getMessage(),
                ];
            }
        }

        return $results;
    }

    /**
     * Calculate payroll for a specific staff member
     *
     * @param Staff $staff
     * @param Carbon $periodStart
     * @param Carbon $periodEnd
     * @param string $period
     * @return array
     */
    public function calculatePayrollForStaff(Staff $staff, Carbon $periodStart, Carbon $periodEnd, string $period): array
    {
        // Base salary
        $baseSalary = $staff->base_salary ?? 0;

        // Calculate commissions (for secretaries)
        $commissionsTotal = 0;
        if ($staff->isSecretary()) {
            $commissionsTotal = $this->calculateCommissions($staff, $periodStart, $periodEnd);
        }

        // Calculate bonuses (for drivers and assistants)
        $bonuses = 0;
        if ($staff->isDriver()) {
            $bonuses = $this->calculateDriverBonuses($staff, $periodStart, $periodEnd);
        } elseif ($staff->isAssistant()) {
            $bonuses = $this->calculateAssistantBonuses($staff, $periodStart, $periodEnd);
        }

        // Overtime (placeholder - to be implemented with timesheet system)
        $overtime = 0;

        // Gross salary
        $grossSalary = $baseSalary + $commissionsTotal + $bonuses + $overtime;

        // Calculate deductions
        $afpDeduction = $this->calculateAFP($grossSalary);
        $healthDeduction = $this->calculateHealth($grossSalary);
        $taxDeduction = $this->calculateIncomeTax($grossSalary, $afpDeduction);
        $otherDeductions = 0;

        $totalDeductions = $afpDeduction + $healthDeduction + $taxDeduction + $otherDeductions;

        // Net salary
        $netSalary = $grossSalary - $totalDeductions;

        return [
            'user_id' => $staff->id,
            'branch_id' => $staff->branch_id,
            'period' => $period,
            'period_start' => $periodStart,
            'period_end' => $periodEnd,
            'base_salary' => $baseSalary,
            'commissions_total' => $commissionsTotal,
            'bonuses' => $bonuses,
            'overtime' => $overtime,
            'gross_salary' => $grossSalary,
            'health_deduction' => $healthDeduction,
            'pension_deduction' => $afpDeduction,
            'tax_deduction' => $taxDeduction,
            'other_deductions' => $otherDeductions,
            'total_deductions' => $totalDeductions,
            'net_salary' => $netSalary,
            'status' => 'draft',
            'payment_date' => null,
            'notes' => "Payroll generated automatically for period {$period}",
        ];
    }

    /**
     * Calculate commissions for secretaries
     *
     * @param Staff $staff
     * @param Carbon $periodStart
     * @param Carbon $periodEnd
     * @return float
     */
    private function calculateCommissions(Staff $staff, Carbon $periodStart, Carbon $periodEnd): float
    {
        // Get all completed contracts created by this secretary during the period
        $contracts = Contract::where('user_id', $staff->id)
            ->where('status', 'finalizado')
            ->whereBetween('created_at', [$periodStart, $periodEnd])
            ->get();

        $totalCommissions = 0;

        foreach ($contracts as $contract) {
            $totalCommissions += $contract->commission_amount ?? 0;
        }

        return $totalCommissions;
    }

    /**
     * Calculate bonuses for drivers
     *
     * @param Staff $staff
     * @param Carbon $periodStart
     * @param Carbon $periodEnd
     * @return float
     */
    private function calculateDriverBonuses(Staff $staff, Carbon $periodStart, Carbon $periodEnd): float
    {
        // Get all contracts assigned to this driver during the period
        $contracts = Contract::where('assigned_driver_id', $staff->id)
            ->where('status', 'finalizado')
            ->whereBetween('service_datetime', [$periodStart, $periodEnd])
            ->get();

        $totalBonuses = 0;

        foreach ($contracts as $contract) {
            // Per-service bonus
            $totalBonuses += self::DRIVER_SERVICE_BONUS;

            // Night shift bonus
            if ($contract->is_night_shift) {
                $totalBonuses += self::NIGHT_SERVICE_BONUS;
            }
        }

        return $totalBonuses;
    }

    /**
     * Calculate bonuses for assistants
     *
     * @param Staff $staff
     * @param Carbon $periodStart
     * @param Carbon $periodEnd
     * @return float
     */
    private function calculateAssistantBonuses(Staff $staff, Carbon $periodStart, Carbon $periodEnd): float
    {
        // Get all contracts assigned to this assistant during the period
        $contracts = Contract::where('assigned_assistant_id', $staff->id)
            ->where('status', 'finalizado')
            ->whereBetween('service_datetime', [$periodStart, $periodEnd])
            ->get();

        $totalBonuses = 0;

        foreach ($contracts as $contract) {
            // Per-service bonus
            $totalBonuses += self::ASSISTANT_SERVICE_BONUS;

            // Night shift bonus
            if ($contract->is_night_shift) {
                $totalBonuses += self::NIGHT_SERVICE_BONUS;
            }
        }

        return $totalBonuses;
    }

    /**
     * Calculate AFP (pension) deduction
     *
     * @param float $grossSalary
     * @return float
     */
    private function calculateAFP(float $grossSalary): float
    {
        return round($grossSalary * self::AFP_RATE, 0);
    }

    /**
     * Calculate Health Insurance (Isapre/Fonasa) deduction
     *
     * @param float $grossSalary
     * @return float
     */
    private function calculateHealth(float $grossSalary): float
    {
        return round($grossSalary * self::HEALTH_RATE, 0);
    }

    /**
     * Calculate Chilean income tax (Impuesto Único de Segunda Categoría)
     *
     * @param float $grossSalary
     * @param float $afpDeduction
     * @return float
     */
    private function calculateIncomeTax(float $grossSalary, float $afpDeduction): float
    {
        // Taxable base = gross salary - AFP deduction
        $taxableIncome = $grossSalary - $afpDeduction;

        // Convert to UTA
        $incomeInUTA = $taxableIncome / self::UTA_VALUE;

        // Find applicable tax bracket
        $tax = 0;
        foreach (self::TAX_BRACKETS as $bracket) {
            if ($incomeInUTA > $bracket['min'] && $incomeInUTA <= $bracket['max']) {
                // Tax = (Income in UTA × Rate) - Deduction
                $tax = ($incomeInUTA * $bracket['rate']) - $bracket['deduction'];
                $tax = $tax * self::UTA_VALUE; // Convert back to CLP
                break;
            }
        }

        return round(max(0, $tax), 0);
    }

    /**
     * Approve a payroll record
     *
     * @param Payroll $payroll
     * @return bool
     */
    public function approvePayroll(Payroll $payroll): bool
    {
        if ($payroll->status !== 'draft') {
            return false;
        }

        $payroll->status = 'approved';
        return $payroll->save();
    }

    /**
     * Mark payroll as paid
     *
     * @param Payroll $payroll
     * @param Carbon|null $paymentDate
     * @return bool
     */
    public function markAsPaid(Payroll $payroll, Carbon $paymentDate = null): bool
    {
        if ($payroll->status !== 'approved') {
            return false;
        }

        $payroll->status = 'paid';
        $payroll->payment_date = $paymentDate ?? Carbon::now();
        return $payroll->save();
    }

    /**
     * Get payroll summary for a period
     *
     * @param string $period
     * @return array
     */
    public function getPayrollSummary(string $period): array
    {
        $payrolls = Payroll::where('period', $period)->get();

        return [
            'period' => $period,
            'total_count' => $payrolls->count(),
            'total_base_salary' => $payrolls->sum('base_salary'),
            'total_commissions' => $payrolls->sum('commissions_total'),
            'total_bonuses' => $payrolls->sum('bonuses'),
            'total_overtime' => $payrolls->sum('overtime'),
            'total_gross_salary' => $payrolls->sum('gross_salary'),
            'total_deductions' => $payrolls->sum('total_deductions'),
            'total_net_salary' => $payrolls->sum('net_salary'),
            'by_status' => [
                'draft' => $payrolls->where('status', 'draft')->count(),
                'approved' => $payrolls->where('status', 'approved')->count(),
                'paid' => $payrolls->where('status', 'paid')->count(),
            ],
        ];
    }

    /**
     * Recalculate an existing payroll
     *
     * @param Payroll $payroll
     * @return Payroll
     */
    public function recalculatePayroll(Payroll $payroll): Payroll
    {
        if ($payroll->status === 'paid') {
            throw new \Exception('Cannot recalculate a paid payroll');
        }

        $staff = Staff::find($payroll->user_id);
        if (!$staff) {
            throw new \Exception('Staff member not found');
        }

        $periodStart = Carbon::parse($payroll->period_start);
        $periodEnd = Carbon::parse($payroll->period_end);

        $newData = $this->calculatePayrollForStaff($staff, $periodStart, $periodEnd, $payroll->period);

        // Keep the original status and notes
        $newData['status'] = $payroll->status;
        $newData['notes'] = $payroll->notes . "\nRecalculated on " . Carbon::now()->format('Y-m-d H:i:s');

        $payroll->update($newData);

        return $payroll->fresh();
    }
}

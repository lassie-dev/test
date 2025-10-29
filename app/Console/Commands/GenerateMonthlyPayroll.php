<?php

namespace App\Console\Commands;

use App\Services\PayrollService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class GenerateMonthlyPayroll extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'payroll:generate
                            {period? : The period in YYYY-MM format (default: previous month)}
                            {--force : Force generation even if payroll exists}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate monthly payroll for all active staff members with Chilean tax calculations';

    protected $payrollService;

    /**
     * Create a new command instance.
     */
    public function __construct(PayrollService $payrollService)
    {
        parent::__construct();
        $this->payrollService = $payrollService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Determine period (default to previous month)
        $period = $this->argument('period') ?? Carbon::now()->subMonth()->format('Y-m');

        // Validate period format
        if (!preg_match('/^\d{4}-\d{2}$/', $period)) {
            $this->error('Invalid period format. Use YYYY-MM (e.g., 2025-10)');
            return 1;
        }

        $this->info("Generating payroll for period: {$period}");
        $this->newLine();

        try {
            // Generate payroll
            $results = $this->payrollService->generateMonthlyPayroll($period);

            // Display results
            $this->info('✓ Payroll generation completed');
            $this->newLine();

            // Success table
            if (!empty($results['success'])) {
                $this->info('Successfully generated payroll for:');
                $this->table(
                    ['Staff Member', 'Payroll ID', 'Net Salary'],
                    array_map(function ($item) {
                        return [
                            $item['staff'],
                            $item['payroll_id'],
                            '$' . number_format($item['net_salary'], 0, ',', '.'),
                        ];
                    }, $results['success'])
                );
                $this->newLine();
            }

            // Error table
            if (!empty($results['errors'])) {
                $this->warn('Errors encountered:');
                $this->table(
                    ['Staff Member', 'Error Message'],
                    array_map(function ($item) {
                        return [
                            $item['staff'],
                            $item['message'],
                        ];
                    }, $results['errors'])
                );
                $this->newLine();
            }

            // Summary
            $this->info('Summary:');
            $this->line("Total processed: {$results['summary']['total_processed']}");
            $this->line('Total gross salary: $' . number_format($results['summary']['total_gross'], 0, ',', '.'));
            $this->line('Total deductions: $' . number_format($results['summary']['total_deductions'], 0, ',', '.'));
            $this->line('Total net salary: $' . number_format($results['summary']['total_net'], 0, ',', '.'));

            return 0;

        } catch (\Exception $e) {
            $this->error('Failed to generate payroll: ' . $e->getMessage());
            return 1;
        }
    }
}

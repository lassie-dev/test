<?php

namespace App\Http\Controllers;

use App\Models\Payroll;
use App\Models\Contract;
use App\Models\Staff;
use App\Services\PayrollService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PayrollController extends Controller
{
    protected $payrollService;

    public function __construct(PayrollService $payrollService)
    {
        $this->payrollService = $payrollService;
    }

    public function index(Request $request)
    {
        $query = Payroll::with(['user', 'branch']);

        if ($request->filled('period')) {
            $query->where('period', $request->period);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $payrolls = $query->orderBy('period', 'desc')
            ->paginate(20)
            ->withQueryString();

        $stats = [
            'draftCount' => Payroll::where('status', 'draft')->count(),
            'approvedCount' => Payroll::where('status', 'approved')->count(),
            'totalPaid' => Payroll::where('status', 'paid')
                ->whereMonth('payment_date', now()->month)
                ->sum('net_salary'),
        ];

        return Inertia::render('features/payroll/pages/Index', [
            'payrolls' => $payrolls,
            'filters' => $request->only(['period', 'status']),
            'stats' => $stats,
        ]);
    }

    public function create()
    {
        $staff = Staff::active()->get(['id', 'name', 'role', 'base_salary']);

        return Inertia::render('features/payroll/pages/Create', [
            'staff' => $staff,
        ]);
    }

    public function show(Payroll $payroll)
    {
        $payroll->load(['user', 'branch']);

        // Get commission breakdown for this period
        $commissions = Contract::where('user_id', $payroll->user_id)
            ->where('status', 'finalizado')
            ->whereBetween('created_at', [$payroll->period_start, $payroll->period_end])
            ->get()
            ->map(function ($contract) {
                return [
                    'contract_number' => $contract->contract_number,
                    'commission' => $contract->commission_amount,
                    'date' => $contract->created_at->format('Y-m-d'),
                ];
            });

        // Get service bonuses for drivers/assistants
        $staff = Staff::find($payroll->user_id);
        $bonusDetails = [];

        if ($staff && $staff->isDriver()) {
            $services = Contract::where('assigned_driver_id', $staff->id)
                ->where('status', 'finalizado')
                ->whereBetween('service_datetime', [$payroll->period_start, $payroll->period_end])
                ->get()
                ->map(function ($contract) {
                    return [
                        'contract_number' => $contract->contract_number,
                        'service_date' => $contract->service_datetime->format('Y-m-d'),
                        'service_bonus' => 15000,
                        'night_bonus' => $contract->is_night_shift ? 5000 : 0,
                        'total_bonus' => 15000 + ($contract->is_night_shift ? 5000 : 0),
                    ];
                });
            $bonusDetails = $services;
        } elseif ($staff && $staff->isAssistant()) {
            $services = Contract::where('assigned_assistant_id', $staff->id)
                ->where('status', 'finalizado')
                ->whereBetween('service_datetime', [$payroll->period_start, $payroll->period_end])
                ->get()
                ->map(function ($contract) {
                    return [
                        'contract_number' => $contract->contract_number,
                        'service_date' => $contract->service_datetime->format('Y-m-d'),
                        'service_bonus' => 15000,
                        'night_bonus' => $contract->is_night_shift ? 5000 : 0,
                        'total_bonus' => 15000 + ($contract->is_night_shift ? 5000 : 0),
                    ];
                });
            $bonusDetails = $services;
        }

        return Inertia::render('features/payroll/pages/Show', [
            'payroll' => $payroll,
            'commissions' => $commissions,
            'bonusDetails' => $bonusDetails,
        ]);
    }

    /**
     * Generate monthly payroll for all staff
     */
    public function generate(Request $request)
    {
        $request->validate([
            'period' => 'required|date_format:Y-m',
        ]);

        try {
            $results = $this->payrollService->generateMonthlyPayroll($request->period);

            return redirect()->route('payroll.index', ['period' => $request->period])
                ->with('success', "Payroll generated: {$results['summary']['total_processed']} records created");
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to generate payroll: ' . $e->getMessage());
        }
    }

    /**
     * Approve a payroll record
     */
    public function approve(Payroll $payroll)
    {
        try {
            if ($this->payrollService->approvePayroll($payroll)) {
                return back()->with('success', 'Payroll approved successfully');
            }
            return back()->with('error', 'Cannot approve this payroll');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to approve payroll: ' . $e->getMessage());
        }
    }

    /**
     * Mark payroll as paid
     */
    public function markPaid(Request $request, Payroll $payroll)
    {
        $request->validate([
            'payment_date' => 'required|date',
        ]);

        try {
            $paymentDate = Carbon::parse($request->payment_date);
            if ($this->payrollService->markAsPaid($payroll, $paymentDate)) {
                return back()->with('success', 'Payroll marked as paid successfully');
            }
            return back()->with('error', 'Cannot mark this payroll as paid');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to mark payroll as paid: ' . $e->getMessage());
        }
    }

    /**
     * Recalculate a payroll
     */
    public function recalculate(Payroll $payroll)
    {
        try {
            $this->payrollService->recalculatePayroll($payroll);
            return back()->with('success', 'Payroll recalculated successfully');
        } catch (\Exception $e) {
            return back()->with('error', 'Failed to recalculate payroll: ' . $e->getMessage());
        }
    }

    /**
     * Get payroll summary for a period
     */
    public function summary(Request $request)
    {
        $request->validate([
            'period' => 'required|date_format:Y-m',
        ]);

        $summary = $this->payrollService->getPayrollSummary($request->period);

        return response()->json($summary);
    }

    /**
     * Bulk approve payrolls
     */
    public function bulkApprove(Request $request)
    {
        $request->validate([
            'payroll_ids' => 'required|array',
            'payroll_ids.*' => 'exists:payrolls,id',
        ]);

        $successCount = 0;
        $errorCount = 0;

        foreach ($request->payroll_ids as $payrollId) {
            $payroll = Payroll::find($payrollId);
            if ($this->payrollService->approvePayroll($payroll)) {
                $successCount++;
            } else {
                $errorCount++;
            }
        }

        return back()->with('success', "Approved {$successCount} payrolls, {$errorCount} errors");
    }
}

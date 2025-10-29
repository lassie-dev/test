<?php

namespace App\Http\Controllers;

use App\Models\Payroll;
use App\Models\Contract;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PayrollController extends Controller
{
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
        return Inertia::render('features/payroll/pages/Create');
    }

    public function show(Payroll $payroll)
    {
        $payroll->load(['user', 'branch']);

        // Get commission breakdown for this period
        $commissions = Contract::where('user_id', $payroll->user_id)
            ->whereBetween('created_at', [$payroll->period_start, $payroll->period_end])
            ->get()
            ->map(function ($contract) {
                return [
                    'contract_number' => $contract->contract_number,
                    'commission' => $contract->commission_amount,
                    'date' => $contract->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('features/payroll/pages/Show', [
            'payroll' => $payroll,
            'commissions' => $commissions,
        ]);
    }
}

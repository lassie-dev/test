<?php

namespace App\Http\Controllers;

use App\Models\Agreement;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class AgreementController extends Controller
{
    /**
     * Display a listing of agreements.
     */
    public function index(Request $request)
    {
        $query = Agreement::query();

        // Search by company name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('company_name', 'like', "%{$search}%");
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Get expiring soon count for alerts
        $expiringSoonCount = Agreement::expiringSoon()->count();

        $agreements = $query->orderBy('company_name')->paginate(15)->withQueryString();

        return Inertia::render('features/agreements/pages/Index', [
            'agreements' => $agreements,
            'expiring_soon_count' => $expiringSoonCount,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Show the form for creating a new agreement.
     */
    public function create()
    {
        return Inertia::render('features/agreements/pages/Create');
    }

    /**
     * Store a newly created agreement.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:agreements,code|max:50',
            'company_name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:active,expired,suspended',
            'company_pays_percentage' => 'required|numeric|min:0|max:100',
            'employee_pays_percentage' => 'required|numeric|min:0|max:100',
        ]);

        Agreement::create($validated);

        return redirect()->route('agreements.index')
            ->with('success', 'Convenio creado exitosamente.');
    }

    /**
     * Display the specified agreement.
     */
    public function show(Agreement $agreement)
    {
        $agreement->load('contracts.client', 'contracts.deceased');

        // Calculate usage statistics
        $stats = [
            'contracts_count' => $agreement->contracts()->count(),
            'contracts_this_year' => $agreement->contracts()
                ->whereYear('created_at', Carbon::now()->year)
                ->count(),
            'total_revenue' => $agreement->contracts()->sum('total'),
            'revenue_this_year' => $agreement->contracts()
                ->whereYear('created_at', Carbon::now()->year)
                ->sum('total'),
            'company_billed' => $agreement->contracts()->sum('total') * ($agreement->company_pays_percentage / 100),
            'employee_payments' => $agreement->contracts()->sum('total') * ($agreement->employee_pays_percentage / 100),
        ];

        return Inertia::render('features/agreements/pages/Show', [
            'agreement' => $agreement,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for editing the specified agreement.
     */
    public function edit(Agreement $agreement)
    {
        return Inertia::render('features/agreements/pages/Edit', [
            'agreement' => $agreement,
        ]);
    }

    /**
     * Update the specified agreement.
     */
    public function update(Request $request, Agreement $agreement)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:agreements,code,' . $agreement->id,
            'company_name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'contact_phone' => 'required|string|max:20',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'status' => 'required|in:active,expired,suspended',
            'company_pays_percentage' => 'required|numeric|min:0|max:100',
            'employee_pays_percentage' => 'required|numeric|min:0|max:100',
        ]);

        $agreement->update($validated);

        return redirect()->route('agreements.index')
            ->with('success', 'Convenio actualizado exitosamente.');
    }

    /**
     * Remove the specified agreement.
     */
    public function destroy(Agreement $agreement)
    {
        $agreement->delete();

        return redirect()->route('agreements.index')
            ->with('success', 'Convenio eliminado exitosamente.');
    }

    /**
     * Lookup employee by RUT or name to find their agreement
     */
    public function lookup(Request $request)
    {
        $request->validate([
            'query' => 'required|string|min:3',
        ]);

        $query = $request->input('query');

        // Search in agreements by company name
        $agreements = Agreement::active()
            ->where('company_name', 'like', "%{$query}%")
            ->orWhere('code', 'like', "%{$query}%")
            ->with(['contracts' => function ($q) {
                $q->latest()->limit(5);
            }])
            ->limit(10)
            ->get();

        // Also search for specific client in contracts to find their agreement
        $contractsWithAgreements = Agreement::active()
            ->whereHas('contracts.client', function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                    ->orWhere('rut', 'like', "%{$query}%");
            })
            ->with(['contracts' => function ($q) use ($query) {
                $q->whereHas('client', function ($subQ) use ($query) {
                    $subQ->where('name', 'like', "%{$query}%")
                        ->orWhere('rut', 'like', "%{$query}%");
                })->with('client')->latest()->limit(5);
            }])
            ->get();

        $allAgreements = $agreements->merge($contractsWithAgreements)->unique('id');

        return response()->json([
            'agreements' => $allAgreements,
        ]);
    }

    /**
     * Get billing summary for a specific agreement
     */
    public function billingSummary(Request $request, Agreement $agreement)
    {
        $month = $request->input('month', Carbon::now()->format('Y-m'));
        $monthStart = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        $monthEnd = Carbon::createFromFormat('Y-m', $month)->endOfMonth();

        // Get contracts for this agreement in the period
        $contracts = $agreement->contracts()
            ->whereBetween('created_at', [$monthStart, $monthEnd])
            ->with('client', 'deceased')
            ->get();

        $totalValue = $contracts->sum('total');
        $companyPortion = $totalValue * ($agreement->company_pays_percentage / 100);
        $employeePortion = $totalValue * ($agreement->employee_pays_percentage / 100);

        // Get payment status for company portion
        $companyPaid = 0; // TODO: Implement company payment tracking
        $companyPending = $companyPortion - $companyPaid;

        $summary = [
            'period' => $month,
            'agreement' => $agreement,
            'contracts' => $contracts,
            'statistics' => [
                'total_contracts' => $contracts->count(),
                'total_value' => $totalValue,
                'company_portion' => $companyPortion,
                'employee_portion' => $employeePortion,
                'company_paid' => $companyPaid,
                'company_pending' => $companyPending,
            ],
        ];

        return Inertia::render('features/agreements/pages/BillingSummary', $summary);
    }

    /**
     * Get detailed usage report for an agreement
     */
    public function usageReport(Request $request, Agreement $agreement)
    {
        $year = $request->input('year', Carbon::now()->year);
        $yearStart = Carbon::createFromDate($year, 1, 1)->startOfYear();
        $yearEnd = Carbon::createFromDate($year, 12, 31)->endOfYear();

        // Get monthly breakdown
        $monthlyData = [];
        for ($month = 1; $month <= 12; $month++) {
            $monthStart = Carbon::createFromDate($year, $month, 1)->startOfMonth();
            $monthEnd = Carbon::createFromDate($year, $month, 1)->endOfMonth();

            $monthContracts = $agreement->contracts()
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->get();

            $monthlyData[] = [
                'month' => $monthStart->format('M Y'),
                'month_number' => $month,
                'contracts_count' => $monthContracts->count(),
                'total_revenue' => $monthContracts->sum('total'),
                'company_billed' => $monthContracts->sum('total') * ($agreement->company_pays_percentage / 100),
                'employee_payments' => $monthContracts->sum('total') * ($agreement->employee_pays_percentage / 100),
            ];
        }

        // Year totals
        $yearContracts = $agreement->contracts()
            ->whereBetween('created_at', [$yearStart, $yearEnd])
            ->get();

        $report = [
            'agreement' => $agreement,
            'year' => $year,
            'monthly_data' => $monthlyData,
            'year_totals' => [
                'contracts_count' => $yearContracts->count(),
                'total_revenue' => $yearContracts->sum('total'),
                'company_billed' => $yearContracts->sum('total') * ($agreement->company_pays_percentage / 100),
                'employee_payments' => $yearContracts->sum('total') * ($agreement->employee_pays_percentage / 100),
                'average_contract_value' => $yearContracts->count() > 0 ? $yearContracts->avg('total') : 0,
            ],
        ];

        return Inertia::render('features/agreements/pages/UsageReport', $report);
    }
}

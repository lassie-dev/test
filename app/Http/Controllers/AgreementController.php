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
            'contact_email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'covered_employees' => 'required|integer|min:0',
            'status' => 'required|in:active,expired,suspended',
            'discount_percentage' => 'required|numeric|min:0|max:100',
            'company_pays_percentage' => 'required|numeric|min:0|max:100',
            'employee_pays_percentage' => 'required|numeric|min:0|max:100',
            'payment_method' => 'nullable|string',
            'credit_months' => 'required|integer|min:1|max:60',
            'included_services' => 'nullable|string',
            'special_conditions' => 'nullable|string',
            'notes' => 'nullable|string',
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
            'contact_email' => 'nullable|email|max:255',
            'address' => 'nullable|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'covered_employees' => 'required|integer|min:0',
            'status' => 'required|in:active,expired,suspended',
            'discount_percentage' => 'required|numeric|min:0|max:100',
            'company_pays_percentage' => 'required|numeric|min:0|max:100',
            'employee_pays_percentage' => 'required|numeric|min:0|max:100',
            'payment_method' => 'nullable|string',
            'credit_months' => 'required|integer|min:1|max:60',
            'included_services' => 'nullable|string',
            'special_conditions' => 'nullable|string',
            'notes' => 'nullable|string',
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

        $query = $request->query;

        // Search in contracts' clients by name or RUT
        $agreements = Agreement::active()
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

        return response()->json([
            'agreements' => $agreements,
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Contract;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics.
     */
    public function index(Request $request)
    {
        $user = auth()->user();
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();
        $endOfWeek = $now->copy()->endOfWeek();

        // Determine which branch to display
        // Admins can select any branch, regular users see only their branch
        $selectedBranchId = $request->input('branch_id');

        if ($user->isAdmin()) {
            // Admin can view all branches or select specific one
            $branchId = $selectedBranchId ?: $user->branch_id;
        } else {
            // Regular users only see their own branch
            $branchId = $user->branch_id;
        }

        // Get all active branches for admin selector
        $branches = Branch::active()->orderBy('name')->get();
        $currentBranch = $branchId ? Branch::find($branchId) : null;

        // Build query with branch filter
        $contractQuery = function() use ($branchId) {
            return $branchId ? Contract::forBranch($branchId) : Contract::query();
        };

        // Active services (this week)
        $activeServices = $contractQuery()
            ->where('status', 'active')
            ->whereBetween('service_date', [$now, $endOfWeek])
            ->count();

        // Families served this month
        $familiesServed = $contractQuery()->thisMonth()->count();

        // Pending arrangements (contracts without service date)
        $pendingArrangements = $contractQuery()
            ->where(function($query) {
                $query->where('status', 'pending')
                    ->orWhereNull('service_date');
            })
            ->count();

        // Pending payments (mock data - replace when payment module is ready)
        $pendingPayments = 5;

        // Revenue this month
        $revenueThisMonth = $contractQuery()
            ->thisMonth()
            ->where('status', '!=', 'cancelled')
            ->sum('total');

        // Inventory alerts (mock data - replace when inventory module is ready)
        $inventoryLow = 3;

        // Recent contracts (last 10)
        $recentContracts = $contractQuery()
            ->with('deceased', 'client')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($contract) {
                return [
                    'id' => $contract->id,
                    'contract_number' => $contract->contract_number,
                    'deceased_name' => $contract->deceased->full_name ?? 'N/A',
                    'family_contact' => $contract->client->name ?? 'N/A',
                    'status' => $contract->status,
                    'service_date' => $contract->service_date,
                    'created_at' => $contract->created_at->toISOString(),
                    'total' => (float) $contract->total,
                ];
            });

        // Upcoming services (next 30 days with service dates)
        $upcomingServices = $contractQuery()
            ->with('deceased', 'client')
            ->whereNotNull('service_date')
            ->where('service_date', '>=', $now)
            ->where('service_date', '<=', $now->copy()->addDays(30))
            ->orderBy('service_date')
            ->limit(10)
            ->get()
            ->map(function ($contract) {
                return [
                    'id' => $contract->id,
                    'contract_number' => $contract->contract_number,
                    'deceased_name' => $contract->deceased->full_name ?? 'N/A',
                    'family_contact' => $contract->client->name ?? 'N/A',
                    'status' => $contract->status,
                    'service_date' => $contract->service_date,
                    'created_at' => $contract->created_at->toISOString(),
                    'total' => (float) $contract->total,
                ];
            });

        return Inertia::render('Dashboard', [
            'stats' => [
                'active_services' => $activeServices,
                'families_served' => $familiesServed,
                'pending_arrangements' => $pendingArrangements,
                'pending_payments' => $pendingPayments,
                'contracts_month' => $familiesServed,
                'revenue_month' => (float) $revenueThisMonth,
                'inventory_low' => $inventoryLow,
            ],
            'recent_contracts' => $recentContracts,
            'upcoming_services' => $upcomingServices,
            'branches' => $branches,
            'current_branch' => $currentBranch,
            'is_admin' => $user->isAdmin(),
        ]);
    }
}

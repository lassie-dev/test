<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with statistics.
     */
    public function index()
    {
        // Get real stats from database
        $contractsThisMonth = Contract::thisMonth()->count();
        $revenueThisMonth = Contract::thisMonth()
            ->where('status', '!=', 'cancelled')
            ->sum('total');
        
        // For now, use mock data for inventory and payments
        // You can replace these when you create those modules
        $inventoryLow = 3;
        $pendingPayments = 5;

        return Inertia::render('Dashboard', [
            'stats' => [
                'contracts_month' => $contractsThisMonth,
                'revenue_month' => (float) $revenueThisMonth,
                'inventory_low' => $inventoryLow,
                'pending_payments' => $pendingPayments,
            ],
        ]);
    }
}

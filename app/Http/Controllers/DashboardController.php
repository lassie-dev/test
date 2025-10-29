<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Contract;
use App\Models\Payment;
use App\Models\Product;
use App\Models\Notification;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Generate revenue trends data for the last 12 months.
     */
    private function generateRevenueTrendsData($contractQuery, $now)
    {
        $data = [];
        for ($i = 11; $i >= 0; $i--) {
            $monthDate = $now->copy()->subMonths($i);
            $monthStart = $monthDate->copy()->startOfMonth();
            $monthEnd = $monthDate->copy()->endOfMonth();

            $revenue = $contractQuery()
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->where('status', '!=', 'cancelled')
                ->sum('total');

            // Previous year comparison
            $previousYearStart = $monthStart->copy()->subYear();
            $previousYearEnd = $monthEnd->copy()->subYear();
            $previousRevenue = $contractQuery()
                ->whereBetween('created_at', [$previousYearStart, $previousYearEnd])
                ->where('status', '!=', 'cancelled')
                ->sum('total');

            $data[] = [
                'month' => $monthDate->format('M Y'),
                'revenue' => (float) $revenue,
                'previous_revenue' => (float) $previousRevenue,
            ];
        }

        return $data;
    }

    /**
     * Generate contract status distribution data.
     */
    private function generateContractStatusData($contractQuery, $now)
    {
        $currentMonthStart = $now->copy()->startOfMonth();
        $previousMonthStart = $now->copy()->subMonth()->startOfMonth();
        $previousMonthEnd = $now->copy()->subMonth()->endOfMonth();

        $statuses = [
            ['key' => 'quote', 'label' => 'Cotización', 'color' => '#f59e0b'],
            ['key' => 'contract', 'label' => 'Contrato', 'color' => '#3b82f6'],
            ['key' => 'completed', 'label' => 'Completado', 'color' => '#059669'],
            ['key' => 'cancelled', 'label' => 'Cancelado', 'color' => '#dc2626'],
        ];

        $data = [];
        foreach ($statuses as $status) {
            $currentCount = $contractQuery()
                ->where('status', $status['key'])
                ->where('created_at', '>=', $currentMonthStart)
                ->count();

            $previousCount = $contractQuery()
                ->where('status', $status['key'])
                ->whereBetween('created_at', [$previousMonthStart, $previousMonthEnd])
                ->count();

            $data[] = [
                'status' => $status['key'],
                'label' => $status['label'],
                'color' => $status['color'],
                'current_month' => $currentCount,
                'previous_month' => $previousCount,
            ];
        }

        return $data;
    }

    /**
     * Generate services timeline data.
     */
    private function generateServicesTimelineData($contractQuery, $now)
    {
        $data = [];
        $startDate = $now->copy()->subMonths(6);

        for ($date = $startDate; $date <= $now; $date->addDay()) {
            $dateStr = $date->format('Y-m-d');

            $scheduled = $contractQuery()
                ->whereDate('service_date', $dateStr)
                ->count();

            $completed = $contractQuery()
                ->whereDate('service_date', $dateStr)
                ->where('status', 'completed')
                ->count();

            $data[] = [
                'date' => $dateStr,
                'scheduled' => $scheduled,
                'completed' => $completed,
            ];
        }

        return $data;
    }

    /**
     * Generate payment status data.
     */
    private function generatePaymentStatusData($contractQuery, $now)
    {
        // Mock data - replace with actual payment data when payment module is ready
        $totalRevenue = $contractQuery()
            ->where('status', '!=', 'cancelled')
            ->sum('total');

        // Simulate payment distribution
        $paid = $totalRevenue * 0.65;
        $pending = $totalRevenue * 0.25;
        $overdue = $totalRevenue * 0.10;

        return [
            [
                'status' => 'paid',
                'label' => 'Pagado',
                'value' => (float) $paid,
                'color' => '#059669',
            ],
            [
                'status' => 'pending',
                'label' => 'Pendiente',
                'value' => (float) $pending,
                'color' => '#f59e0b',
            ],
            [
                'status' => 'overdue',
                'label' => 'Vencido',
                'value' => (float) $overdue,
                'color' => '#dc2626',
            ],
        ];
    }

    /**
     * Generate branch performance comparison data.
     */
    private function generateBranchPerformanceData($now)
    {
        $branches = Branch::active()->get();
        $data = [];

        foreach ($branches as $branch) {
            $contracts = Contract::forBranch($branch->id)
                ->thisMonth()
                ->count();

            $revenue = Contract::forBranch($branch->id)
                ->thisMonth()
                ->where('status', '!=', 'cancelled')
                ->sum('total');

            $services = Contract::forBranch($branch->id)
                ->whereNotNull('service_date')
                ->whereMonth('service_date', $now->month)
                ->whereYear('service_date', $now->year)
                ->count();

            $data[] = [
                'branch_name' => $branch->name,
                'revenue' => (float) $revenue,
                'contracts' => $contracts,
                'services' => $services,
            ];
        }

        return $data;
    }

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
            // If no branch selected (null or 0), show all branches
            if ($selectedBranchId === null) {
                // First load - show all branches by default
                $branchId = null;
            } elseif ($selectedBranchId == 0 || $selectedBranchId === '') {
                // Explicitly selected "All branches"
                $branchId = null;
            } else {
                // Specific branch selected
                $branchId = (int) $selectedBranchId;
            }
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
            ->where('status', 'contract')
            ->whereBetween('service_date', [$now, $endOfWeek])
            ->count();

        // Families served this month
        $familiesServed = $contractQuery()->thisMonth()->count();

        // Pending arrangements (contracts without service date)
        $pendingArrangements = $contractQuery()
            ->where(function($query) {
                $query->where('status', 'quote')
                    ->orWhereNull('service_date');
            })
            ->count();

        // Real pending payments count
        $pendingPayments = Payment::where('status', 'pending')->count();

        // Real overdue payments count
        $overduePayments = Payment::where('status', 'pending')
            ->where('due_date', '<', now())
            ->count();

        // Revenue this month
        $revenueThisMonth = $contractQuery()
            ->thisMonth()
            ->where('status', '!=', 'cancelled')
            ->sum('total');

        // Real inventory alerts
        $inventoryLow = Product::whereRaw('stock <= min_stock')->where('stock', '>', 0)->count();
        $inventoryOut = Product::where('stock', '<=', 0)->count();

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

        // Alerts and notifications
        $alerts = [];

        // Overdue payments alert
        if ($overduePayments > 0) {
            $alerts[] = [
                'type' => 'error',
                'title' => 'Pagos Vencidos',
                'message' => "{$overduePayments} pago(s) vencido(s) requieren atención inmediata",
                'action' => '/payments?status=overdue',
                'icon' => 'alert-triangle',
            ];
        }

        // Low inventory alert
        if ($inventoryLow > 0) {
            $alerts[] = [
                'type' => 'warning',
                'title' => 'Stock Bajo',
                'message' => "{$inventoryLow} producto(s) con stock bajo",
                'action' => '/inventory?stock_status=low',
                'icon' => 'package',
            ];
        }

        // Out of stock alert
        if ($inventoryOut > 0) {
            $alerts[] = [
                'type' => 'error',
                'title' => 'Sin Stock',
                'message' => "{$inventoryOut} producto(s) sin stock",
                'action' => '/inventory?stock_status=out',
                'icon' => 'alert-circle',
            ];
        }

        // Pending arrangements alert
        if ($pendingArrangements > 0) {
            $alerts[] = [
                'type' => 'info',
                'title' => 'Arreglos Pendientes',
                'message' => "{$pendingArrangements} contrato(s) pendiente(s) de agendar",
                'action' => '/contracts?status=quote',
                'icon' => 'calendar',
            ];
        }

        // Recent notifications summary
        $notificationsSummary = [
            'total_sent_today' => Notification::whereDate('sent_at', $now->toDateString())->count(),
            'pending' => Notification::where('status', 'pending')->count(),
            'failed' => Notification::where('status', 'failed')->count(),
        ];

        // Today's schedule
        $todaysServices = $contractQuery()
            ->with('deceased', 'client', 'assignedDriver', 'assignedAssistant')
            ->whereDate('service_datetime', $now->toDateString())
            ->orderBy('service_datetime')
            ->get()
            ->map(function ($contract) {
                return [
                    'id' => $contract->id,
                    'contract_number' => $contract->contract_number,
                    'deceased_name' => $contract->deceased->name ?? 'N/A',
                    'family_contact' => $contract->client->name ?? 'N/A',
                    'service_time' => $contract->service_datetime ? Carbon::parse($contract->service_datetime)->format('H:i') : null,
                    'service_location' => $contract->service_location,
                    'driver' => $contract->assignedDriver ? $contract->assignedDriver->name : null,
                    'assistant' => $contract->assignedAssistant ? $contract->assignedAssistant->name : null,
                    'status' => $contract->status,
                ];
            });

        // Charts now use frontend mock data
        // Backend chart generation methods kept for future use when real data is needed

        return Inertia::render('features/dashboard/pages/Index', [
            'stats' => [
                'active_services' => $activeServices,
                'families_served' => $familiesServed,
                'pending_arrangements' => $pendingArrangements,
                'pending_payments' => $pendingPayments,
                'overdue_payments' => $overduePayments,
                'contracts_month' => $familiesServed,
                'revenue_month' => (float) $revenueThisMonth,
                'inventory_low' => $inventoryLow,
                'inventory_out' => $inventoryOut,
            ],
            'alerts' => $alerts,
            'notifications_summary' => $notificationsSummary,
            'todays_services' => $todaysServices,
            'recent_contracts' => $recentContracts,
            'upcoming_services' => $upcomingServices,
            'branches' => $branches,
            'current_branch' => $currentBranch,
            'is_admin' => $user->isAdmin(),
        ]);
    }
}

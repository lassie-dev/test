<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Contract;
use App\Models\Payment;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    /**
     * Display the reports page.
     */
    public function index()
    {
        $now = Carbon::now();
        $startOfMonth = $now->copy()->startOfMonth();

        // Quick stats for the current month
        $contractsThisMonth = Contract::whereDate('created_at', '>=', $startOfMonth)->count();

        $revenueThisMonth = Payment::where('status', 'paid')
            ->whereDate('payment_date', '>=', $startOfMonth)
            ->sum('amount');

        // For now, expenses would come from P&L module (not yet implemented)
        $expensesThisMonth = 0;

        $balance = $revenueThisMonth - $expensesThisMonth;

        return Inertia::render('features/reports/pages/Index', [
            'stats' => [
                'contracts_this_month' => $contractsThisMonth,
                'revenue_this_month' => $revenueThisMonth,
                'expenses_this_month' => $expensesThisMonth,
                'balance' => $balance,
            ],
        ]);
    }

    /**
     * Generate Sales Report
     */
    public function sales(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);

        // Daily sales summary
        $dailySales = Contract::selectRaw('DATE(created_at) as date, COUNT(*) as contracts, SUM(total) as revenue')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get();

        // Revenue by contract type
        $revenueByType = Contract::selectRaw('type, COUNT(*) as count, SUM(total) as revenue')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('type')
            ->get();

        // Most popular services
        $popularServices = DB::table('contract_service')
            ->join('contracts', 'contract_service.contract_id', '=', 'contracts.id')
            ->join('services', 'contract_service.service_id', '=', 'services.id')
            ->whereBetween('contracts.created_at', [$startDate, $endDate])
            ->select('services.name', DB::raw('COUNT(*) as count'))
            ->groupBy('services.id', 'services.name')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        // Most popular products
        $popularProducts = DB::table('contract_product')
            ->join('contracts', 'contract_product.contract_id', '=', 'contracts.id')
            ->join('products', 'contract_product.product_id', '=', 'products.id')
            ->whereBetween('contracts.created_at', [$startDate, $endDate])
            ->select('products.name', DB::raw('SUM(contract_product.quantity) as total_quantity'))
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_quantity')
            ->limit(10)
            ->get();

        // Average contract value
        $avgContractValue = Contract::whereBetween('created_at', [$startDate, $endDate])
            ->avg('total');

        return response()->json([
            'period' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
            'daily_sales' => $dailySales,
            'revenue_by_type' => $revenueByType,
            'popular_services' => $popularServices,
            'popular_products' => $popularProducts,
            'avg_contract_value' => $avgContractValue,
            'total_revenue' => $dailySales->sum('revenue'),
            'total_contracts' => $dailySales->sum('contracts'),
        ]);
    }

    /**
     * Generate Staff Report
     */
    public function staff(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);

        // Commission by secretary
        $commissions = Contract::selectRaw('user_id, SUM(commission_amount) as total_commission, COUNT(*) as contracts')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('user_id')
            ->groupBy('user_id')
            ->with('user:id,name')
            ->get()
            ->map(function ($item) {
                return [
                    'secretary_name' => $item->user->name ?? 'N/A',
                    'total_commission' => $item->total_commission ?? 0,
                    'contracts' => $item->contracts,
                    'avg_commission' => $item->contracts > 0 ? ($item->total_commission ?? 0) / $item->contracts : 0,
                ];
            });

        // Services by driver
        $driverServices = Contract::selectRaw('assigned_driver_id, COUNT(*) as services')
            ->whereBetween('service_datetime', [$startDate, $endDate])
            ->whereNotNull('assigned_driver_id')
            ->groupBy('assigned_driver_id')
            ->with('assignedDriver:id,name')
            ->get()
            ->map(function ($item) {
                return [
                    'driver_name' => $item->assignedDriver->name ?? 'N/A',
                    'services' => $item->services,
                ];
            });

        // Services by assistant
        $assistantServices = Contract::selectRaw('assigned_assistant_id, COUNT(*) as services')
            ->whereBetween('service_datetime', [$startDate, $endDate])
            ->whereNotNull('assigned_assistant_id')
            ->groupBy('assigned_assistant_id')
            ->with('assignedAssistant:id,name')
            ->get()
            ->map(function ($item) {
                return [
                    'assistant_name' => $item->assignedAssistant->name ?? 'N/A',
                    'services' => $item->services,
                ];
            });

        return response()->json([
            'period' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
            'commissions' => $commissions,
            'driver_services' => $driverServices,
            'assistant_services' => $assistantServices,
        ]);
    }

    /**
     * Generate Financial Report
     */
    public function financial(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);

        // Payment method distribution
        $paymentMethods = Contract::selectRaw('payment_method, COUNT(*) as count, SUM(total) as revenue')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('payment_method')
            ->groupBy('payment_method')
            ->get();

        // Accounts receivable aging
        $overduePayments = Payment::where('status', 'pending')
            ->where('due_date', '<', Carbon::now())
            ->selectRaw('
                CASE
                    WHEN DATEDIFF(CURDATE(), due_date) <= 30 THEN "0-30 days"
                    WHEN DATEDIFF(CURDATE(), due_date) <= 60 THEN "31-60 days"
                    WHEN DATEDIFF(CURDATE(), due_date) <= 90 THEN "61-90 days"
                    ELSE "90+ days"
                END as aging,
                COUNT(*) as count,
                SUM(amount) as total_amount
            ')
            ->groupBy('aging')
            ->get();

        // Discount analysis
        $discounts = Contract::whereBetween('created_at', [$startDate, $endDate])
            ->where('discount', '>', 0)
            ->selectRaw('
                COUNT(*) as contracts_with_discount,
                AVG(discount) as avg_discount,
                SUM(subtotal * discount / 100) as total_discount_amount
            ')
            ->first();

        // Cash flow (collected vs pending)
        $collected = Payment::where('status', 'paid')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->sum('amount');

        $pending = Payment::where('status', 'pending')
            ->whereBetween('due_date', [$startDate, $endDate])
            ->sum('amount');

        return response()->json([
            'period' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
            'payment_methods' => $paymentMethods,
            'accounts_receivable' => $overduePayments,
            'discount_analysis' => $discounts,
            'cash_flow' => [
                'collected' => $collected,
                'pending' => $pending,
                'total' => $collected + $pending,
            ],
        ]);
    }

    /**
     * Generate Inventory Report
     */
    public function inventory(Request $request)
    {
        // Stock valuation
        $stockValuation = Product::sum(DB::raw('stock * price'));

        // Fast-moving items (sold more than 5 times)
        $fastMoving = DB::table('contract_product')
            ->join('products', 'contract_product.product_id', '=', 'products.id')
            ->select(
                'products.name',
                'products.category',
                DB::raw('SUM(contract_product.quantity) as total_sold'),
                'products.stock'
            )
            ->groupBy('products.id', 'products.name', 'products.category', 'products.stock')
            ->havingRaw('total_sold > 5')
            ->orderByDesc('total_sold')
            ->get();

        // Slow-moving items (sold less than 2 times or never)
        $slowMoving = DB::table('products')
            ->leftJoin('contract_product', 'products.id', '=', 'contract_product.product_id')
            ->select(
                'products.name',
                'products.category',
                DB::raw('COALESCE(SUM(contract_product.quantity), 0) as total_sold'),
                'products.stock',
                'products.price'
            )
            ->groupBy('products.id', 'products.name', 'products.category', 'products.stock', 'products.price')
            ->havingRaw('total_sold < 2')
            ->orderBy('total_sold')
            ->get();

        // Low stock items
        $lowStock = Product::whereRaw('stock <= min_stock')
            ->where('stock', '>', 0)
            ->select('name', 'category', 'stock', 'min_stock', 'price')
            ->orderBy('stock')
            ->get();

        // Out of stock items
        $outOfStock = Product::where('stock', '<=', 0)
            ->select('name', 'category', 'stock', 'min_stock', 'price')
            ->get();

        return response()->json([
            'stock_valuation' => $stockValuation,
            'fast_moving' => $fastMoving,
            'slow_moving' => $slowMoving,
            'low_stock' => $lowStock,
            'out_of_stock' => $outOfStock,
        ]);
    }

    /**
     * Export report to CSV
     */
    public function exportSales(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $startDate = Carbon::parse($request->start_date);
        $endDate = Carbon::parse($request->end_date);

        $contracts = Contract::with(['client', 'deceased', 'user'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        $filename = 'reporte_ventas_' . $startDate->format('Y-m-d') . '_' . $endDate->format('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        $callback = function() use ($contracts) {
            $file = fopen('php://output', 'w');

            // BOM for UTF-8
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF));

            // Headers
            fputcsv($file, [
                'Fecha',
                'N° Contrato',
                'Tipo',
                'Estado',
                'Cliente',
                'Difunto',
                'Subtotal',
                'Descuento',
                'Total',
                'Método Pago',
                'Comisión',
                'Secretaria',
            ]);

            foreach ($contracts as $contract) {
                fputcsv($file, [
                    $contract->created_at->format('d/m/Y'),
                    $contract->contract_number,
                    $contract->type === 'immediate_need' ? 'Necesidad Inmediata' : 'Necesidad Futura',
                    match($contract->status) {
                        'quote' => 'Cotización',
                        'contract' => 'Contrato',
                        'completed' => 'Finalizado',
                        'cancelled' => 'Cancelado',
                        default => $contract->status,
                    },
                    $contract->client->name ?? '',
                    $contract->deceased->name ?? 'N/A',
                    number_format($contract->subtotal, 0, ',', '.'),
                    $contract->discount . '%',
                    number_format($contract->total, 0, ',', '.'),
                    $contract->payment_method === 'cash' ? 'Contado' : ($contract->payment_method === 'credit' ? 'Crédito' : 'N/A'),
                    number_format($contract->commission_amount ?? 0, 0, ',', '.'),
                    $contract->user->name ?? 'N/A',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}

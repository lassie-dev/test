<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    /**
     * Display a listing of expenses.
     */
    public function index(Request $request)
    {
        $query = Expense::with(['branch', 'user']);

        // Category filter
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('expense_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('expense_date', '<=', $request->date_to);
        }

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('vendor_name', 'like', "%{$search}%")
                    ->orWhere('invoice_number', 'like', "%{$search}%");
            });
        }

        $expenses = $query->orderBy('expense_date', 'desc')
            ->paginate(20)
            ->withQueryString();

        // Calculate summary stats
        $thisMonthTotal = Expense::thisMonth()->sum('amount');
        $pendingCount = Expense::where('status', 'pending')->count();
        $totalByCategory = Expense::thisMonth()
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        return Inertia::render('features/expenses/pages/Index', [
            'expenses' => $expenses,
            'filters' => $request->only(['category', 'status', 'date_from', 'date_to', 'search']),
            'stats' => [
                'thisMonthTotal' => $thisMonthTotal,
                'pendingCount' => $pendingCount,
                'byCategory' => $totalByCategory,
            ],
        ]);
    }

    /**
     * Show the form for creating a new expense.
     */
    public function create()
    {
        return Inertia::render('features/expenses/pages/Create');
    }

    /**
     * Store a newly created expense.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'category' => 'required|in:salaries,supplies,utilities,vehicle,maintenance,marketing,administrative,other',
            'subcategory' => 'nullable|string|max:255',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'expense_date' => 'required|date',
            'payment_method' => 'required|in:cash,transfer,check,credit_card',
            'vendor_name' => 'nullable|string|max:255',
            'vendor_rut' => 'nullable|string|max:12',
            'invoice_number' => 'nullable|string|max:255',
            'receipt' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120', // 5MB max
            'is_recurring' => 'boolean',
            'recurring_frequency' => 'nullable|in:monthly,quarterly,yearly',
            'status' => 'required|in:pending,approved,paid',
            'notes' => 'nullable|string',
        ]);

        // Handle file upload
        $receiptPath = null;
        if ($request->hasFile('receipt')) {
            $receiptPath = $request->file('receipt')->store('receipts', 'public');
        }

        $expense = Expense::create([
            'branch_id' => auth()->user()->branch_id ?? 1,
            'user_id' => auth()->id(),
            'category' => $validated['category'],
            'subcategory' => $validated['subcategory'] ?? null,
            'description' => $validated['description'],
            'amount' => $validated['amount'],
            'expense_date' => $validated['expense_date'],
            'payment_method' => $validated['payment_method'],
            'vendor_name' => $validated['vendor_name'] ?? null,
            'vendor_rut' => $validated['vendor_rut'] ?? null,
            'invoice_number' => $validated['invoice_number'] ?? null,
            'receipt_path' => $receiptPath,
            'is_recurring' => $validated['is_recurring'] ?? false,
            'recurring_frequency' => $validated['recurring_frequency'] ?? null,
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->route('expenses.index')
            ->with('success', 'Expense created successfully');
    }

    /**
     * Display the specified expense.
     */
    public function show(Expense $expense)
    {
        $expense->load(['branch', 'user']);

        return Inertia::render('features/expenses/pages/Show', [
            'expense' => $expense,
        ]);
    }

    /**
     * Show the form for editing the specified expense.
     */
    public function edit(Expense $expense)
    {
        return Inertia::render('features/expenses/pages/Edit', [
            'expense' => $expense,
        ]);
    }

    /**
     * Update the specified expense.
     */
    public function update(Request $request, Expense $expense)
    {
        $validated = $request->validate([
            'category' => 'required|in:salaries,supplies,utilities,vehicle,maintenance,marketing,administrative,other',
            'subcategory' => 'nullable|string|max:255',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'expense_date' => 'required|date',
            'payment_method' => 'required|in:cash,transfer,check,credit_card',
            'vendor_name' => 'nullable|string|max:255',
            'vendor_rut' => 'nullable|string|max:12',
            'invoice_number' => 'nullable|string|max:255',
            'receipt' => 'nullable|file|mimes:pdf,jpg,jpeg,png|max:5120',
            'is_recurring' => 'boolean',
            'recurring_frequency' => 'nullable|in:monthly,quarterly,yearly',
            'status' => 'required|in:pending,approved,paid',
            'notes' => 'nullable|string',
        ]);

        // Handle file upload
        if ($request->hasFile('receipt')) {
            // Delete old receipt if exists
            if ($expense->receipt_path) {
                \Storage::disk('public')->delete($expense->receipt_path);
            }
            $validated['receipt_path'] = $request->file('receipt')->store('receipts', 'public');
        }

        $expense->update([
            'category' => $validated['category'],
            'subcategory' => $validated['subcategory'] ?? null,
            'description' => $validated['description'],
            'amount' => $validated['amount'],
            'expense_date' => $validated['expense_date'],
            'payment_method' => $validated['payment_method'],
            'vendor_name' => $validated['vendor_name'] ?? null,
            'vendor_rut' => $validated['vendor_rut'] ?? null,
            'invoice_number' => $validated['invoice_number'] ?? null,
            'receipt_path' => $validated['receipt_path'] ?? $expense->receipt_path,
            'is_recurring' => $validated['is_recurring'] ?? false,
            'recurring_frequency' => $validated['recurring_frequency'] ?? null,
            'status' => $validated['status'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->route('expenses.index')
            ->with('success', 'Expense updated successfully');
    }

    /**
     * Remove the specified expense.
     */
    public function destroy(Expense $expense)
    {
        // Delete receipt file if exists
        if ($expense->receipt_path) {
            \Storage::disk('public')->delete($expense->receipt_path);
        }

        $expense->delete();

        return redirect()->route('expenses.index')
            ->with('success', 'Expense deleted successfully');
    }

    /**
     * Check for duplicate invoice number.
     */
    public function checkDuplicate(Request $request)
    {
        $invoiceNumber = $request->input('invoice_number');

        $expense = Expense::where('invoice_number', $invoiceNumber)->first();

        if ($expense) {
            return response()->json([
                'exists' => true,
                'expense' => [
                    'id' => $expense->id,
                    'description' => $expense->description,
                    'amount' => $expense->amount,
                    'expense_date' => $expense->expense_date,
                    'category' => $expense->category,
                ],
            ]);
        }

        return response()->json(['exists' => false]);
    }

    /**
     * Generate P&L statement.
     */
    public function profitLoss(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth());
        $endDate = $request->input('end_date', now()->endOfMonth());

        // Revenue from contracts
        $revenue = \App\Models\Contract::whereBetween('created_at', [$startDate, $endDate])
            ->sum('total');

        // Expenses by category
        $expenses = Expense::byDateRange($startDate, $endDate)
            ->selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        $totalExpenses = $expenses->sum();
        $netProfit = $revenue - $totalExpenses;
        $profitMargin = $revenue > 0 ? ($netProfit / $revenue) * 100 : 0;

        return response()->json([
            'period' => [
                'start' => $startDate,
                'end' => $endDate,
            ],
            'revenue' => $revenue,
            'expenses' => $expenses,
            'totalExpenses' => $totalExpenses,
            'netProfit' => $netProfit,
            'profitMargin' => round($profitMargin, 2),
        ]);
    }
}

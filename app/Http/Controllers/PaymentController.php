<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Contract;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class PaymentController extends Controller
{
    /**
     * Display the payments management page.
     */
    public function index(Request $request)
    {
        $query = Payment::with(['contract.client', 'contract.deceased', 'processor']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('receipt_number', 'like', "%{$search}%")
                  ->orWhereHas('contract', function ($q) use ($search) {
                      $q->where('contract_number', 'like', "%{$search}%")
                        ->orWhereHas('client', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                              ->orWhere('rut', 'like', "%{$search}%");
                        });
                  });
            });
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            if ($request->status === 'overdue') {
                $query->where('status', 'pending')
                      ->where('due_date', '<', now());
            } else {
                $query->where('status', $request->status);
            }
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->where('due_date', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->where('due_date', '<=', $request->date_to);
        }

        // Get paginated payments
        $payments = $query->orderBy('due_date', 'desc')
            ->paginate(15)
            ->withQueryString()
            ->through(function ($payment) {
                return [
                    'id' => $payment->id,
                    'contract_id' => $payment->contract_id,
                    'contract_number' => $payment->contract->contract_number,
                    'client_name' => $payment->contract->client->name,
                    'client_rut' => $payment->contract->client->rut,
                    'deceased_name' => $payment->contract->deceased?->name,
                    'amount' => (float) $payment->amount,
                    'payment_method' => $payment->payment_method,
                    'payment_date' => $payment->payment_date,
                    'due_date' => $payment->due_date,
                    'status' => $payment->status,
                    'receipt_number' => $payment->receipt_number,
                    'is_overdue' => $payment->isOverdue(),
                    'notes' => $payment->notes,
                    'processed_by' => $payment->processor ? $payment->processor->name : null,
                    'created_at' => $payment->created_at,
                ];
            });

        // Calculate statistics
        $allPayments = Payment::all();
        $thisMonthPayments = Payment::whereMonth('payment_date', Carbon::now()->month)
            ->whereYear('payment_date', Carbon::now()->year)
            ->where('status', 'paid')
            ->get();

        $pendingPayments = $allPayments->where('status', 'pending');
        $overduePayments = $allPayments->filter(fn($p) => $p->isOverdue());

        $stats = [
            'monthly_collected' => $thisMonthPayments->sum('amount'),
            'pending_count' => $pendingPayments->count(),
            'pending_amount' => $pendingPayments->sum('amount'),
            'overdue_count' => $overduePayments->count(),
            'overdue_amount' => $overduePayments->sum('amount'),
            'total_owed' => $pendingPayments->sum('amount'),
        ];

        return Inertia::render('features/payments/pages/Index', [
            'payments' => $payments,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Store a newly created payment.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'contract_id' => 'required|exists:contracts,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,credit,transfer,check',
            'payment_date' => 'required|date',
            'receipt_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $validated['status'] = 'paid';
        $validated['processed_by'] = auth()->id();

        Payment::create($validated);

        return redirect()->route('payments.index')
            ->with('success', 'Payment registered successfully.');
    }

    /**
     * Update payment status or information.
     */
    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'amount' => 'nullable|numeric|min:0',
            'payment_method' => 'nullable|in:cash,credit,transfer,check',
            'payment_date' => 'nullable|date',
            'status' => 'nullable|in:pending,paid,cancelled',
            'receipt_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        if (isset($validated['status']) && $validated['status'] === 'paid' && !$payment->processed_by) {
            $validated['processed_by'] = auth()->id();
            $validated['payment_date'] = $validated['payment_date'] ?? now();
        }

        $payment->update($validated);

        return redirect()->route('payments.index')
            ->with('success', 'Payment updated successfully.');
    }

    /**
     * Mark payment as paid.
     */
    public function markAsPaid(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'payment_method' => 'required|in:cash,credit,transfer,check',
            'payment_date' => 'required|date',
            'receipt_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $payment->update([
            'status' => 'paid',
            'payment_method' => $validated['payment_method'],
            'payment_date' => $validated['payment_date'],
            'receipt_number' => $validated['receipt_number'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'processed_by' => auth()->id(),
        ]);

        return redirect()->route('payments.index')
            ->with('success', 'Payment marked as paid successfully.');
    }

    /**
     * Remove the specified payment.
     */
    public function destroy(Payment $payment)
    {
        $payment->delete();

        return redirect()->route('payments.index')
            ->with('success', 'Payment deleted successfully.');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Expense extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'branch_id',
        'user_id',
        'category',
        'subcategory',
        'description',
        'amount',
        'expense_date',
        'payment_method',
        'vendor_name',
        'vendor_rut',
        'invoice_number',
        'receipt_path',
        'is_recurring',
        'recurring_frequency',
        'status',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expense_date' => 'date',
        'is_recurring' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Scopes
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('expense_date', [$startDate, $endDate]);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('expense_date', now()->month)
            ->whereYear('expense_date', now()->year);
    }

    public function scopeRecurring($query)
    {
        return $query->where('is_recurring', true);
    }

    // Helper methods
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    public function hasReceipt(): bool
    {
        return !empty($this->receipt_path);
    }
}

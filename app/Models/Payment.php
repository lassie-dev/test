<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'contract_id',
        'payment_method',
        'amount',
        'payment_date',
        'due_date',
        'status',
        'receipt_number',
        'notes',
        'processed_by',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
        'due_date' => 'date',
    ];

    /**
     * Get the contract that owns this payment
     */
    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    /**
     * Get the user who processed the payment
     */
    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * Check if payment is overdue
     */
    public function isOverdue(): bool
    {
        if ($this->status === 'paid' || !$this->due_date) {
            return false;
        }

        return now()->isAfter($this->due_date);
    }
}

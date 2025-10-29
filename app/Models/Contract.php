<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contract extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'contract_number',
        'type',
        'status',
        'client_id',
        'deceased_id',
        'service_date',
        'user_id',
        'branch_id',
        'agreement_id',
        'church_id',
        'cemetery_id',
        'wake_room_id',
        'subtotal',
        'discount_percentage',
        'discount_amount',
        'total',
        'payment_method',
        'installments',
        'down_payment',
        'service_location',
        'service_datetime',
        'special_requests',
        'assigned_driver_id',
        'assigned_assistant_id',
        'commission_percentage',
        'commission_amount',
        'is_holiday',
        'is_night_shift',
    ];

    protected $casts = [
        'service_date' => 'datetime',
        'service_datetime' => 'datetime',
        'subtotal' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'total' => 'decimal:2',
        'down_payment' => 'decimal:2',
        'commission_percentage' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'installments' => 'integer',
        'is_holiday' => 'boolean',
        'is_night_shift' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function deceased(): BelongsTo
    {
        return $this->belongsTo(Deceased::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class)
            ->withPivot('quantity', 'unit_price', 'subtotal')
            ->withTimestamps();
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class)
            ->withPivot('quantity', 'unit_price', 'subtotal')
            ->withTimestamps();
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function assignedDriver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_driver_id');
    }

    public function assignedAssistant(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_assistant_id');
    }

    public function agreement(): BelongsTo
    {
        return $this->belongsTo(Agreement::class);
    }

    public function church(): BelongsTo
    {
        return $this->belongsTo(Church::class);
    }

    public function cemetery(): BelongsTo
    {
        return $this->belongsTo(Cemetery::class);
    }

    public function wakeRoom(): BelongsTo
    {
        return $this->belongsTo(WakeRoom::class);
    }

    // Scopes
    public function scopeImmediateNeed($query)
    {
        return $query->where('type', 'immediate_need');
    }

    public function scopeFutureNeed($query)
    {
        return $query->where('type', 'future_need');
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year);
    }

    public function scopeForBranch($query, $branchId)
    {
        return $query->where('branch_id', $branchId);
    }
}

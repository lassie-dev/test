<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Agreement extends Model
{
    protected $fillable = [
        'code',
        'company_name',
        'contact_name',
        'contact_phone',
        'start_date',
        'end_date',
        'status',
        'company_pays_percentage',
        'employee_pays_percentage',
        // Optional fields (kept in DB but not required in forms)
        'discount_percentage', // Deprecated: Use contract-level discounts instead
        'contact_email',
        'address',
        'covered_employees',
        'payment_method',
        'credit_months',
        'included_services',
        'special_conditions',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'covered_employees' => 'integer',
        'discount_percentage' => 'decimal:2',
        'company_pays_percentage' => 'decimal:2',
        'employee_pays_percentage' => 'decimal:2',
        'credit_months' => 'integer',
    ];

    /**
     * Relationship: Contracts using this agreement
     */
    public function contracts()
    {
        return $this->hasMany(Contract::class);
    }

    /**
     * Scope: Active agreements
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope: Expiring soon (within 30 days)
     */
    public function scopeExpiringSoon($query)
    {
        return $query->where('status', 'active')
            ->where('end_date', '<=', Carbon::now()->addDays(30))
            ->where('end_date', '>=', Carbon::now());
    }

    /**
     * Check if agreement is currently active
     */
    public function isActive()
    {
        return $this->status === 'active'
            && $this->end_date >= Carbon::now();
    }

    /**
     * Check if agreement is expiring soon
     */
    public function isExpiringSoon()
    {
        return $this->status === 'active'
            && $this->end_date <= Carbon::now()->addDays(30)
            && $this->end_date >= Carbon::now();
    }

    /**
     * Get contracts count for this agreement
     */
    public function getContractsCountAttribute()
    {
        return $this->contracts()->count();
    }

    /**
     * Get total revenue for this agreement
     */
    public function getTotalRevenueAttribute()
    {
        return $this->contracts()->sum('total');
    }
}

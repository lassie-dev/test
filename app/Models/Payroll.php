<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Payroll extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id', 'branch_id', 'period', 'period_start', 'period_end',
        'base_salary', 'commissions_total', 'bonuses', 'overtime',
        'gross_salary', 'health_deduction', 'pension_deduction',
        'tax_deduction', 'other_deductions', 'total_deductions',
        'net_salary', 'status', 'payment_date', 'notes',
    ];

    protected $casts = [
        'period_start' => 'date',
        'period_end' => 'date',
        'payment_date' => 'date',
        'base_salary' => 'decimal:2',
        'commissions_total' => 'decimal:2',
        'bonuses' => 'decimal:2',
        'overtime' => 'decimal:2',
        'gross_salary' => 'decimal:2',
        'health_deduction' => 'decimal:2',
        'pension_deduction' => 'decimal:2',
        'tax_deduction' => 'decimal:2',
        'other_deductions' => 'decimal:2',
        'total_deductions' => 'decimal:2',
        'net_salary' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function scopeByPeriod($query, $period)
    {
        return $query->where('period', $period);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }
}

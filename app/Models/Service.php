<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Service extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'active' => 'boolean',
    ];

    public function contracts(): BelongsToMany
    {
        return $this->belongsToMany(Contract::class)
            ->withPivot('quantity', 'unit_price', 'subtotal')
            ->withTimestamps();
    }
}

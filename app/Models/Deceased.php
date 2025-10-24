<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Deceased extends Model
{
    protected $fillable = [
        'name',
        'death_date',
        'death_place',
    ];

    protected $casts = [
        'death_date' => 'date',
    ];

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }
}

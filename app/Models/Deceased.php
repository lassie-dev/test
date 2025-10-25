<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Deceased extends Model
{
    protected $fillable = [
        'name',
        'death_date',
        'death_time',
        'death_place',
        'age',
        'cause_of_death',
    ];

    protected $casts = [
        'death_date' => 'date',
        'death_time' => 'datetime:H:i',
        'age' => 'integer',
    ];

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }
}

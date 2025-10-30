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
        'education_level',
        'profession',
        'marital_status',
        'religion',
    ];

    protected $casts = [
        'death_date' => 'date',
        'age' => 'integer',
    ];

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }
}

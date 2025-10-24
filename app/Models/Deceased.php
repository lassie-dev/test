<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Deceased extends Model
{
    protected $fillable = [
        'nombre',
        'fecha_fallecimiento',
        'lugar_fallecimiento',
    ];

    protected $casts = [
        'fecha_fallecimiento' => 'date',
    ];

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }
}

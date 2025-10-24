<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $fillable = [
        'name',
        'rut',
        'phone',
        'email',
        'address',
    ];

    public function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }
}

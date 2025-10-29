<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Church extends Model
{
    protected $fillable = [
        'name',
        'religion',
        'address',
        'city',
        'region',
        'phone',
        'priest_pastor_name',
        'email',
        'capacity',
        'service_hours',
        'parking_available',
        'wheelchair_accessible',
        'notes',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'parking_available' => 'boolean',
        'wheelchair_accessible' => 'boolean',
    ];

    public function scopeByCity($query, $city)
    {
        return $query->where('city', $city);
    }

    public function scopeByRegion($query, $region)
    {
        return $query->where('region', $region);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', "%{$search}%")
            ->orWhere('city', 'like', "%{$search}%")
            ->orWhere('address', 'like', "%{$search}%");
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WakeRoom extends Model
{
    protected $fillable = [
        'name',
        'funeral_home_name',
        'address',
        'city',
        'region',
        'phone',
        'contact_name',
        'email',
        'capacity',
        'hourly_rate',
        'daily_rate',
        'has_chapel',
        'has_kitchen',
        'has_bathrooms',
        'has_parking',
        'wheelchair_accessible',
        'available_24h',
        'amenities',
        'notes',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'hourly_rate' => 'decimal:2',
        'daily_rate' => 'decimal:2',
        'has_chapel' => 'boolean',
        'has_kitchen' => 'boolean',
        'has_bathrooms' => 'boolean',
        'has_parking' => 'boolean',
        'wheelchair_accessible' => 'boolean',
        'available_24h' => 'boolean',
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
            ->orWhere('funeral_home_name', 'like', "%{$search}%")
            ->orWhere('address', 'like', "%{$search}%");
    }
}

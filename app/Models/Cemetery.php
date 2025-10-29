<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cemetery extends Model
{
    protected $fillable = [
        'name',
        'type',
        'address',
        'city',
        'region',
        'phone',
        'administrator_name',
        'email',
        'office_hours',
        'plots_available',
        'niches_available',
        'cremation_plots_available',
        'plot_price_from',
        'parking_available',
        'wheelchair_accessible',
        'notes',
    ];

    protected $casts = [
        'plots_available' => 'boolean',
        'niches_available' => 'boolean',
        'cremation_plots_available' => 'boolean',
        'plot_price_from' => 'decimal:2',
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

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', "%{$search}%")
            ->orWhere('city', 'like', "%{$search}%")
            ->orWhere('address', 'like', "%{$search}%");
    }
}

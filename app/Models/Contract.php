<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Contract extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'numero_contrato',
        'tipo',
        'estado',
        'client_id',
        'deceased_id',
        'user_id',
        'subtotal',
        'descuento_porcentaje',
        'descuento_monto',
        'total',
        'es_festivo',
        'es_nocturno',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'descuento_porcentaje' => 'decimal:2',
        'descuento_monto' => 'decimal:2',
        'total' => 'decimal:2',
        'es_festivo' => 'boolean',
        'es_nocturno' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function deceased(): BelongsTo
    {
        return $this->belongsTo(Deceased::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class)
            ->withPivot('cantidad', 'precio_unitario', 'subtotal')
            ->withTimestamps();
    }

    // Scopes
    public function scopeNecesidadInmediata($query)
    {
        return $query->where('tipo', 'necesidad_inmediata');
    }

    public function scopeNecesidadFutura($query)
    {
        return $query->where('tipo', 'necesidad_futura');
    }

    public function scopeDelMes($query)
    {
        return $query->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Staff extends Model
{
    use SoftDeletes;

    protected $table = 'staff';

    protected $fillable = [
        'name',
        'rut',
        'role',
        'email',
        'phone',
        'address',
        'hire_date',
        'base_salary',
        'bank_account',
        'bank_name',
        'emergency_contact_name',
        'emergency_contact_phone',
        'vehicle_plate',
        'vehicle_model',
        'is_active',
        'branch_id',
        'notes',
    ];

    protected $casts = [
        'hire_date' => 'date',
        'base_salary' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    /**
     * Get the branch this staff member belongs to
     */
    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    /**
     * Get contracts assigned to this staff member as driver
     */
    public function contractsAsDriver(): HasMany
    {
        return $this->hasMany(Contract::class, 'assigned_driver_id');
    }

    /**
     * Get contracts assigned to this staff member as assistant
     */
    public function contractsAsAssistant(): HasMany
    {
        return $this->hasMany(Contract::class, 'assigned_assistant_id');
    }

    /**
     * Get contracts created by this secretary
     */
    public function contractsCreated(): HasMany
    {
        return $this->hasMany(Contract::class, 'created_by');
    }

    /**
     * Scope to filter active staff only
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by role
     */
    public function scopeRole($query, $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Get drivers only
     */
    public function scopeDrivers($query)
    {
        return $query->where('role', 'conductor')->where('is_active', true);
    }

    /**
     * Get secretaries only
     */
    public function scopeSecretaries($query)
    {
        return $query->where('role', 'secretaria')->where('is_active', true);
    }

    /**
     * Get assistants only
     */
    public function scopeAssistants($query)
    {
        return $query->where('role', 'auxiliar')->where('is_active', true);
    }

    /**
     * Get formatted role name
     */
    public function getRoleNameAttribute(): string
    {
        $roles = [
            'secretaria' => 'Secretaria',
            'conductor' => 'Conductor',
            'auxiliar' => 'Auxiliar',
            'administrador' => 'Administrador',
            'propietario' => 'Propietario',
        ];

        return $roles[$this->role] ?? $this->role;
    }

    /**
     * Check if staff member is a driver
     */
    public function isDriver(): bool
    {
        return $this->role === 'conductor';
    }

    /**
     * Check if staff member is a secretary
     */
    public function isSecretary(): bool
    {
        return $this->role === 'secretaria';
    }

    /**
     * Check if staff member is an assistant
     */
    public function isAssistant(): bool
    {
        return $this->role === 'auxiliar';
    }
}

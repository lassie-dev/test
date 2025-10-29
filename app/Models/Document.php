<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'type',
        'category',
        'description',
        'file_path',
        'file_type',
        'file_size',
        'documentable_type',
        'documentable_id',
        'uploaded_by',
        'issue_date',
        'expiration_date',
        'expires',
        'is_expired',
        'status',
        'notes',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expiration_date' => 'date',
        'expires' => 'boolean',
        'is_expired' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    // Relationships
    public function documentable(): MorphTo
    {
        return $this->morphTo();
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }

    // Scopes
    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeExpiringSoon($query, $days = 30)
    {
        return $query->where('expires', true)
            ->where('is_expired', false)
            ->whereBetween('expiration_date', [now(), now()->addDays($days)]);
    }

    public function scopeExpired($query)
    {
        return $query->where('is_expired', true);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Helper methods
    public function isExpiringSoon($days = 30): bool
    {
        if (!$this->expires || !$this->expiration_date) {
            return false;
        }

        return $this->expiration_date->between(now(), now()->addDays($days));
    }

    public function checkAndUpdateExpiration(): void
    {
        if ($this->expires && $this->expiration_date && $this->expiration_date->isPast()) {
            $this->update([
                'is_expired' => true,
                'status' => 'expired',
            ]);
        }
    }

    public function getDaysUntilExpiration(): ?int
    {
        if (!$this->expires || !$this->expiration_date) {
            return null;
        }

        return now()->diffInDays($this->expiration_date, false);
    }

    public function getFileSizeFormatted(): string
    {
        $bytes = $this->file_size;
        $units = ['B', 'KB', 'MB', 'GB'];

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }
}

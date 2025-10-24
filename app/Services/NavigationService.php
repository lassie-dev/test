<?php

namespace App\Services;

use App\Models\MenuSection;
use Illuminate\Support\Facades\Cache;

class NavigationService
{
    /**
     * Get the navigation menu structure
     */
    public function getMenu(): array
    {
        // Cache the menu for 1 hour
        return Cache::remember('navigation_menu', 3600, function () {
            return MenuSection::active()
                ->with(['items' => function ($query) {
                    $query->active()->with(['children' => function ($q) {
                        $q->active();
                    }]);
                }])
                ->orderBy('order')
                ->get()
                ->map(function ($section) {
                    return [
                        'title' => $section->title,
                        'permissions' => $section->permissions,
                        'items' => $section->items->map(function ($item) {
                            return $this->formatMenuItem($item);
                        })->toArray(),
                    ];
                })
                ->toArray();
        });
    }

    /**
     * Format a menu item for the frontend
     */
    private function formatMenuItem($item): array
    {
        $formattedItem = [
            'name' => $item->name,
            'href' => $item->href,
            'icon' => $item->icon,
            'permissions' => $item->permissions,
        ];

        if ($item->badge) {
            $formattedItem['badge'] = $item->badge;
        }

        if ($item->children && $item->children->count() > 0) {
            $formattedItem['children'] = $item->children->map(function ($child) {
                return $this->formatMenuItem($child);
            })->toArray();
        }

        return $formattedItem;
    }

    /**
     * Clear the navigation cache
     */
    public function clearCache(): void
    {
        Cache::forget('navigation_menu');
    }
}

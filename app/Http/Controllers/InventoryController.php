<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    /**
     * Display the inventory management page.
     */
    public function index(Request $request)
    {
        $query = Product::query();

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Category filter (using category_id relationship)
        if ($request->has('category') && $request->category) {
            $query->where('category_id', $request->category);
        }

        // Stock status filter
        if ($request->has('stock_status') && $request->stock_status) {
            if ($request->stock_status === 'low') {
                $query->whereRaw('stock <= min_stock');
            } elseif ($request->stock_status === 'out') {
                $query->where('stock', '<=', 0);
            }
        }

        // Get products with pagination and load category relationship
        $products = $query->with('category')->orderBy('name')->paginate(15)->withQueryString();

        // Calculate stats
        $allProducts = Product::all();
        $stats = [
            'total' => $allProducts->count(),
            'lowStock' => $allProducts->filter(fn($p) => $p->stock <= $p->min_stock && $p->stock > 0)->count(),
            'outOfStock' => $allProducts->filter(fn($p) => $p->stock <= 0)->count(),
            'totalValue' => $allProducts->sum(fn($p) => $p->price * $p->stock),
        ];

        // Get product categories for filter
        $categories = Category::where('type', 'product')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('features/inventory/pages/Index', [
            'products' => $products,
            'stats' => $stats,
            'categories' => $categories,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'stock_status' => $request->stock_status,
            ],
        ]);
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Category::query()->withCount(['products', 'services']);

        // Filter by type
        if ($request->has('type') && $request->type) {
            $query->where('type', $request->type);
        }

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Get categories with pagination
        $categories = $query->orderBy('type')->orderBy('name')->paginate(15)->withQueryString();

        // Calculate stats
        $stats = [
            'total' => Category::count(),
            'product' => Category::where('type', 'product')->count(),
            'service' => Category::where('type', 'service')->count(),
        ];

        return Inertia::render('features/categories/pages/Index', [
            'categories' => $categories,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'type' => $request->type,
            ],
            'categoryType' => 'all',
        ]);
    }

    /**
     * Display product categories only.
     */
    public function products(Request $request)
    {
        $query = Category::query()->where('type', 'product')->withCount(['products']);

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Get categories with pagination
        $categories = $query->orderBy('name')->paginate(15)->withQueryString();

        // Calculate stats (product-only)
        $stats = [
            'total' => Category::where('type', 'product')->count(),
            'product' => Category::where('type', 'product')->count(),
            'service' => 0,
        ];

        return Inertia::render('features/categories/pages/Index', [
            'categories' => $categories,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'type' => 'product',
            ],
            'categoryType' => 'product',
        ]);
    }

    /**
     * Display service categories only.
     */
    public function services(Request $request)
    {
        $query = Category::query()->where('type', 'service')->withCount(['services']);

        // Search filter
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Get categories with pagination
        $categories = $query->orderBy('name')->paginate(15)->withQueryString();

        // Calculate stats (service-only)
        $stats = [
            'total' => Category::where('type', 'service')->count(),
            'product' => 0,
            'service' => Category::where('type', 'service')->count(),
        ];

        return Inertia::render('features/categories/pages/Index', [
            'categories' => $categories,
            'stats' => $stats,
            'filters' => [
                'search' => $request->search,
                'type' => 'service',
            ],
            'categoryType' => 'service',
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $categoryType = $request->query('type'); // Get type from URL query parameter

        $parentCategories = Category::parents()->active()->orderBy('name')->get();

        return Inertia::render('features/categories/pages/Create', [
            'parentCategories' => $parentCategories,
            'categoryType' => $categoryType, // Pass to frontend
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:service,product',
            'icon' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        // Auto-generate slug from name
        $validated['slug'] = Str::slug($validated['name']);

        $category = Category::create($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Categoría creada exitosamente.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category)
    {
        $parentCategories = Category::parents()
            ->where('id', '!=', $category->id)
            ->active()
            ->orderBy('name')
            ->get();

        return Inertia::render('features/categories/pages/Edit', [
            'category' => $category,
            'parentCategories' => $parentCategories,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:service,product',
            'icon' => 'nullable|string|max:50',
            'is_active' => 'boolean',
            'parent_id' => 'nullable|exists:categories,id',
        ]);

        // Auto-generate slug from name
        $validated['slug'] = Str::slug($validated['name']);

        $category->update($validated);

        return redirect()->route('categories.index')
            ->with('success', 'Categoría actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Category $category)
    {
        // Check if category has associated products or services
        $itemsCount = $category->products()->count() + $category->services()->count();

        if ($itemsCount > 0) {
            return redirect()->route('categories.index')
                ->with('error', 'No se puede eliminar la categoría porque tiene ' . $itemsCount . ' elemento(s) asociado(s).');
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Categoría eliminada exitosamente.');
    }

}

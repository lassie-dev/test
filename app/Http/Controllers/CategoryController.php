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
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        return Inertia::render('features/categories/pages/Create');
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
            'is_active' => 'boolean',
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
        return Inertia::render('features/categories/pages/Edit', [
            'category' => $category,
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
            'is_active' => 'boolean',
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
    public function destroy(Request $request, Category $category)
    {
        // Check if category has associated products or services
        $itemsCount = $category->products()->count() + $category->services()->count();
        $forceDelete = $request->query('force') === 'true';

        if ($itemsCount > 0 && !$forceDelete) {
            return redirect()->route('categories.index')
                ->with('error', 'No se puede eliminar la categoría porque tiene ' . $itemsCount . ' elemento(s) asociado(s).');
        }

        // If force delete, detach all associated products and services
        if ($forceDelete && $itemsCount > 0) {
            // Detach products (set category_id to null)
            $category->products()->update(['category_id' => null]);

            // Detach services (set category_id to null)
            $category->services()->update(['category_id' => null]);
        }

        $category->delete();

        return redirect()->route('categories.index')
            ->with('success', 'Categoría eliminada exitosamente.');
    }

}

<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Display a listing of services.
     */
    public function index(Request $request)
    {
        $query = Service::query()->with('category');

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category') && $request->category) {
            $query->where('category_id', $request->category);
        }

        // Status filter
        if ($request->filled('status') && $request->status) {
            if ($request->status === 'active') {
                $query->where('active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('active', false);
            }
        }

        $services = $query->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function ($service) {
                return [
                    'id' => $service->id,
                    'nombre' => $service->name,
                    'descripcion' => $service->description,
                    'precio' => (float) $service->price,
                    'activo' => $service->active,
                    'category' => $service->category ? [
                        'id' => $service->category->id,
                        'name' => $service->category->name,
                        'slug' => $service->category->slug,
                    ] : null,
                    'created_at' => $service->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $service->updated_at->format('Y-m-d H:i:s'),
                ];
            });

        // Get service categories for filter
        $categories = Category::where('type', 'service')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('features/services/pages/Index', [
            'services' => $services,
            'categories' => $categories,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'status' => $request->status,
            ],
        ]);
    }

    /**
     * Show the form for creating a new service.
     */
    public function create()
    {
        // Get service categories for the form
        $categories = Category::where('type', 'service')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('features/services/pages/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created service in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'precio' => 'required|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'activo' => 'boolean',
        ]);

        // Map frontend field names to database field names
        $serviceData = [
            'name' => $validated['nombre'],
            'description' => $validated['descripcion'] ?? null,
            'price' => $validated['precio'],
            'category_id' => $validated['category_id'] ?? null,
            'active' => $validated['activo'] ?? true,
        ];

        Service::create($serviceData);

        return redirect()->route('services.index')
            ->with('success', 'Servicio creado exitosamente.');
    }

    /**
     * Display the specified service.
     */
    public function show(Service $service)
    {
        $service->load('category');

        return Inertia::render('features/services/pages/Show', [
            'service' => [
                'id' => $service->id,
                'nombre' => $service->name,
                'descripcion' => $service->description,
                'precio' => (float) $service->price,
                'activo' => $service->active,
                'category' => $service->category ? [
                    'id' => $service->category->id,
                    'name' => $service->category->name,
                    'slug' => $service->category->slug,
                ] : null,
                'created_at' => $service->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $service->updated_at->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified service.
     */
    public function edit(Service $service)
    {
        $service->load('category');

        // Get service categories for the form
        $categories = Category::where('type', 'service')
            ->where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'slug']);

        return Inertia::render('features/services/pages/Edit', [
            'service' => [
                'id' => $service->id,
                'nombre' => $service->name,
                'descripcion' => $service->description,
                'precio' => (float) $service->price,
                'activo' => $service->active,
                'category' => $service->category ? [
                    'id' => $service->category->id,
                    'name' => $service->category->name,
                    'slug' => $service->category->slug,
                ] : null,
            ],
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified service in storage.
     */
    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string|max:1000',
            'precio' => 'required|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
            'activo' => 'boolean',
        ]);

        // Map frontend field names to database field names
        $serviceData = [
            'name' => $validated['nombre'],
            'description' => $validated['descripcion'] ?? null,
            'price' => $validated['precio'],
            'category_id' => $validated['category_id'] ?? null,
            'active' => $validated['activo'] ?? $service->active,
        ];

        $service->update($serviceData);

        return redirect()->route('services.index')
            ->with('success', 'Servicio actualizado exitosamente.');
    }

    /**
     * Remove the specified service from storage.
     */
    public function destroy(Service $service)
    {
        // Check if service is being used in any contracts
        $contractsCount = $service->contracts()->count();

        if ($contractsCount > 0) {
            return back()->with('error', 'No se puede eliminar el servicio porque está siendo usado en ' . $contractsCount . ' contrato(s).');
        }

        $service->delete();

        return redirect()->route('services.index')
            ->with('success', 'Servicio eliminado exitosamente.');
    }
}

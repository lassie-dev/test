<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    /**
     * Display a listing of services.
     */
    public function index(Request $request)
    {
        $query = Service::query();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Active/Inactive filter
        if ($request->filled('active')) {
            $query->where('active', $request->active === 'true' || $request->active === '1');
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
                    'created_at' => $service->created_at->format('Y-m-d H:i:s'),
                    'updated_at' => $service->updated_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Services/Index', [
            'services' => $services,
            'filters' => [
                'search' => $request->search,
                'active' => $request->active,
            ],
        ]);
    }

    /**
     * Show the form for creating a new service.
     */
    public function create()
    {
        return Inertia::render('Services/Create');
    }

    /**
     * Store a newly created service in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'active' => 'boolean',
        ]);

        Service::create($validated);

        return redirect()->route('services.index')
            ->with('success', 'Servicio creado exitosamente.');
    }

    /**
     * Display the specified service.
     */
    public function show(Service $service)
    {
        return Inertia::render('Services/Show', [
            'service' => [
                'id' => $service->id,
                'nombre' => $service->name,
                'descripcion' => $service->description,
                'precio' => (float) $service->price,
                'activo' => $service->active,
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
        return Inertia::render('Services/Edit', [
            'service' => [
                'id' => $service->id,
                'nombre' => $service->name,
                'descripcion' => $service->description,
                'precio' => (float) $service->price,
                'activo' => $service->active,
            ],
        ]);
    }

    /**
     * Update the specified service in storage.
     */
    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'price' => 'required|numeric|min:0',
            'active' => 'boolean',
        ]);

        $service->update($validated);

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

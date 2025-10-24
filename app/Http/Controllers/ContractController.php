<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContractController extends Controller
{
    /**
     * Display a listing of contracts.
     */
    public function index()
    {
        $contracts = Contract::with(['client', 'deceased', 'services'])
            ->latest()
            ->get()
            ->map(function ($contract) {
                return [
                    'id' => $contract->id,
                    'numero_contrato' => $contract->numero_contrato,
                    'tipo' => $contract->tipo,
                    'estado' => $contract->estado,
                    'cliente' => [
                        'id' => $contract->client->id,
                        'nombre' => $contract->client->nombre,
                        'rut' => $contract->client->rut,
                        'telefono' => $contract->client->telefono,
                        'email' => $contract->client->email ?? null,
                    ],
                    'difunto' => $contract->deceased ? [
                        'id' => $contract->deceased->id,
                        'nombre' => $contract->deceased->nombre,
                        'fecha_fallecimiento' => $contract->deceased->fecha_fallecimiento,
                        'lugar_fallecimiento' => $contract->deceased->lugar_fallecimiento,
                    ] : null,
                    'servicios' => $contract->services->map(function ($service) {
                        return [
                            'servicio' => [
                                'id' => $service->id,
                                'nombre' => $service->nombre,
                                'descripcion' => $service->descripcion,
                                'precio' => (float) $service->precio,
                            ],
                            'cantidad' => $service->pivot->cantidad,
                            'precio_unitario' => (float) $service->pivot->precio_unitario,
                            'subtotal' => (float) $service->pivot->subtotal,
                        ];
                    }),
                    'subtotal' => (float) $contract->subtotal,
                    'descuento_porcentaje' => (float) $contract->descuento_porcentaje,
                    'descuento_monto' => (float) $contract->descuento_monto,
                    'total' => (float) $contract->total,
                    'es_festivo' => $contract->es_festivo,
                    'es_nocturno' => $contract->es_nocturno,
                    'created_at' => $contract->created_at,
                    'updated_at' => $contract->updated_at,
                ];
            });

        return Inertia::render('Contracts/Index', [
            'contracts' => $contracts,
        ]);
    }

    /**
     * Show the form for creating a new contract.
     */
    public function create()
    {
        $services = Service::where('activo', true)->get();

        return Inertia::render('Contracts/Create', [
            'services' => $services,
        ]);
    }

    /**
     * Store a newly created contract.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'tipo' => 'required|in:necesidad_inmediata,necesidad_futura',
            'cliente.nombre' => 'required|string|max:255',
            'cliente.rut' => 'required|string|max:12',
            'cliente.telefono' => 'required|string|max:20',
            'cliente.email' => 'nullable|email',
            'difunto.nombre' => 'required_if:tipo,necesidad_inmediata|string|max:255',
            'difunto.fecha_fallecimiento' => 'required_if:tipo,necesidad_inmediata|date',
            'difunto.lugar_fallecimiento' => 'nullable|string',
            'servicios' => 'required|array|min:1',
            'servicios.*.servicio_id' => 'required|exists:services,id',
            'servicios.*.cantidad' => 'required|integer|min:1',
            'descuento_porcentaje' => 'nullable|numeric|min:0|max:100',
            'es_festivo' => 'boolean',
            'es_nocturno' => 'boolean',
        ]);

        // Implementation of store logic would go here
        // For now, return back with success
        return redirect()->route('contracts.index')
            ->with('success', 'Contrato creado exitosamente');
    }

    /**
     * Display the specified contract.
     */
    public function show(Contract $contract)
    {
        $contract->load(['client', 'deceased', 'services', 'user']);

        return Inertia::render('Contracts/Show', [
            'contract' => $contract,
        ]);
    }

    /**
     * Show the form for editing the specified contract.
     */
    public function edit(Contract $contract)
    {
        $contract->load(['client', 'deceased', 'services']);
        $services = Service::where('activo', true)->get();

        return Inertia::render('Contracts/Edit', [
            'contract' => $contract,
            'services' => $services,
        ]);
    }

    /**
     * Update the specified contract.
     */
    public function update(Request $request, Contract $contract)
    {
        // Validation and update logic
        return redirect()->route('contracts.index')
            ->with('success', 'Contrato actualizado exitosamente');
    }

    /**
     * Remove the specified contract.
     */
    public function destroy(Contract $contract)
    {
        $contract->delete();

        return redirect()->route('contracts.index')
            ->with('success', 'Contrato eliminado exitosamente');
    }
}

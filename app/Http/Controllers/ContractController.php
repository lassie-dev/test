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
                    'numero_contrato' => $contract->contract_number,
                    'tipo' => $contract->type === 'immediate_need' ? 'necesidad_inmediata' : 'necesidad_futura',
                    'estado' => match($contract->status) {
                        'quote' => 'cotizacion',
                        'contract' => 'contrato',
                        'completed' => 'finalizado',
                        'cancelled' => 'cancelado',
                        default => $contract->status
                    },
                    'cliente' => [
                        'id' => $contract->client->id,
                        'nombre' => $contract->client->name,
                        'rut' => $contract->client->rut,
                        'telefono' => $contract->client->phone,
                        'email' => $contract->client->email ?? null,
                    ],
                    'difunto' => $contract->deceased ? [
                        'id' => $contract->deceased->id,
                        'nombre' => $contract->deceased->name,
                        'fecha_fallecimiento' => $contract->deceased->death_date,
                        'lugar_fallecimiento' => $contract->deceased->death_place,
                    ] : null,
                    'servicios' => $contract->services->map(function ($service) {
                        return [
                            'servicio' => [
                                'id' => $service->id,
                                'nombre' => $service->name,
                                'descripcion' => $service->description,
                                'precio' => (float) $service->price,
                            ],
                            'cantidad' => $service->pivot->quantity,
                            'precio_unitario' => (float) $service->pivot->unit_price,
                            'subtotal' => (float) $service->pivot->subtotal,
                        ];
                    }),
                    'subtotal' => (float) $contract->subtotal,
                    'descuento_porcentaje' => (float) $contract->discount_percentage,
                    'descuento_monto' => (float) $contract->discount_amount,
                    'total' => (float) $contract->total,
                    'es_festivo' => $contract->is_holiday,
                    'es_nocturno' => $contract->is_night_shift,
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
        $services = Service::where('active', true)->get();

        return Inertia::render('Contracts/Create', [
            'services' => $services,
        ]);
    }

    /**
     * Store a newly created contract.
     */
    public function store(Request $request)
    {
        // Implementation would go here
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
        $services = Service::where('active', true)->get();

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
        // Implementation would go here
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

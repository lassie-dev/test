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
    public function index(Request $request)
    {
        $query = Contract::with(['client', 'deceased', 'services']);

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('contract_number', 'like', "%{$search}%")
                    ->orWhereHas('client', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('rut', 'like', "%{$search}%");
                    })
                    ->orWhereHas('deceased', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $status = match($request->status) {
                'cotizacion' => 'quote',
                'contrato' => 'contract',
                'finalizado' => 'completed',
                'cancelado' => 'cancelled',
                default => $request->status
            };
            $query->where('status', $status);
        }

        // Type filter
        if ($request->filled('type')) {
            $type = match($request->type) {
                'necesidad_inmediata' => 'immediate_need',
                'necesidad_futura' => 'future_need',
                default => $request->type
            };
            $query->where('type', $type);
        }

        $contracts = $query->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function ($contract) {
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
            'filters' => $request->only(['search', 'status', 'type']),
        ]);
    }

    /**
     * Show the form for creating a new contract.
     */
    public function create()
    {
        $services = Service::where('active', true)->get();
        $products = \App\Models\Product::where('is_active', true)->get();

        // Get all users for drivers and assistants
        // TODO: Filter by role once role system is implemented
        $allUsers = \App\Models\User::all(['id', 'name', 'email']);
        $drivers = $allUsers->map(fn($u) => ['id' => $u->id, 'name' => $u->name, 'email' => $u->email, 'role' => 'driver']);
        $assistants = $allUsers->map(fn($u) => ['id' => $u->id, 'name' => $u->name, 'email' => $u->email, 'role' => 'assistant']);

        return Inertia::render('Contracts/Create', [
            'services' => $services,
            'products' => $products,
            'drivers' => $drivers,
            'assistants' => $assistants,
        ]);
    }

    /**
     * Store a newly created contract.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // Contract fields
            'type' => 'required|in:necesidad_inmediata,necesidad_futura',
            'status' => 'required|in:cotizacion,contrato,finalizado,cancelado',
            'is_holiday' => 'boolean',
            'is_night_shift' => 'boolean',

            // Client fields
            'client_name' => 'required|string|max:255',
            'client_rut' => 'required|string|max:12|unique:clients,rut',
            'client_phone' => 'required|string|max:20',
            'client_email' => 'nullable|email|max:255',
            'client_address' => 'nullable|string|max:255',

            // Deceased fields (required for immediate need)
            'deceased_name' => 'required_if:type,necesidad_inmediata|string|max:255',
            'deceased_death_date' => 'required_if:type,necesidad_inmediata|date',
            'deceased_death_time' => 'nullable|date_format:H:i',
            'deceased_death_place' => 'nullable|string|max:255',
            'deceased_age' => 'nullable|integer|min:0',
            'deceased_cause_of_death' => 'nullable|string|max:255',

            // Services
            'services' => 'required|array|min:1',
            'services.*.service_id' => 'required|exists:services,id',
            'services.*.quantity' => 'required|integer|min:1',
            'services.*.unit_price' => 'required|numeric|min:0',

            // Products
            'products' => 'nullable|array',
            'products.*.product_id' => 'required|exists:products,id',
            'products.*.quantity' => 'required|integer|min:1',
            'products.*.unit_price' => 'required|numeric|min:0',

            'discount_percentage' => 'required|numeric|min:0|max:100',

            // Payment
            'payment_method' => 'required|in:cash,credit',
            'installments' => 'required_if:payment_method,credit|integer|min:1|max:12',
            'down_payment' => 'nullable|numeric|min:0',

            // Service details
            'service_location' => 'nullable|string|max:255',
            'service_datetime' => 'nullable|date',
            'special_requests' => 'nullable|string',

            // Staff assignment
            'assigned_driver_id' => 'nullable|exists:users,id',
            'assigned_assistant_id' => 'nullable|exists:users,id',
        ]);

        // Start transaction
        \DB::beginTransaction();

        try {
            // Create client
            $client = \App\Models\Client::create([
                'name' => $validated['client_name'],
                'rut' => $validated['client_rut'],
                'phone' => $validated['client_phone'],
                'email' => $validated['client_email'] ?? null,
                'address' => $validated['client_address'] ?? null,
            ]);

            // Create deceased if immediate need
            $deceasedId = null;
            if ($validated['type'] === 'necesidad_inmediata') {
                $deceased = \App\Models\Deceased::create([
                    'name' => $validated['deceased_name'],
                    'death_date' => $validated['deceased_death_date'],
                    'death_time' => $validated['deceased_death_time'] ?? null,
                    'death_place' => $validated['deceased_death_place'] ?? null,
                    'age' => $validated['deceased_age'] ?? null,
                    'cause_of_death' => $validated['deceased_cause_of_death'] ?? null,
                ]);
                $deceasedId = $deceased->id;
            }

            // Calculate totals
            $subtotal = 0;
            foreach ($validated['services'] as $service) {
                $subtotal += $service['quantity'] * $service['unit_price'];
            }

            // Add products to subtotal
            if (!empty($validated['products'])) {
                foreach ($validated['products'] as $product) {
                    $subtotal += $product['quantity'] * $product['unit_price'];
                }
            }

            $discountAmount = ($subtotal * $validated['discount_percentage']) / 100;
            $total = $subtotal - $discountAmount;

            // Calculate commission
            $commissionRate = 5; // Base 5%
            if ($validated['is_night_shift'] ?? false) $commissionRate += 2;
            if ($validated['is_holiday'] ?? false) $commissionRate += 3;
            $commissionAmount = ($total * $commissionRate) / 100;

            // Convert type to English
            $type = match($validated['type']) {
                'necesidad_inmediata' => 'immediate_need',
                'necesidad_futura' => 'future_need',
                default => $validated['type']
            };

            // Convert status to English
            $status = match($validated['status']) {
                'cotizacion' => 'quote',
                'contrato' => 'contract',
                'finalizado' => 'completed',
                'cancelado' => 'cancelled',
                default => $validated['status']
            };

            // Generate contract number
            $lastContract = Contract::latest('id')->first();
            $contractNumber = 'CTR-' . str_pad(($lastContract?->id ?? 0) + 1, 6, '0', STR_PAD_LEFT);

            // Create contract
            $contract = Contract::create([
                'contract_number' => $contractNumber,
                'type' => $type,
                'status' => $status,
                'client_id' => $client->id,
                'deceased_id' => $deceasedId,
                'user_id' => auth()->id(),
                'branch_id' => auth()->user()->branch_id ?? 1,
                'subtotal' => $subtotal,
                'discount_percentage' => $validated['discount_percentage'],
                'discount_amount' => $discountAmount,
                'total' => $total,
                'payment_method' => $validated['payment_method'],
                'installments' => $validated['installments'] ?? null,
                'down_payment' => $validated['down_payment'] ?? null,
                'service_location' => $validated['service_location'] ?? null,
                'service_datetime' => $validated['service_datetime'] ?? null,
                'special_requests' => $validated['special_requests'] ?? null,
                'assigned_driver_id' => $validated['assigned_driver_id'] ?? null,
                'assigned_assistant_id' => $validated['assigned_assistant_id'] ?? null,
                'commission_percentage' => $commissionRate,
                'commission_amount' => $commissionAmount,
                'is_holiday' => $validated['is_holiday'] ?? false,
                'is_night_shift' => $validated['is_night_shift'] ?? false,
            ]);

            // Attach services
            foreach ($validated['services'] as $service) {
                $contract->services()->attach($service['service_id'], [
                    'quantity' => $service['quantity'],
                    'unit_price' => $service['unit_price'],
                    'subtotal' => $service['quantity'] * $service['unit_price'],
                ]);
            }

            // Attach products and deduct inventory (only for immediate need)
            if (!empty($validated['products'])) {
                foreach ($validated['products'] as $product) {
                    $contract->products()->attach($product['product_id'], [
                        'quantity' => $product['quantity'],
                        'unit_price' => $product['unit_price'],
                        'subtotal' => $product['quantity'] * $product['unit_price'],
                    ]);

                    // Deduct from inventory ONLY for immediate need contracts
                    if ($type === 'immediate_need') {
                        $productModel = \App\Models\Product::find($product['product_id']);
                        $productModel->decrement('stock', $product['quantity']);
                    }
                }
            }

            // Create payment schedule for credit payments
            if ($validated['payment_method'] === 'credit' && $validated['installments'] > 0) {
                $remainingAmount = $total - ($validated['down_payment'] ?? 0);
                $monthlyPayment = $remainingAmount / $validated['installments'];

                for ($i = 1; $i <= $validated['installments']; $i++) {
                    \App\Models\Payment::create([
                        'contract_id' => $contract->id,
                        'payment_method' => 'credit',
                        'amount' => $monthlyPayment,
                        'payment_date' => null,
                        'due_date' => now()->addMonths($i),
                        'status' => 'pending',
                        'processed_by' => null,
                    ]);
                }
            }

            \DB::commit();

            return redirect()->route('contracts.index')
                ->with('success', 'Contrato creado exitosamente');

        } catch (\Exception $e) {
            \DB::rollBack();
            return back()
                ->withErrors(['error' => 'Error al crear el contrato: ' . $e->getMessage()])
                ->withInput();
        }
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

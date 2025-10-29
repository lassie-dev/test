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
                            ->orWhere('rut', 'like', "%{$search}%")
                            ->orWhere('phone', 'like', "%{$search}%");
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

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Total amount range filter
        if ($request->filled('total_min')) {
            $query->where('total', '>=', $request->total_min);
        }
        if ($request->filled('total_max')) {
            $query->where('total', '<=', $request->total_max);
        }

        // Payment method filter
        if ($request->filled('payment_method')) {
            $query->where('payment_method', $request->payment_method);
        }

        // Has deceased filter
        if ($request->filled('has_deceased')) {
            if ($request->has_deceased === 'yes') {
                $query->whereNotNull('deceased_id');
            } elseif ($request->has_deceased === 'no') {
                $query->whereNull('deceased_id');
            }
        }

        // Sort options
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        $allowedSorts = ['created_at', 'total', 'contract_number', 'updated_at'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        } else {
            $query->latest();
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

        return Inertia::render('features/contracts/pages/Index', [
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

        // Get directory data
        $churches = \App\Models\Church::orderBy('name')->get(['id', 'name', 'city', 'religion']);
        $cemeteries = \App\Models\Cemetery::orderBy('name')->get(['id', 'name', 'city', 'type']);
        $wakeRooms = \App\Models\WakeRoom::orderBy('name')->get(['id', 'name', 'funeral_home_name', 'city']);

        // Get active agreements
        $agreements = \App\Models\Agreement::where('status', 'active')->orderBy('company_name')->get(['id', 'company_name', 'code', 'discount_percentage']);

        return Inertia::render('features/contracts/pages/Create', [
            'services' => $services,
            'products' => $products,
            'drivers' => $drivers,
            'assistants' => $assistants,
            'churches' => $churches,
            'cemeteries' => $cemeteries,
            'wakeRooms' => $wakeRooms,
            'agreements' => $agreements,
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

            // Directory references
            'agreement_id' => 'nullable|exists:agreements,id',
            'church_id' => 'nullable|exists:churches,id',
            'cemetery_id' => 'nullable|exists:cemeteries,id',
            'wake_room_id' => 'nullable|exists:wake_rooms,id',
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
                'agreement_id' => $validated['agreement_id'] ?? null,
                'church_id' => $validated['church_id'] ?? null,
                'cemetery_id' => $validated['cemetery_id'] ?? null,
                'wake_room_id' => $validated['wake_room_id'] ?? null,
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
        $contract->load([
            'client',
            'deceased',
            'services',
            'products',
            'user',
            'assignedDriver',
            'assignedAssistant',
            'payments'
        ]);

        // Format contract data for frontend
        $contractData = [
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
                'direccion' => $contract->client->address ?? null,
            ],
            'difunto' => $contract->deceased ? [
                'id' => $contract->deceased->id,
                'nombre' => $contract->deceased->name,
                'fecha_fallecimiento' => $contract->deceased->death_date,
                'hora_fallecimiento' => $contract->deceased->death_time,
                'lugar_fallecimiento' => $contract->deceased->death_place,
                'edad' => $contract->deceased->age,
                'causa_fallecimiento' => $contract->deceased->cause_of_death,
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
            'productos' => $contract->products->map(function ($product) {
                return [
                    'producto' => [
                        'id' => $product->id,
                        'nombre' => $product->name,
                        'descripcion' => $product->description,
                        'precio' => (float) $product->price,
                    ],
                    'cantidad' => $product->pivot->quantity,
                    'precio_unitario' => (float) $product->pivot->unit_price,
                    'subtotal' => (float) $product->pivot->subtotal,
                ];
            }),
            'subtotal' => (float) $contract->subtotal,
            'descuento_porcentaje' => (float) $contract->discount_percentage,
            'descuento_monto' => (float) $contract->discount_amount,
            'total' => (float) $contract->total,
            'metodo_pago' => $contract->payment_method,
            'cuotas' => $contract->installments,
            'pie' => (float) $contract->down_payment,
            'ubicacion_servicio' => $contract->service_location,
            'fecha_hora_servicio' => $contract->service_datetime,
            'solicitudes_especiales' => $contract->special_requests,
            'conductor_asignado' => $contract->assignedDriver ? [
                'id' => $contract->assignedDriver->id,
                'nombre' => $contract->assignedDriver->name,
                'email' => $contract->assignedDriver->email,
            ] : null,
            'auxiliar_asignado' => $contract->assignedAssistant ? [
                'id' => $contract->assignedAssistant->id,
                'nombre' => $contract->assignedAssistant->name,
                'email' => $contract->assignedAssistant->email,
            ] : null,
            'porcentaje_comision' => (float) $contract->commission_percentage,
            'monto_comision' => (float) $contract->commission_amount,
            'es_festivo' => $contract->is_holiday,
            'es_nocturno' => $contract->is_night_shift,
            'secretaria' => [
                'id' => $contract->user->id,
                'nombre' => $contract->user->name,
                'email' => $contract->user->email,
            ],
            'pagos' => $contract->payments->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'monto' => (float) $payment->amount,
                    'fecha_pago' => $payment->payment_date,
                    'fecha_vencimiento' => $payment->due_date,
                    'estado' => $payment->status,
                    'metodo_pago' => $payment->payment_method,
                ];
            }),
            'created_at' => $contract->created_at,
            'updated_at' => $contract->updated_at,
        ];

        return Inertia::render('features/contracts/pages/Show', [
            'contract' => $contractData,
        ]);
    }

    /**
     * Show the form for editing the specified contract.
     */
    public function edit(Contract $contract)
    {
        $contract->load(['client', 'deceased', 'services']);
        $services = Service::where('active', true)->get();

        return Inertia::render('features/contracts/pages/Edit', [
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

    /**
     * Print quotation PDF
     */
    public function printQuotation(Contract $contract)
    {
        $contract->load(['client', 'deceased', 'services', 'products', 'user']);

        $pdf = \PDF::loadView('pdf.quotation', [
            'contract' => $contract
        ]);

        return $pdf->download('cotizacion_' . $contract->contract_number . '.pdf');
    }

    /**
     * Print contract PDF
     */
    public function printContract(Contract $contract)
    {
        $contract->load(['client', 'deceased', 'services', 'products', 'user']);

        $pdf = \PDF::loadView('pdf.quotation', [
            'contract' => $contract
        ]);

        return $pdf->download('contrato_' . $contract->contract_number . '.pdf');
    }

    /**
     * Print social media authorization form
     */
    public function printSocialMediaAuth(Contract $contract)
    {
        $contract->load(['client', 'deceased', 'user']);

        $pdf = \PDF::loadView('pdf.social-media-auth', [
            'contract' => $contract
        ]);

        return $pdf->download('autorizacion_redes_' . $contract->contract_number . '.pdf');
    }

    /**
     * Print payment receipt
     */
    public function printReceipt(Contract $contract, $paymentId = null)
    {
        $contract->load(['client', 'deceased', 'user']);

        // If specific payment ID provided, load that payment
        // Otherwise, create a receipt for the full contract
        $payment = $paymentId ? \App\Models\Payment::find($paymentId) : null;

        $pdf = \PDF::loadView('pdf.receipt', [
            'contract' => $contract,
            'payment' => $payment
        ]);

        return $pdf->download('recibo_' . $contract->contract_number . '.pdf');
    }

    /**
     * Bulk update status for multiple contracts
     */
    public function bulkUpdateStatus(Request $request)
    {
        $validated = $request->validate([
            'contract_ids' => 'required|array',
            'contract_ids.*' => 'exists:contracts,id',
            'status' => 'required|in:quote,contract,completed,cancelled',
        ]);

        $count = Contract::whereIn('id', $validated['contract_ids'])
            ->update(['status' => $validated['status']]);

        return redirect()->route('contracts.index')
            ->with('success', "Se actualizaron {$count} contrato(s) exitosamente.");
    }

    /**
     * Bulk delete multiple contracts
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'contract_ids' => 'required|array',
            'contract_ids.*' => 'exists:contracts,id',
        ]);

        $count = Contract::whereIn('id', $validated['contract_ids'])->delete();

        return redirect()->route('contracts.index')
            ->with('success', "Se eliminaron {$count} contrato(s) exitosamente.");
    }

    /**
     * Export contracts to Excel/CSV
     */
    public function export(Request $request)
    {
        $query = Contract::with(['client', 'deceased']);

        // Apply same filters as index
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

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $contracts = $query->get();

        // Generate CSV
        $filename = 'contratos_' . now()->format('Y-m-d_His') . '.csv';
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($contracts) {
            $file = fopen('php://output', 'w');

            // CSV Headers
            fputcsv($file, [
                'N° Contrato',
                'Tipo',
                'Estado',
                'Cliente',
                'RUT Cliente',
                'Teléfono',
                'Difunto',
                'Fecha Creación',
                'Subtotal',
                'Descuento %',
                'Total',
                'Método Pago',
            ]);

            // Data rows
            foreach ($contracts as $contract) {
                fputcsv($file, [
                    $contract->contract_number,
                    $contract->type === 'immediate_need' ? 'Necesidad Inmediata' : 'Necesidad Futura',
                    match($contract->status) {
                        'quote' => 'Cotización',
                        'contract' => 'Contrato',
                        'completed' => 'Finalizado',
                        'cancelled' => 'Cancelado',
                        default => $contract->status
                    },
                    $contract->client->name,
                    $contract->client->rut,
                    $contract->client->phone,
                    $contract->deceased ? $contract->deceased->name : 'N/A',
                    $contract->created_at->format('d/m/Y H:i'),
                    number_format($contract->subtotal, 0, ',', '.'),
                    $contract->discount_percentage,
                    number_format($contract->total, 0, ',', '.'),
                    $contract->payment_method ?? 'N/A',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export to Softland CSV format
     */
    public function exportSoftland(Request $request)
    {
        $contracts = Contract::with(['client'])
            ->whereBetween('created_at', [$request->start_date, $request->end_date])
            ->get();

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="softland_export_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function() use ($contracts) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF)); // UTF-8 BOM

            // Softland format: Fecha, Cuenta, Glosa, Debe, Haber, RUT
            fputcsv($file, ['Fecha', 'Cuenta', 'Glosa', 'Debe', 'Haber', 'RUT'], ';');

            foreach ($contracts as $contract) {
                fputcsv($file, [
                    $contract->created_at->format('d/m/Y'),
                    '410101', // Income account
                    'Contrato ' . $contract->contract_number,
                    '',
                    number_format($contract->total, 2, ',', ''),
                    str_replace(['.', '-'], '', $contract->client->rut ?? ''),
                ], ';');
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export to Nubox JSON format
     */
    public function exportNubox(Request $request)
    {
        $contracts = Contract::with(['client', 'services', 'products'])
            ->whereBetween('created_at', [$request->start_date, $request->end_date])
            ->get();

        $data = $contracts->map(function($contract) {
            return [
                'documentType' => 'invoice',
                'documentNumber' => $contract->contract_number,
                'date' => $contract->created_at->format('Y-m-d'),
                'customer' => [
                    'name' => $contract->client->name,
                    'taxId' => str_replace(['.', '-'], '', $contract->client->rut ?? ''),
                ],
                'items' => $contract->services->map(function($service) {
                    return [
                        'description' => $service->name,
                        'quantity' => $service->pivot->quantity,
                        'unitPrice' => $service->pivot->unit_price,
                        'total' => $service->pivot->subtotal,
                    ];
                })->toArray(),
                'totals' => [
                    'subtotal' => $contract->subtotal,
                    'discount' => $contract->discount_amount,
                    'total' => $contract->total,
                ],
            ];
        });

        return response()->json([
            'exportDate' => now()->format('Y-m-d H:i:s'),
            'totalDocuments' => $data->count(),
            'documents' => $data,
        ]);
    }

    /**
     * Convert future need contract to immediate need
     */
    public function convertToImmediate(Request $request, Contract $contract)
    {
        if ($contract->type !== 'necesidad_futura') {
            return redirect()->back()->with('error', 'Only future need contracts can be converted');
        }

        $validated = $request->validate([
            'deceased_name' => 'required|string|max:255',
            'deceased_death_date' => 'required|date',
            'deceased_death_time' => 'nullable|date_format:H:i',
            'deceased_death_place' => 'nullable|string|max:255',
            'deceased_age' => 'nullable|integer|min:0',
            'deceased_cause_of_death' => 'nullable|string|max:255',
            'service_datetime' => 'required|date',
            'assigned_driver_id' => 'nullable|exists:users,id',
            'assigned_assistant_id' => 'nullable|exists:users,id',
        ]);

        \DB::transaction(function() use ($contract, $validated) {
            // Create deceased record
            $deceased = \App\Models\Deceased::create([
                'name' => $validated['deceased_name'],
                'death_date' => $validated['deceased_death_date'],
                'death_time' => $validated['deceased_death_time'] ?? null,
                'death_place' => $validated['deceased_death_place'] ?? null,
                'age' => $validated['deceased_age'] ?? null,
                'cause_of_death' => $validated['deceased_cause_of_death'] ?? null,
            ]);

            // Update contract
            $contract->update([
                'type' => 'necesidad_inmediata',
                'deceased_id' => $deceased->id,
                'service_datetime' => $validated['service_datetime'],
                'assigned_driver_id' => $validated['assigned_driver_id'] ?? null,
                'assigned_assistant_id' => $validated['assigned_assistant_id'] ?? null,
            ]);

            // Deduct inventory for products
            foreach ($contract->products as $product) {
                $product->decrement('stock', $product->pivot->quantity);
            }
        });

        return redirect()->route('contracts.show', $contract)
            ->with('success', 'Contract converted to immediate need successfully');
    }
}

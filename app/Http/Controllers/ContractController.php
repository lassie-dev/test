<?php

namespace App\Http\Controllers;

use App\Models\Contract;
use App\Models\Service;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

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
        $services = Service::where('active', true)->with('category')->get()->map(function ($service) {
            return [
                'id' => $service->id,
                'nombre' => $service->name,
                'descripcion' => $service->description,
                'precio' => (float) $service->price,
                'category_id' => $service->category_id,
                'category' => $service->category,
            ];
        });

        $products = \App\Models\Product::where('is_active', true)->with('category')->get()->map(function ($product) {
            // Use getRelation() to access the category relationship (not the enum column)
            $categoryRelation = $product->getRelation('category');

            return [
                'id' => $product->id,
                'nombre' => $product->name,
                'descripcion' => $product->description,
                'precio' => (float) $product->price,
                'category' => $categoryRelation ? [
                    'id' => $categoryRelation->id,
                    'name' => $categoryRelation->name,
                    'slug' => $categoryRelation->slug,
                    'icon' => $categoryRelation->icon,
                ] : null,
                'stock' => $product->stock,
                'min_stock' => $product->min_stock,
                'is_active' => $product->is_active,
            ];
        });

        // Get active drivers and assistants from staff table
        $drivers = \App\Models\Staff::drivers()->get(['id', 'name', 'email', 'role']);
        $assistants = \App\Models\Staff::assistants()->get(['id', 'name', 'email', 'role']);

        // Get directory data
        $churches = \App\Models\Church::orderBy('name')->get(['id', 'name', 'city', 'religion']);
        $cemeteries = \App\Models\Cemetery::orderBy('name')->get(['id', 'name', 'city', 'type']);
        $wakeRooms = \App\Models\WakeRoom::orderBy('name')->get(['id', 'name', 'funeral_home_name', 'city']);

        // Get active agreements (only those currently valid)
        $agreements = \App\Models\Agreement::where('status', 'active')
            ->where('start_date', '<=', Carbon::now())  // Agreement has started
            ->where('end_date', '>=', Carbon::now())    // Agreement has not expired
            ->orderBy('company_name')
            ->get(['id', 'company_name', 'code', 'discount_percentage', 'company_pays_percentage', 'employee_pays_percentage']);

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
        \Log::info('Contract store method called', [
            'user_id' => auth()->id(),
            'has_services' => $request->has('services'),
            'services_count' => is_array($request->input('services')) ? count($request->input('services')) : 0,
        ]);

        $validated = $request->validate([
            // Contract fields
            'type' => 'required|in:necesidad_inmediata,necesidad_futura',
            'status' => 'required|in:cotizacion,contrato,finalizado,cancelado',
            'is_holiday' => 'boolean',
            'is_night_shift' => 'boolean',

            // Client fields
            'client_name' => 'required|string|max:255',
            'client_rut' => 'required|string|max:12',
            'client_phone' => 'required|string|max:20',
            'client_email' => 'nullable|email|max:255',
            'client_address' => 'nullable|string|max:255',
            'client_relationship_to_deceased' => 'nullable|string|max:255',
            'client_occupation' => 'nullable|string|max:255',

            // Deceased fields (required for immediate need)
            'deceased_name' => 'required_if:type,necesidad_inmediata|string|max:255',
            'deceased_death_date' => 'required_if:type,necesidad_inmediata|date',
            'deceased_death_time' => 'nullable|date_format:H:i',
            'deceased_death_place' => 'nullable|string|max:255',
            'deceased_age' => 'nullable|integer|min:0',
            'deceased_cause_of_death' => 'nullable|string|max:255',
            'deceased_education_level' => 'nullable|string|max:255',
            'deceased_profession' => 'nullable|string|max:255',
            'deceased_marital_status' => 'nullable|string|max:255',
            'deceased_religion' => 'nullable|string|max:255',

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
            'reception_location' => 'nullable|string|max:255',
            'coffin_model' => 'nullable|string|max:255',
            'cemetery_sector' => 'nullable|string|max:255',
            'procession_details' => 'nullable|string',
            'additional_staff_notes' => 'nullable|string',

            // Staff assignment
            'assigned_driver_id' => 'nullable|exists:staff,id',
            'assigned_assistant_id' => 'nullable|exists:staff,id',
            'assigned_vehicle_id' => 'nullable|exists:staff,id',

            // Directory references
            'agreement_id' => [
                'nullable',
                'exists:agreements,id',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $agreement = \App\Models\Agreement::find($value);
                        if (!$agreement) {
                            $fail('The selected agreement does not exist.');
                        } elseif (!$agreement->isActive()) {
                            $fail('The selected agreement is no longer valid or has expired.');
                        }
                    }
                }
            ],
            'church_id' => 'nullable|exists:churches,id',
            'cemetery_id' => 'nullable|exists:cemeteries,id',
            'wake_room_id' => 'nullable|exists:wake_rooms,id',
        ]);

        // Start transaction
        \DB::beginTransaction();

        try {
            // Find existing client by RUT or create new one
            $client = \App\Models\Client::firstOrCreate(
                ['rut' => $validated['client_rut']],
                [
                    'name' => $validated['client_name'],
                    'phone' => $validated['client_phone'],
                    'email' => $validated['client_email'] ?? null,
                    'address' => $validated['client_address'] ?? null,
                    'relationship_to_deceased' => $validated['client_relationship_to_deceased'] ?? null,
                    'occupation' => $validated['client_occupation'] ?? null,
                ]
            );

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
                    'education_level' => $validated['deceased_education_level'] ?? null,
                    'profession' => $validated['deceased_profession'] ?? null,
                    'marital_status' => $validated['deceased_marital_status'] ?? null,
                    'religion' => $validated['deceased_religion'] ?? null,
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

            // Generate unique contract number (excluding soft-deleted contracts)
            // Get all existing contract numbers and extract the numeric parts
            $existingNumbers = Contract::withTrashed()
                ->pluck('contract_number')
                ->map(function($number) {
                    if (preg_match('/CTR-(\d+)/', $number, $matches)) {
                        return (int) $matches[1];
                    }
                    return 0;
                })
                ->filter()
                ->sort()
                ->values();

            // Find the highest number and increment
            $nextNumber = $existingNumbers->isEmpty() ? 1 : $existingNumbers->last() + 1;
            $contractNumber = 'CTR-' . str_pad($nextNumber, 6, '0', STR_PAD_LEFT);

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
                'reception_location' => $validated['reception_location'] ?? null,
                'coffin_model' => $validated['coffin_model'] ?? null,
                'cemetery_sector' => $validated['cemetery_sector'] ?? null,
                'procession_details' => $validated['procession_details'] ?? null,
                'additional_staff_notes' => $validated['additional_staff_notes'] ?? null,
                'assigned_driver_id' => $validated['assigned_driver_id'] ?? null,
                'assigned_assistant_id' => $validated['assigned_assistant_id'] ?? null,
                'assigned_vehicle_id' => $validated['assigned_vehicle_id'] ?? null,
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

            \Log::info('Contract created successfully', [
                'contract_id' => $contract->id,
                'contract_number' => $contract->contract_number,
            ]);

            return redirect()->route('contracts.index')
                ->with('success', 'Contrato creado exitosamente');

        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Contract creation failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => auth()->id(),
                'data' => $request->except(['client_rut'])
            ]);
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
            'assignedVehicle',
            'payments',
            'agreement'
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
                'parentesco' => $contract->client->relationship_to_deceased ?? null,
                'ocupacion' => $contract->client->occupation ?? null,
            ],
            'difunto' => $contract->deceased ? [
                'id' => $contract->deceased->id,
                'nombre' => $contract->deceased->name,
                'fecha_fallecimiento' => $contract->deceased->death_date,
                'hora_fallecimiento' => $contract->deceased->death_time,
                'lugar_fallecimiento' => $contract->deceased->death_place,
                'edad' => $contract->deceased->age,
                'causa_fallecimiento' => $contract->deceased->cause_of_death,
                'nivel_estudio' => $contract->deceased->education_level,
                'profesion' => $contract->deceased->profession,
                'estado_civil' => $contract->deceased->marital_status,
                'religion' => $contract->deceased->religion,
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
            'ubicacion_recepcion' => $contract->reception_location,
            'modelo_ataud' => $contract->coffin_model,
            'sector_cementerio' => $contract->cemetery_sector,
            'detalles_cortejo' => $contract->procession_details,
            'notas_personal_adicional' => $contract->additional_staff_notes,
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
            'vehiculo_asignado' => $contract->assignedVehicle ? [
                'id' => $contract->assignedVehicle->id,
                'nombre' => $contract->assignedVehicle->name,
                'email' => $contract->assignedVehicle->email,
            ] : null,
            'porcentaje_comision' => (float) $contract->commission_percentage,
            'monto_comision' => (float) $contract->commission_amount,
            'es_festivo' => $contract->is_holiday,
            'es_nocturno' => $contract->is_night_shift,
            'convenio' => $contract->agreement ? [
                'id' => $contract->agreement->id,
                'nombre_empresa' => $contract->agreement->company_name,
                'codigo' => $contract->agreement->code,
                'empresa_paga_porcentaje' => (float) $contract->agreement->company_pays_percentage,
                'empleado_paga_porcentaje' => (float) $contract->agreement->employee_pays_percentage,
            ] : null,
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
        // Load all relationships needed for editing
        $contract->load([
            'client',
            'deceased',
            'services',
            'products',
            'assignedDriver',
            'assignedAssistant',
            'assignedVehicle',
            'agreement',
            'church',
            'cemetery',
            'wakeRoom',
        ]);

        // Get all available services and products
        $services = Service::where('active', true)->with('category')->get()->map(function ($service) {
            return [
                'id' => $service->id,
                'nombre' => $service->name,
                'descripcion' => $service->description,
                'precio' => (float) $service->price,
                'category_id' => $service->category_id,
                'category' => $service->category,
            ];
        });

        $products = \App\Models\Product::where('is_active', true)->with('category')->get()->map(function ($product) {
            // Use getRelation() to access the category relationship (not the enum column)
            $categoryRelation = $product->getRelation('category');

            return [
                'id' => $product->id,
                'nombre' => $product->name,
                'descripcion' => $product->description,
                'precio' => (float) $product->price,
                'category' => $categoryRelation ? [
                    'id' => $categoryRelation->id,
                    'name' => $categoryRelation->name,
                    'slug' => $categoryRelation->slug,
                    'icon' => $categoryRelation->icon,
                ] : null,
                'stock' => $product->stock,
                'min_stock' => $product->min_stock,
                'is_active' => $product->is_active,
            ];
        });

        // Get active drivers and assistants from staff table
        $drivers = \App\Models\Staff::drivers()->get(['id', 'name', 'email', 'role']);
        $assistants = \App\Models\Staff::assistants()->get(['id', 'name', 'email', 'role']);

        // Get directory data
        $churches = \App\Models\Church::orderBy('name')->get(['id', 'name', 'city', 'religion']);
        $cemeteries = \App\Models\Cemetery::orderBy('name')->get(['id', 'name', 'city', 'type']);
        $wakeRooms = \App\Models\WakeRoom::orderBy('name')->get(['id', 'name', 'funeral_home_name', 'city']);

        // Get active agreements (only those currently valid)
        $agreements = \App\Models\Agreement::where('status', 'active')
            ->where('start_date', '<=', Carbon::now())  // Agreement has started
            ->where('end_date', '>=', Carbon::now())    // Agreement has not expired
            ->orderBy('company_name')
            ->get(['id', 'company_name', 'code', 'discount_percentage', 'company_pays_percentage', 'employee_pays_percentage']);

        return Inertia::render('features/contracts/pages/Edit', [
            'contract' => $contract,
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
     * Update the specified contract.
     */
    public function update(Request $request, Contract $contract)
    {
        \Log::info('Contract update method called', [
            'user_id' => auth()->id(),
            'contract_id' => $contract->id,
            'has_services' => $request->has('services'),
            'services_count' => is_array($request->input('services')) ? count($request->input('services')) : 0,
        ]);

        $validated = $request->validate([
            // Contract fields
            'type' => 'required|in:necesidad_inmediata,necesidad_futura',
            'status' => 'required|in:cotizacion,contrato,finalizado,cancelado',
            'is_holiday' => 'boolean',
            'is_night_shift' => 'boolean',

            // Client fields
            'client_name' => 'required|string|max:255',
            'client_rut' => 'required|string|max:12',
            'client_phone' => 'required|string|max:20',
            'client_email' => 'nullable|email|max:255',
            'client_address' => 'nullable|string|max:255',
            'client_relationship_to_deceased' => 'nullable|string|max:255',
            'client_occupation' => 'nullable|string|max:255',

            // Deceased fields (required for immediate need)
            'deceased_name' => 'required_if:type,necesidad_inmediata|string|max:255',
            'deceased_death_date' => 'required_if:type,necesidad_inmediata|date',
            'deceased_death_time' => 'nullable|date_format:H:i',
            'deceased_death_place' => 'nullable|string|max:255',
            'deceased_age' => 'nullable|integer|min:0',
            'deceased_cause_of_death' => 'nullable|string|max:255',
            'deceased_education_level' => 'nullable|string|max:255',
            'deceased_profession' => 'nullable|string|max:255',
            'deceased_marital_status' => 'nullable|string|max:255',
            'deceased_religion' => 'nullable|string|max:255',

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
            'reception_location' => 'nullable|string|max:255',
            'coffin_model' => 'nullable|string|max:255',
            'cemetery_sector' => 'nullable|string|max:255',
            'procession_details' => 'nullable|string',
            'additional_staff_notes' => 'nullable|string',

            // Staff assignment
            'assigned_driver_id' => 'nullable|exists:staff,id',
            'assigned_assistant_id' => 'nullable|exists:staff,id',
            'assigned_vehicle_id' => 'nullable|exists:staff,id',

            // Directory references
            'agreement_id' => [
                'nullable',
                'exists:agreements,id',
                function ($attribute, $value, $fail) {
                    if ($value) {
                        $agreement = \App\Models\Agreement::find($value);
                        if (!$agreement) {
                            $fail('The selected agreement does not exist.');
                        } elseif (!$agreement->isActive()) {
                            $fail('The selected agreement is no longer valid or has expired.');
                        }
                    }
                }
            ],
            'church_id' => 'nullable|exists:churches,id',
            'cemetery_id' => 'nullable|exists:cemeteries,id',
            'wake_room_id' => 'nullable|exists:wake_rooms,id',
        ]);

        // Start transaction
        \DB::beginTransaction();

        try {
            // Update or create client
            $client = \App\Models\Client::updateOrCreate(
                ['rut' => $validated['client_rut']],
                [
                    'name' => $validated['client_name'],
                    'phone' => $validated['client_phone'],
                    'email' => $validated['client_email'] ?? null,
                    'address' => $validated['client_address'] ?? null,
                    'relationship_to_deceased' => $validated['client_relationship_to_deceased'] ?? null,
                    'occupation' => $validated['client_occupation'] ?? null,
                ]
            );

            // Update or create deceased if immediate need
            $deceasedId = null;
            if ($validated['type'] === 'necesidad_inmediata') {
                if ($contract->deceased_id) {
                    // Update existing deceased
                    $contract->deceased->update([
                        'name' => $validated['deceased_name'],
                        'death_date' => $validated['deceased_death_date'],
                        'death_time' => $validated['deceased_death_time'] ?? null,
                        'death_place' => $validated['deceased_death_place'] ?? null,
                        'age' => $validated['deceased_age'] ?? null,
                        'cause_of_death' => $validated['deceased_cause_of_death'] ?? null,
                        'education_level' => $validated['deceased_education_level'] ?? null,
                        'profession' => $validated['deceased_profession'] ?? null,
                        'marital_status' => $validated['deceased_marital_status'] ?? null,
                        'religion' => $validated['deceased_religion'] ?? null,
                    ]);
                    $deceasedId = $contract->deceased_id;
                } else {
                    // Create new deceased
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

            // Update contract
            $contract->update([
                'type' => $type,
                'status' => $status,
                'client_id' => $client->id,
                'deceased_id' => $deceasedId,
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
                'reception_location' => $validated['reception_location'] ?? null,
                'coffin_model' => $validated['coffin_model'] ?? null,
                'cemetery_sector' => $validated['cemetery_sector'] ?? null,
                'procession_details' => $validated['procession_details'] ?? null,
                'additional_staff_notes' => $validated['additional_staff_notes'] ?? null,
                'assigned_driver_id' => $validated['assigned_driver_id'] ?? null,
                'assigned_assistant_id' => $validated['assigned_assistant_id'] ?? null,
                'assigned_vehicle_id' => $validated['assigned_vehicle_id'] ?? null,
                'commission_percentage' => $commissionRate,
                'commission_amount' => $commissionAmount,
                'is_holiday' => $validated['is_holiday'] ?? false,
                'is_night_shift' => $validated['is_night_shift'] ?? false,
            ]);

            // Sync services - detach old and attach new
            $contract->services()->detach();
            foreach ($validated['services'] as $service) {
                $contract->services()->attach($service['service_id'], [
                    'quantity' => $service['quantity'],
                    'unit_price' => $service['unit_price'],
                    'subtotal' => $service['quantity'] * $service['unit_price'],
                ]);
            }

            // Sync products - detach old and attach new
            // Note: We don't adjust inventory on edit, only on initial creation
            $contract->products()->detach();
            if (!empty($validated['products'])) {
                foreach ($validated['products'] as $product) {
                    $contract->products()->attach($product['product_id'], [
                        'quantity' => $product['quantity'],
                        'unit_price' => $product['unit_price'],
                        'subtotal' => $product['quantity'] * $product['unit_price'],
                    ]);
                }
            }

            // Update payment schedule if payment method changed to credit
            if ($validated['payment_method'] === 'credit' && $validated['installments'] > 0) {
                // Delete existing payment schedule
                \App\Models\Payment::where('contract_id', $contract->id)->delete();

                // Create new payment schedule
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
            } elseif ($validated['payment_method'] === 'cash') {
                // If changed to cash, remove payment schedule
                \App\Models\Payment::where('contract_id', $contract->id)->delete();
            }

            \DB::commit();

            \Log::info('Contract updated successfully', [
                'contract_id' => $contract->id,
                'contract_number' => $contract->contract_number,
            ]);

            return redirect()->route('contracts.show', $contract->id)
                ->with('success', 'Contrato actualizado exitosamente');

        } catch (\Exception $e) {
            \DB::rollBack();
            \Log::error('Contract update failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => auth()->id(),
                'contract_id' => $contract->id,
                'data' => $request->except(['client_rut'])
            ]);
            return back()
                ->withErrors(['error' => 'Error al actualizar el contrato: ' . $e->getMessage()])
                ->withInput();
        }
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
        $contract->load([
            'client',
            'deceased',
            'services',
            'products',
            'user',
            'agreement',
            'church',
            'cemetery',
            'wakeRoom',
            'assignedDriver',
            'assignedAssistant',
            'assignedVehicle'
        ]);

        $pdf = \PDF::loadView('pdf.contract', [
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
     * Export to Softland CSV format (Chilean accounting software)
     */
    public function exportSoftland(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $contracts = Contract::with(['client'])
            ->where('status', '!=', 'cancelado')
            ->whereBetween('created_at', [$request->start_date, $request->end_date])
            ->orderBy('created_at')
            ->get();

        $filename = 'Softland_Export_' . now()->format('Y-m-d_His') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $callback = function() use ($contracts) {
            $file = fopen('php://output', 'w');
            fprintf($file, chr(0xEF).chr(0xBB).chr(0xBF)); // UTF-8 BOM

            // Softland format as per logic.md:
            // Fecha,TipoDoc,NumeroDoc,RutCliente,NombreCliente,Neto,IVA,Total,CentroCosto,CuentaContable,Glosa
            fputcsv($file, [
                'Fecha',
                'TipoDoc',
                'NumeroDoc',
                'RutCliente',
                'NombreCliente',
                'Neto',
                'IVA',
                'Total',
                'CentroCosto',
                'CuentaContable',
                'Glosa'
            ]);

            foreach ($contracts as $contract) {
                // Calculate values for Chilean IVA (19%)
                $total = $contract->total;
                $neto = round($total / 1.19, 0);
                $iva = $total - $neto;

                fputcsv($file, [
                    $contract->created_at->format('Y-m-d'),
                    'BOL', // Boleta
                    $contract->contract_number,
                    str_replace(['.', '-'], '', $contract->client->rut ?? ''),
                    $contract->client->name ?? '',
                    $neto,
                    $iva,
                    $total,
                    'VEN-001', // Centro de costo: Ventas
                    '110101', // Cuenta contable: Ingresos por servicios
                    'Contrato funerario - ' . ($contract->deceased->name ?? 'N/A'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Export to Nubox JSON format (Chilean accounting software)
     */
    public function exportNubox(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        $contracts = Contract::with(['client', 'deceased', 'services', 'products'])
            ->where('status', '!=', 'cancelado')
            ->whereBetween('created_at', [$request->start_date, $request->end_date])
            ->orderBy('created_at')
            ->get();

        // Build Nubox format as per logic.md
        $ventas = $contracts->map(function($contract) {
            $total = $contract->total;
            $neto = round($total / 1.19, 0);
            $iva = $total - $neto;

            // Build items array from services and products
            $items = [];

            // Add services
            foreach ($contract->services as $service) {
                $items[] = [
                    'descripcion' => $service->name,
                    'cantidad' => $service->pivot->quantity ?? 1,
                    'precio_unitario' => $service->pivot->unit_price ?? 0,
                    'subtotal' => $service->pivot->subtotal ?? 0,
                ];
            }

            // Add products
            foreach ($contract->products as $product) {
                $items[] = [
                    'descripcion' => $product->name,
                    'cantidad' => $product->pivot->quantity ?? 1,
                    'precio_unitario' => $product->pivot->unit_price ?? 0,
                    'subtotal' => $product->pivot->subtotal ?? 0,
                ];
            }

            return [
                'fecha' => $contract->created_at->format('Y-m-d'),
                'tipo_documento' => 'boleta',
                'numero' => $contract->contract_number,
                'cliente_rut' => str_replace(['.', '-'], '', $contract->client->rut ?? ''),
                'cliente_nombre' => $contract->client->name ?? '',
                'neto' => $neto,
                'iva' => $iva,
                'total' => $total,
                'items' => $items,
                'metodo_pago' => $contract->payment_method === 'contado' ? 'efectivo' : 'credito',
                'notas' => 'Contrato funerario - ' . ($contract->deceased->name ?? 'N/A'),
            ];
        });

        $data = [
            'empresa_rut' => config('app.company_rut', ''),
            'periodo' => Carbon::parse($request->start_date)->format('Y-m'),
            'fecha_export' => now()->format('Y-m-d H:i:s'),
            'total_documentos' => $ventas->count(),
            'ventas' => $ventas,
        ];

        $filename = 'Nubox_Export_' . now()->format('Y-m-d_His') . '.json';

        return response()->json($data)
            ->header('Content-Disposition', "attachment; filename=\"{$filename}\"");
    }

    /**
     * Generate and download contract document in DOCX format
     */
    public function generateDocument(Contract $contract)
    {
        $contract->load(['client', 'deceased', 'services', 'products', 'user']);

        // Load the template
        $templatePath = public_path('contract.docx');
        $templateProcessor = new \PhpOffice\PhpWord\TemplateProcessor($templatePath);

        // Get contract data
        $contractNumber = str_replace('CTR-', '', $contract->contract_number);
        $createdDate = $contract->created_at->format('d-m-Y');
        $createdTime = $contract->created_at->format('H:i');

        // Replace header values
        $templateProcessor->setValue('contract_number', $contractNumber);
        $templateProcessor->setValue('fecha', $createdDate);
        $templateProcessor->setValue('hora', $createdTime);

        // Client information
        $templateProcessor->setValue('client_name', $contract->client->name ?? '');
        $templateProcessor->setValue('client_rut', $contract->client->rut ?? '');
        $templateProcessor->setValue('client_phone', $contract->client->phone ?? '');
        $templateProcessor->setValue('client_address', $contract->client->address ?? '');
        $templateProcessor->setValue('client_occupation', $contract->client->occupation ?? '');
        $templateProcessor->setValue('client_relationship', $contract->client->relationship_to_deceased ?? '');

        // Agreement information
        if ($contract->agreement) {
            $templateProcessor->setValue('company_name', $contract->agreement->company_name ?? '');
            $templateProcessor->setValue('company_rut', $contract->agreement->code ?? '');
            $templateProcessor->setValue('company_address', '');
            $templateProcessor->setValue('company_activity', '');
            $templateProcessor->setValue('company_email', '');
        } else {
            $templateProcessor->setValue('company_name', '');
            $templateProcessor->setValue('company_rut', '');
            $templateProcessor->setValue('company_address', '');
            $templateProcessor->setValue('company_activity', '');
            $templateProcessor->setValue('company_email', '');
        }

        // Deceased information
        if ($contract->deceased) {
            $templateProcessor->setValue('deceased_name', $contract->deceased->name ?? '');
            $templateProcessor->setValue('deceased_rut', ''); // Not in deceased table
            $templateProcessor->setValue('deceased_address', $contract->deceased->death_place ?? '');
            $templateProcessor->setValue('deceased_education', $contract->deceased->education_level ?? '');
            $templateProcessor->setValue('deceased_profession', $contract->deceased->profession ?? '');
            $templateProcessor->setValue('deceased_marital_status', $contract->deceased->marital_status ?? '');
            $templateProcessor->setValue('deceased_religion', $contract->deceased->religion ?? '');
        } else {
            $templateProcessor->setValue('deceased_name', '');
            $templateProcessor->setValue('deceased_rut', '');
            $templateProcessor->setValue('deceased_address', '');
            $templateProcessor->setValue('deceased_education', '');
            $templateProcessor->setValue('deceased_profession', '');
            $templateProcessor->setValue('deceased_marital_status', '');
            $templateProcessor->setValue('deceased_religion', '');
        }

        // Service details
        $templateProcessor->setValue('reception_location', $contract->reception_location ?? '');
        $templateProcessor->setValue('cemetery', $contract->cemetery ? $contract->cemetery->name : '');
        $templateProcessor->setValue('wake_location', $contract->wakeRoom ? $contract->wakeRoom->name : '');
        $templateProcessor->setValue('wake_address', $contract->service_location ?? '');
        $templateProcessor->setValue('coffin_model', $contract->coffin_model ?? '');
        $templateProcessor->setValue('funeral_date', $contract->service_datetime ? Carbon::parse($contract->service_datetime)->format('d-m-Y') : '');
        $templateProcessor->setValue('installer', ''); // Not in contract table
        $templateProcessor->setValue('arrival_time', $contract->service_datetime ? Carbon::parse($contract->service_datetime)->format('H:i') : '');
        $templateProcessor->setValue('sector', $contract->cemetery_sector ?? '');
        $templateProcessor->setValue('departure_time', ''); // Not in contract table
        $templateProcessor->setValue('cortejo', $contract->procession_details ?? '');
        $templateProcessor->setValue('refuerzo', ''); // Not in contract table
        $templateProcessor->setValue('auto', $contract->assignedVehicle ? $contract->assignedVehicle->name : '');

        // Observations
        $observations = $contract->special_requests ?? '';
        if ($contract->additional_staff_notes) {
            $observations .= "\n" . $contract->additional_staff_notes;
        }
        $templateProcessor->setValue('observations', $observations);

        // Coordinator
        $templateProcessor->setValue('coordinator', $contract->user->name ?? '');

        // Generate the document
        $filename = 'contrato_' . $contract->contract_number . '_' . now()->format('Y-m-d') . '.docx';
        $tempFile = storage_path('app/temp/' . $filename);

        // Create temp directory if it doesn't exist
        if (!file_exists(storage_path('app/temp'))) {
            mkdir(storage_path('app/temp'), 0755, true);
        }

        $templateProcessor->saveAs($tempFile);

        return response()->download($tempFile, $filename)->deleteFileAfterSend(true);
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

<?php

namespace App\Http\Controllers;

use App\Models\Staff;
use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffController extends Controller
{
    /**
     * Display a listing of staff members.
     */
    public function index(Request $request)
    {
        $query = Staff::query()->with('branch');

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('rut', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Role filter
        if ($request->filled('role') && $request->role) {
            $query->where('role', $request->role);
        }

        // Status filter
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }

        // Branch filter
        if ($request->filled('branch') && $request->branch) {
            $query->where('branch_id', $request->branch);
        }

        $staff = $query->latest()
            ->paginate(15)
            ->withQueryString()
            ->through(function ($member) {
                return [
                    'id' => $member->id,
                    'name' => $member->name,
                    'rut' => $member->rut,
                    'role' => $member->role,
                    'role_name' => $member->role_name,
                    'email' => $member->email,
                    'phone' => $member->phone,
                    'address' => $member->address,
                    'hire_date' => $member->hire_date->format('Y-m-d'),
                    'base_salary' => (float) $member->base_salary,
                    'bank_account' => $member->bank_account,
                    'bank_name' => $member->bank_name,
                    'emergency_contact_name' => $member->emergency_contact_name,
                    'emergency_contact_phone' => $member->emergency_contact_phone,
                    'vehicle_plate' => $member->vehicle_plate,
                    'vehicle_model' => $member->vehicle_model,
                    'is_active' => $member->is_active,
                    'branch' => $member->branch ? [
                        'id' => $member->branch->id,
                        'name' => $member->branch->name,
                    ] : null,
                    'notes' => $member->notes,
                    'created_at' => $member->created_at->format('Y-m-d H:i:s'),
                ];
            });

        // Get branches for filter
        $branches = Branch::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('features/staff/pages/Index', [
            'staff' => $staff,
            'branches' => $branches,
            'filters' => [
                'search' => $request->search,
                'role' => $request->role,
                'status' => $request->status,
                'branch' => $request->branch,
            ],
        ]);
    }

    /**
     * Show the form for creating a new staff member.
     */
    public function create()
    {
        $branches = Branch::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('features/staff/pages/Create', [
            'branches' => $branches,
        ]);
    }

    /**
     * Store a newly created staff member in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rut' => 'required|string|max:12|unique:staff,rut',
            'role' => 'required|in:secretaria,conductor,auxiliar,administrador,propietario',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
            'hire_date' => 'required|date',
            'base_salary' => 'required|numeric|min:0',
            'bank_account' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'vehicle_plate' => 'nullable|string|max:10',
            'vehicle_model' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'branch_id' => 'nullable|exists:branches,id',
            'notes' => 'nullable|string',
        ]);

        Staff::create($validated);

        return redirect()->route('staff.index')
            ->with('success', 'Personal creado exitosamente.');
    }

    /**
     * Display the specified staff member.
     */
    public function show(Staff $staff)
    {
        $staff->load('branch');

        return Inertia::render('features/staff/pages/Show', [
            'staffMember' => [
                'id' => $staff->id,
                'name' => $staff->name,
                'rut' => $staff->rut,
                'role' => $staff->role,
                'role_name' => $staff->role_name,
                'email' => $staff->email,
                'phone' => $staff->phone,
                'address' => $staff->address,
                'hire_date' => $staff->hire_date->format('Y-m-d'),
                'base_salary' => (float) $staff->base_salary,
                'bank_account' => $staff->bank_account,
                'bank_name' => $staff->bank_name,
                'emergency_contact_name' => $staff->emergency_contact_name,
                'emergency_contact_phone' => $staff->emergency_contact_phone,
                'vehicle_plate' => $staff->vehicle_plate,
                'vehicle_model' => $staff->vehicle_model,
                'is_active' => $staff->is_active,
                'branch' => $staff->branch ? [
                    'id' => $staff->branch->id,
                    'name' => $staff->branch->name,
                ] : null,
                'notes' => $staff->notes,
                'created_at' => $staff->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $staff->updated_at->format('Y-m-d H:i:s'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified staff member.
     */
    public function edit(Staff $staff)
    {
        $branches = Branch::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('features/staff/pages/Edit', [
            'staffMember' => [
                'id' => $staff->id,
                'name' => $staff->name,
                'rut' => $staff->rut,
                'role' => $staff->role,
                'email' => $staff->email,
                'phone' => $staff->phone,
                'address' => $staff->address,
                'hire_date' => $staff->hire_date->format('Y-m-d'),
                'base_salary' => (float) $staff->base_salary,
                'bank_account' => $staff->bank_account,
                'bank_name' => $staff->bank_name,
                'emergency_contact_name' => $staff->emergency_contact_name,
                'emergency_contact_phone' => $staff->emergency_contact_phone,
                'vehicle_plate' => $staff->vehicle_plate,
                'vehicle_model' => $staff->vehicle_model,
                'is_active' => $staff->is_active,
                'branch_id' => $staff->branch_id,
                'notes' => $staff->notes,
            ],
            'branches' => $branches,
        ]);
    }

    /**
     * Update the specified staff member in storage.
     */
    public function update(Request $request, Staff $staff)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'rut' => 'required|string|max:12|unique:staff,rut,' . $staff->id,
            'role' => 'required|in:secretaria,conductor,auxiliar,administrador,propietario',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'nullable|string',
            'hire_date' => 'required|date',
            'base_salary' => 'required|numeric|min:0',
            'bank_account' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'emergency_contact_name' => 'nullable|string|max:255',
            'emergency_contact_phone' => 'nullable|string|max:20',
            'vehicle_plate' => 'nullable|string|max:10',
            'vehicle_model' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'branch_id' => 'nullable|exists:branches,id',
            'notes' => 'nullable|string',
        ]);

        $staff->update($validated);

        return redirect()->route('staff.index')
            ->with('success', 'Personal actualizado exitosamente.');
    }

    /**
     * Remove the specified staff member from storage.
     */
    public function destroy(Staff $staff)
    {
        // Check if staff is assigned to any contracts
        $assignedContracts = $staff->contractsAsDriver()->count()
            + $staff->contractsAsAssistant()->count()
            + $staff->contractsCreated()->count();

        if ($assignedContracts > 0) {
            return back()->with('error', 'No se puede eliminar el personal porque está asignado a ' . $assignedContracts . ' contrato(s).');
        }

        $staff->delete();

        return redirect()->route('staff.index')
            ->with('success', 'Personal eliminado exitosamente.');
    }
}

<?php

namespace Database\Seeders;

use App\Models\Staff;
use App\Models\Branch;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StaffSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get branches for assignment
        $branches = Branch::all();
        $mainBranch = $branches->where('is_headquarters', true)->first();

        $staff = [
            // Secretaries
            [
                'name' => 'María González Pérez',
                'rut' => '15234567-8',
                'role' => 'secretaria',
                'email' => 'maria.gonzalez@funeraria.cl',
                'phone' => '+56 9 8765 4321',
                'address' => 'Av. Los Pinos 123, Santiago',
                'hire_date' => '2020-01-15',
                'base_salary' => 650000.00,
                'bank_account' => '1234567890',
                'bank_name' => 'Banco de Chile',
                'emergency_contact_name' => 'Pedro González',
                'emergency_contact_phone' => '+56 9 8765 4322',
                'vehicle_plate' => null,
                'vehicle_model' => null,
                'is_active' => true,
                'branch_id' => $mainBranch?->id,
                'notes' => 'Secretaria principal, maneja recepción y agendamiento',
            ],
            [
                'name' => 'Carolina Rojas Silva',
                'rut' => '16345678-9',
                'role' => 'secretaria',
                'email' => 'carolina.rojas@funeraria.cl',
                'phone' => '+56 9 7654 3210',
                'address' => 'Calle Las Rosas 456, Viña del Mar',
                'hire_date' => '2021-03-20',
                'base_salary' => 620000.00,
                'bank_account' => '2345678901',
                'bank_name' => 'Banco Estado',
                'emergency_contact_name' => 'Luis Rojas',
                'emergency_contact_phone' => '+56 9 7654 3211',
                'vehicle_plate' => null,
                'vehicle_model' => null,
                'is_active' => true,
                'branch_id' => $branches->skip(1)->first()?->id,
                'notes' => 'Secretaria sucursal Viña del Mar',
            ],

            // Drivers
            [
                'name' => 'Roberto Muñoz Fernández',
                'rut' => '14567890-1',
                'role' => 'conductor',
                'email' => 'roberto.munoz@funeraria.cl',
                'phone' => '+56 9 6543 2109',
                'address' => 'Pasaje Los Álamos 789, Santiago',
                'hire_date' => '2019-06-10',
                'base_salary' => 750000.00,
                'bank_account' => '3456789012',
                'bank_name' => 'Banco Santander',
                'emergency_contact_name' => 'Ana Muñoz',
                'emergency_contact_phone' => '+56 9 6543 2110',
                'vehicle_plate' => 'BBCD12',
                'vehicle_model' => 'Mercedes-Benz Sprinter 2018',
                'is_active' => true,
                'branch_id' => $mainBranch?->id,
                'notes' => 'Conductor senior con 5 años de experiencia',
            ],
            [
                'name' => 'Jorge Tapia Morales',
                'rut' => '17678901-2',
                'role' => 'conductor',
                'email' => 'jorge.tapia@funeraria.cl',
                'phone' => '+56 9 5432 1098',
                'address' => 'Calle Principal 321, Concepción',
                'hire_date' => '2020-09-15',
                'base_salary' => 720000.00,
                'bank_account' => '4567890123',
                'bank_name' => 'Banco de Chile',
                'emergency_contact_name' => 'Patricia Tapia',
                'emergency_contact_phone' => '+56 9 5432 1099',
                'vehicle_plate' => 'CCDE23',
                'vehicle_model' => 'Ford Transit 2019',
                'is_active' => true,
                'branch_id' => $branches->skip(2)->first()?->id,
                'notes' => 'Conductor zona sur',
            ],

            // Assistants
            [
                'name' => 'Pablo Herrera Castro',
                'rut' => '16789012-3',
                'role' => 'auxiliar',
                'email' => 'pablo.herrera@funeraria.cl',
                'phone' => '+56 9 4321 0987',
                'address' => 'Av. Central 654, Santiago',
                'hire_date' => '2021-01-20',
                'base_salary' => 580000.00,
                'bank_account' => '5678901234',
                'bank_name' => 'Banco Estado',
                'emergency_contact_name' => 'Carmen Herrera',
                'emergency_contact_phone' => '+56 9 4321 0988',
                'vehicle_plate' => null,
                'vehicle_model' => null,
                'is_active' => true,
                'branch_id' => $mainBranch?->id,
                'notes' => 'Auxiliar de servicios generales',
            ],
            [
                'name' => 'Andrés Vidal Soto',
                'rut' => '15890123-4',
                'role' => 'auxiliar',
                'email' => 'andres.vidal@funeraria.cl',
                'phone' => '+56 9 3210 9876',
                'address' => 'Pasaje Norte 987, La Serena',
                'hire_date' => '2021-05-10',
                'base_salary' => 570000.00,
                'bank_account' => '6789012345',
                'bank_name' => 'Banco Santander',
                'emergency_contact_name' => 'Isabel Vidal',
                'emergency_contact_phone' => '+56 9 3210 9877',
                'vehicle_plate' => null,
                'vehicle_model' => null,
                'is_active' => true,
                'branch_id' => $branches->skip(3)->first()?->id,
                'notes' => 'Auxiliar sucursal La Serena',
            ],

            // Administrator
            [
                'name' => 'Francisco Reyes Jiménez',
                'rut' => '13456789-0',
                'role' => 'administrador',
                'email' => 'francisco.reyes@funeraria.cl',
                'phone' => '+56 9 2109 8765',
                'address' => 'Av. Libertador 234, Santiago',
                'hire_date' => '2018-03-01',
                'base_salary' => 1200000.00,
                'bank_account' => '7890123456',
                'bank_name' => 'Banco de Chile',
                'emergency_contact_name' => 'Mónica Reyes',
                'emergency_contact_phone' => '+56 9 2109 8766',
                'vehicle_plate' => null,
                'vehicle_model' => null,
                'is_active' => true,
                'branch_id' => $mainBranch?->id,
                'notes' => 'Administrador general, supervisa operaciones',
            ],

            // Owner
            [
                'name' => 'Claudio Vicuña Astorga',
                'rut' => '12345678-9',
                'role' => 'propietario',
                'email' => 'claudio.vicuna@funeraria.cl',
                'phone' => '+56 9 1098 7654',
                'address' => 'Calle Empresarial 100, Santiago',
                'hire_date' => '2015-01-01',
                'base_salary' => 2500000.00,
                'bank_account' => '8901234567',
                'bank_name' => 'Banco Santander',
                'emergency_contact_name' => 'Elena Vicuña',
                'emergency_contact_phone' => '+56 9 1098 7655',
                'vehicle_plate' => null,
                'vehicle_model' => null,
                'is_active' => true,
                'branch_id' => $mainBranch?->id,
                'notes' => 'Propietario y fundador de la funeraria',
            ],

            // Inactive staff member
            [
                'name' => 'Juan Pérez López',
                'rut' => '18901234-5',
                'role' => 'conductor',
                'email' => 'juan.perez@funeraria.cl',
                'phone' => '+56 9 0987 6543',
                'address' => 'Av. Sur 555, Santiago',
                'hire_date' => '2022-01-15',
                'base_salary' => 700000.00,
                'bank_account' => '9012345678',
                'bank_name' => 'Banco Estado',
                'emergency_contact_name' => 'Rosa Pérez',
                'emergency_contact_phone' => '+56 9 0987 6544',
                'vehicle_plate' => 'DDEF34',
                'vehicle_model' => 'Hyundai H1 2020',
                'is_active' => false,
                'branch_id' => $mainBranch?->id,
                'notes' => 'Inactivo desde octubre 2024',
            ],
        ];

        foreach ($staff as $member) {
            Staff::create($member);
        }
    }
}

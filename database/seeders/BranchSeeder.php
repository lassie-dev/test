<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $branches = [
            [
                'name' => 'Casa Matriz',
                'code' => 'CM',
                'address' => 'Av. Principal 123',
                'city' => 'Santiago',
                'region' => 'Región Metropolitana',
                'phone' => '+56 2 2345 6789',
                'email' => 'matriz@funeraria.cl',
                'is_active' => true,
                'is_headquarters' => true,
                'notes' => 'Oficina principal y sede administrativa',
            ],
            [
                'name' => 'Sucursal Viña del Mar',
                'code' => 'VM',
                'address' => 'Calle Valparaíso 456',
                'city' => 'Viña del Mar',
                'region' => 'Región de Valparaíso',
                'phone' => '+56 32 2987 6543',
                'email' => 'vina@funeraria.cl',
                'is_active' => true,
                'is_headquarters' => false,
                'notes' => 'Sucursal zona costera',
            ],
            [
                'name' => 'Sucursal Concepción',
                'code' => 'CON',
                'address' => 'Av. O\'Higgins 789',
                'city' => 'Concepción',
                'region' => 'Región del Biobío',
                'phone' => '+56 41 2876 5432',
                'email' => 'concepcion@funeraria.cl',
                'is_active' => true,
                'is_headquarters' => false,
                'notes' => 'Sucursal zona sur',
            ],
            [
                'name' => 'Sucursal La Serena',
                'code' => 'LS',
                'address' => 'Calle Balmaceda 321',
                'city' => 'La Serena',
                'region' => 'Región de Coquimbo',
                'phone' => '+56 51 2765 4321',
                'email' => 'laserena@funeraria.cl',
                'is_active' => true,
                'is_headquarters' => false,
                'notes' => 'Sucursal zona norte',
            ],
        ];

        foreach ($branches as $branch) {
            Branch::create($branch);
        }
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = [
            // Coffins
            [
                'name' => 'Ataúd Económico',
                'description' => 'Ataúd de madera básica, diseño simple',
                'category' => 'coffin',
                'price' => 150000,
                'stock' => 8,
                'min_stock' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Ataúd Estándar',
                'description' => 'Ataúd de madera de mejor calidad, acabado mejorado',
                'category' => 'coffin',
                'price' => 250000,
                'stock' => 6,
                'min_stock' => 2,
                'is_active' => true,
            ],
            [
                'name' => 'Ataúd Premium Caoba',
                'description' => 'Ataúd de madera dura, diseño ornamentado',
                'category' => 'coffin',
                'price' => 450000,
                'stock' => 3,
                'min_stock' => 1,
                'is_active' => true,
            ],
            [
                'name' => 'Ataúd de Lujo Importado',
                'description' => 'Ataúd importado, materiales de alta gama',
                'category' => 'coffin',
                'price' => 800000,
                'stock' => 2,
                'min_stock' => 1,
                'is_active' => true,
            ],

            // Urns
            [
                'name' => 'Urna Cerámica Básica',
                'description' => 'Urna de cerámica simple',
                'category' => 'urn',
                'price' => 45000,
                'stock' => 20,
                'min_stock' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Urna Cerámica Decorativa',
                'description' => 'Urna de cerámica con diseño decorativo',
                'category' => 'urn',
                'price' => 80000,
                'stock' => 15,
                'min_stock' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Urna de Madera',
                'description' => 'Urna de madera tallada a mano',
                'category' => 'urn',
                'price' => 120000,
                'stock' => 10,
                'min_stock' => 3,
                'is_active' => true,
            ],
            [
                'name' => 'Urna de Metal',
                'description' => 'Urna de metal con grabado personalizado',
                'category' => 'urn',
                'price' => 180000,
                'stock' => 8,
                'min_stock' => 2,
                'is_active' => true,
            ],

            // Flowers
            [
                'name' => 'Ramo Pequeño',
                'description' => 'Arreglo floral pequeño',
                'category' => 'flowers',
                'price' => 25000,
                'stock' => 50,
                'min_stock' => 10,
                'is_active' => true,
            ],
            [
                'name' => 'Arreglo Grande',
                'description' => 'Arreglo floral grande y elaborado',
                'category' => 'flowers',
                'price' => 65000,
                'stock' => 30,
                'min_stock' => 8,
                'is_active' => true,
            ],
            [
                'name' => 'Corona de Flores',
                'description' => 'Corona circular de flores frescas',
                'category' => 'flowers',
                'price' => 85000,
                'stock' => 20,
                'min_stock' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Diseño Personalizado',
                'description' => 'Arreglo floral personalizado según solicitud',
                'category' => 'flowers',
                'price' => 150000,
                'stock' => 15,
                'min_stock' => 3,
                'is_active' => true,
            ],

            // Memorial items
            [
                'name' => 'Tarjetas de Agradecimiento (50 unidades)',
                'description' => 'Tarjetas de agradecimiento impresas',
                'category' => 'memorial',
                'price' => 15000,
                'stock' => 100,
                'min_stock' => 20,
                'is_active' => true,
            ],
            [
                'name' => 'Marcadores Conmemorativos (50 unidades)',
                'description' => 'Marcadores con foto y detalles del difunto',
                'category' => 'memorial',
                'price' => 20000,
                'stock' => 80,
                'min_stock' => 15,
                'is_active' => true,
            ],
            [
                'name' => 'Portarretratos Memorial',
                'description' => 'Portarretratos elegante para velorio',
                'category' => 'memorial',
                'price' => 35000,
                'stock' => 25,
                'min_stock' => 5,
                'is_active' => true,
            ],
            [
                'name' => 'Libro de Visitas',
                'description' => 'Libro para registro de asistentes al velorio',
                'category' => 'memorial',
                'price' => 28000,
                'stock' => 30,
                'min_stock' => 5,
                'is_active' => true,
            ],
        ];

        foreach ($products as $product) {
            \App\Models\Product::create($product);
        }
    }
}

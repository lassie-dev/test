<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            // Product Categories
            [
                'name' => 'Ataúdes',
                'slug' => 'ataudes',
                'description' => 'Ataúdes de diferentes calidades y materiales',
                'type' => 'product',
                'icon' => 'package',
                'is_active' => true,
            ],
            [
                'name' => 'Urnas',
                'slug' => 'urnas',
                'description' => 'Urnas funerarias para cenizas',
                'type' => 'product',
                'icon' => 'package',
                'is_active' => true,
            ],
            [
                'name' => 'Flores',
                'slug' => 'flores',
                'description' => 'Arreglos florales y coronas',
                'type' => 'product',
                'icon' => 'flower',
                'is_active' => true,
            ],
            [
                'name' => 'Artículos Conmemorativos',
                'slug' => 'articulos-conmemorativos',
                'description' => 'Tarjetas, marcadores y artículos de recuerdo',
                'type' => 'product',
                'icon' => 'file-text',
                'is_active' => true,
            ],

            // Service Categories
            [
                'name' => 'Transporte',
                'slug' => 'transporte',
                'description' => 'Servicios de traslado del difunto',
                'type' => 'service',
                'icon' => 'truck',
                'is_active' => true,
            ],
            [
                'name' => 'Preparación',
                'slug' => 'preparacion',
                'description' => 'Preparación y tanatopraxia del cuerpo',
                'type' => 'service',
                'icon' => 'heart-pulse',
                'is_active' => true,
            ],
            [
                'name' => 'Velatorio',
                'slug' => 'velatorio',
                'description' => 'Servicios de velatorio y sala',
                'type' => 'service',
                'icon' => 'home',
                'is_active' => true,
            ],
            [
                'name' => 'Ceremonias',
                'slug' => 'ceremonias',
                'description' => 'Ceremonias religiosas y laicas',
                'type' => 'service',
                'icon' => 'users',
                'is_active' => true,
            ],
            [
                'name' => 'Inhumación',
                'slug' => 'inhumacion',
                'description' => 'Servicios de sepultura',
                'type' => 'service',
                'icon' => 'cross',
                'is_active' => true,
            ],
            [
                'name' => 'Cremación',
                'slug' => 'cremacion',
                'description' => 'Servicios de cremación',
                'type' => 'service',
                'icon' => 'flame',
                'is_active' => true,
            ],
            [
                'name' => 'Servicios Adicionales',
                'slug' => 'servicios-adicionales',
                'description' => 'Servicios complementarios y extras',
                'type' => 'service',
                'icon' => 'plus-circle',
                'is_active' => true,
            ],
            [
                'name' => 'Gestión Documental',
                'slug' => 'gestion-documental',
                'description' => 'Tramitación de documentos y certificados',
                'type' => 'service',
                'icon' => 'file-check',
                'is_active' => true,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Now migrate existing product categories to the new system
        $this->migrateProductCategories();
    }

    /**
     * Migrate existing products to use category_id
     */
    private function migrateProductCategories(): void
    {
        $categoryMapping = [
            'coffin' => 'ataudes',
            'urn' => 'urnas',
            'flowers' => 'flores',
            'memorial' => 'articulos-conmemorativos',
        ];

        foreach ($categoryMapping as $oldCategory => $newSlug) {
            $category = Category::where('slug', $newSlug)->first();
            if ($category) {
                \App\Models\Product::where('category', $oldCategory)
                    ->update(['category_id' => $category->id]);
            }
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\MenuSection;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;

class NavigationMenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Clear existing menu data
        MenuItem::query()->delete();
        MenuSection::query()->delete();

        // Main section (Dashboard)
        $mainSection = MenuSection::create([
            'title' => null,
            'order' => 1,
            'is_active' => true,
        ]);

        MenuItem::create([
            'menu_section_id' => $mainSection->id,
            'name' => 'Dashboard',
            'href' => '/dashboard',
            'icon' => 'LayoutDashboard',
            'order' => 1,
            'is_active' => true,
        ]);

        // Operations section
        $operationsSection = MenuSection::create([
            'title' => 'Operaciones',
            'order' => 2,
            'permissions' => ['view_operations'],
            'is_active' => true,
        ]);

        $contractsItem = MenuItem::create([
            'menu_section_id' => $operationsSection->id,
            'name' => 'Contratos',
            'href' => '/contracts',
            'icon' => 'FileText',
            'order' => 1,
            'permissions' => ['view_contracts'],
            'is_active' => true,
        ]);

        // Contracts sub-menu
        MenuItem::create([
            'parent_id' => $contractsItem->id,
            'name' => 'Nuevo Contrato',
            'href' => '/contracts/create',
            'icon' => 'FileText',
            'order' => 1,
            'is_active' => true,
        ]);

        MenuItem::create([
            'parent_id' => $contractsItem->id,
            'name' => 'Lista de Contratos',
            'href' => '/contracts',
            'icon' => 'FileText',
            'order' => 2,
            'is_active' => true,
        ]);

        MenuItem::create([
            'parent_id' => $contractsItem->id,
            'name' => 'Contratos Archivados',
            'href' => '/contracts/archived',
            'icon' => 'FileText',
            'order' => 3,
            'is_active' => true,
        ]);

        MenuItem::create([
            'menu_section_id' => $operationsSection->id,
            'name' => 'Inventario',
            'href' => '/inventory',
            'icon' => 'Package',
            'badge' => 5,
            'order' => 2,
            'permissions' => ['view_inventory'],
            'is_active' => true,
        ]);

        MenuItem::create([
            'menu_section_id' => $operationsSection->id,
            'name' => 'Pagos',
            'href' => '/payments',
            'icon' => 'CreditCard',
            'badge' => 12,
            'order' => 3,
            'permissions' => ['view_payments'],
            'is_active' => true,
        ]);

        MenuItem::create([
            'menu_section_id' => $operationsSection->id,
            'name' => 'Personal',
            'href' => '/staff',
            'icon' => 'Users',
            'order' => 4,
            'permissions' => ['view_staff'],
            'is_active' => true,
        ]);

        MenuItem::create([
            'menu_section_id' => $operationsSection->id,
            'name' => 'Liquidaciones',
            'href' => '/payroll',
            'icon' => 'DollarSign',
            'order' => 5,
            'permissions' => ['view_payroll'],
            'is_active' => true,
        ]);

        // Analysis section
        $analysisSection = MenuSection::create([
            'title' => 'Análisis',
            'order' => 3,
            'permissions' => ['view_reports'],
            'is_active' => true,
        ]);

        MenuItem::create([
            'menu_section_id' => $analysisSection->id,
            'name' => 'Reportes',
            'href' => '/reports',
            'icon' => 'BarChart3',
            'order' => 1,
            'is_active' => true,
        ]);
    }
}

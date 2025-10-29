<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Agreement;

class AgreementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $agreements = [
            [
                'code' => 'AGR-001',
                'company_name' => 'Banco Estado Employees',
                'contact_name' => 'María González',
                'contact_phone' => '+56912345678',
                'contact_email' => 'mgonzalez@bancoestado.cl',
                'address' => 'Av. Libertador Bernardo O\'Higgins 1111, Santiago',
                'start_date' => '2024-01-01',
                'end_date' => '2025-12-31',
                'covered_employees' => 500,
                'status' => 'active',
                'discount_percentage' => 0,
                'company_pays_percentage' => 70.00,
                'employee_pays_percentage' => 30.00,
                'payment_method' => 'direct_billing',
                'credit_months' => 12,
                'special_conditions' => 'Company pays 70% of services, employee pays 30%',
                'notes' => 'Corporate agreement with Banco Estado for employee benefits',
            ],
            [
                'code' => 'AGR-002',
                'company_name' => 'Codelco Mining Corporation',
                'contact_name' => 'Carlos Ramírez',
                'contact_phone' => '+56923456789',
                'contact_email' => 'cramirez@codelco.cl',
                'address' => 'Huérfanos 1270, Santiago',
                'start_date' => '2024-03-01',
                'end_date' => '2026-02-28',
                'covered_employees' => 1200,
                'status' => 'active',
                'discount_percentage' => 0,
                'company_pays_percentage' => 80.00,
                'employee_pays_percentage' => 20.00,
                'payment_method' => 'direct_billing',
                'credit_months' => 18,
                'special_conditions' => 'Premium plan - Company covers 80%',
                'notes' => 'Premium corporate agreement with Codelco',
            ],
            [
                'code' => 'AGR-003',
                'company_name' => 'Universidad de Chile',
                'contact_name' => 'Ana Torres',
                'contact_phone' => '+56934567890',
                'contact_email' => 'atorres@uchile.cl',
                'address' => 'Av. Libertador Bernardo O\'Higgins 1058, Santiago',
                'start_date' => '2024-06-01',
                'end_date' => '2025-05-31',
                'covered_employees' => 800,
                'status' => 'active',
                'discount_percentage' => 0,
                'company_pays_percentage' => 50.00,
                'employee_pays_percentage' => 50.00,
                'payment_method' => 'direct_billing',
                'credit_months' => 12,
                'special_conditions' => 'Equal split between university and employee',
                'notes' => 'Agreement covering university staff and faculty',
            ],
        ];

        foreach ($agreements as $agreement) {
            Agreement::create($agreement);
        }
    }
}

<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $services = [
            // Basic Transport Services
            [
                'name' => 'Traslado Básico',
                'description' => 'Transporte del difunto desde el lugar de fallecimiento a la funeraria',
                'price' => 50000,
                'active' => true,
            ],
            [
                'name' => 'Traslado Interregional',
                'description' => 'Transporte del difunto entre regiones',
                'price' => 150000,
                'active' => true,
            ],

            // Body Preparation Services
            [
                'name' => 'Preparación Básica',
                'description' => 'Preparación y presentación básica del difunto',
                'price' => 80000,
                'active' => true,
            ],
            [
                'name' => 'Tanatopraxia Completa',
                'description' => 'Embalsamamiento profesional y preparación completa del cuerpo',
                'price' => 200000,
                'active' => true,
            ],

            // Wake/Viewing Services
            [
                'name' => 'Velorio 12 Horas',
                'description' => 'Servicio de velatorio por 12 horas en sala',
                'price' => 150000,
                'active' => true,
            ],
            [
                'name' => 'Velorio 24 Horas',
                'description' => 'Servicio de velatorio por 24 horas en sala',
                'price' => 200000,
                'active' => true,
            ],
            [
                'name' => 'Velorio 48 Horas',
                'description' => 'Servicio de velatorio por 48 horas en sala',
                'price' => 350000,
                'active' => true,
            ],

            // Ceremony Services
            [
                'name' => 'Ceremonia Religiosa',
                'description' => 'Coordinación de ceremonia religiosa con celebrante',
                'price' => 100000,
                'active' => true,
            ],
            [
                'name' => 'Ceremonia Secular',
                'description' => 'Ceremonia laica personalizada',
                'price' => 80000,
                'active' => true,
            ],

            // Final Disposition - Burial
            [
                'name' => 'Sepultura Básica',
                'description' => 'Servicio de inhumación básico (sin incluir plot)',
                'price' => 250000,
                'active' => true,
            ],
            [
                'name' => 'Sepultura Premium',
                'description' => 'Servicio de inhumación con ceremonia especial',
                'price' => 400000,
                'active' => true,
            ],

            // Final Disposition - Cremation
            [
                'name' => 'Cremación Estándar',
                'description' => 'Servicio de cremación estándar',
                'price' => 300000,
                'active' => true,
            ],
            [
                'name' => 'Cremación con Asistencia',
                'description' => 'Cremación con presencia familiar y ceremonia',
                'price' => 450000,
                'active' => true,
            ],

            // Additional Services
            [
                'name' => 'Transmisión en Vivo',
                'description' => 'Streaming online de la ceremonia',
                'price' => 50000,
                'active' => true,
            ],
            [
                'name' => 'Fotografía Profesional',
                'description' => 'Registro fotográfico del servicio',
                'price' => 75000,
                'active' => true,
            ],
            [
                'name' => 'Coordinación de Flores',
                'description' => 'Arreglos florales para el velorio y ceremonia',
                'price' => 100000,
                'active' => true,
            ],
            [
                'name' => 'Programas Impresos',
                'description' => 'Impresión de programas de ceremonia (100 unidades)',
                'price' => 40000,
                'active' => true,
            ],
            [
                'name' => 'Publicación de Obituario',
                'description' => 'Publicación en medios locales',
                'price' => 60000,
                'active' => true,
            ],
            [
                'name' => 'Cafetería para Velorio',
                'description' => 'Servicio de café y aperitivos durante el velorio',
                'price' => 80000,
                'active' => true,
            ],

            // Documentation Services
            [
                'name' => 'Gestión Documental',
                'description' => 'Tramitación de certificados y documentos legales',
                'price' => 45000,
                'active' => true,
            ],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}

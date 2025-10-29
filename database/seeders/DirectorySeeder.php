<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Church;
use App\Models\Cemetery;
use App\Models\WakeRoom;

class DirectorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample Churches
        $churches = [
            ['name' => 'Parroquia Nuestra Señora del Carmen', 'address' => 'Av. Principal 123', 'city' => 'Santiago', 'region' => 'Metropolitana', 'religion' => 'Católica', 'phone' => '+56 2 2234 5678'],
            ['name' => 'Iglesia San Francisco de Asís', 'address' => 'Calle Central 456', 'city' => 'Valparaíso', 'region' => 'Valparaíso', 'religion' => 'Católica', 'phone' => '+56 32 225 6789'],
            ['name' => 'Catedral Metropolitana', 'address' => 'Plaza de Armas', 'city' => 'Santiago', 'region' => 'Metropolitana', 'religion' => 'Católica', 'phone' => '+56 2 2698 2777'],
            ['name' => 'Iglesia Evangélica Pentecostal', 'address' => 'Av. Libertador 789', 'city' => 'Concepción', 'region' => 'Biobío', 'religion' => 'Evangélica', 'phone' => '+56 41 222 3456'],
            ['name' => 'Templo Bautista Emanuel', 'address' => 'Paseo del Mar 321', 'city' => 'Viña del Mar', 'region' => 'Valparaíso', 'religion' => 'Bautista', 'phone' => '+56 32 268 9012'],
        ];

        foreach ($churches as $church) {
            Church::create($church);
        }

        // Sample Cemeteries
        $cemeteries = [
            ['name' => 'Cementerio General', 'address' => 'Av. Recoleta 999', 'city' => 'Santiago', 'region' => 'Metropolitana', 'type' => 'public', 'phone' => '+56 2 2737 9090'],
            ['name' => 'Parque del Recuerdo', 'address' => 'Camino a Melipilla Km 12', 'city' => 'Pudahuel', 'region' => 'Metropolitana', 'type' => 'parque', 'phone' => '+56 2 2821 2000'],
            ['name' => 'Cementerio Católico', 'address' => 'Av. La Paz 1234', 'city' => 'Recoleta', 'region' => 'Metropolitana', 'type' => 'private', 'phone' => '+56 2 2622 5555'],
            ['name' => 'Parque Memorial Los Cipreses', 'address' => 'Ruta 68 Km 18', 'city' => 'Curacaví', 'region' => 'Metropolitana', 'type' => 'parque', 'phone' => '+56 2 2815 3000'],
            ['name' => 'Cementerio Municipal de Valparaíso', 'address' => 'Playa Ancha Alto', 'city' => 'Valparaíso', 'region' => 'Valparaíso', 'type' => 'public', 'phone' => '+56 32 228 5432'],
        ];

        foreach ($cemeteries as $cemetery) {
            Cemetery::create($cemetery);
        }

        // Sample Wake Rooms
        $wakeRooms = [
            ['name' => 'Sala Principal', 'funeral_home_name' => 'Funeraria Paz Eterna', 'address' => 'Av. Providencia 2200', 'city' => 'Santiago', 'region' => 'Metropolitana', 'capacity' => 80, 'phone' => '+56 2 2232 4567'],
            ['name' => 'Capilla del Carmen', 'funeral_home_name' => 'Servicios Funerarios Hogar de Cristo', 'address' => 'Av. Vicuña Mackenna 4800', 'city' => 'La Florida', 'region' => 'Metropolitana', 'capacity' => 100, 'phone' => '+56 2 2528 5000'],
            ['name' => 'Sala Velatorio Norte', 'funeral_home_name' => 'Funeraria Hogar de Cristo', 'address' => 'Av. Independencia 1023', 'city' => 'Independencia', 'region' => 'Metropolitana', 'capacity' => 60, 'phone' => '+56 2 2737 4444'],
            ['name' => 'Velatorio Premium', 'funeral_home_name' => 'Memorial Parque del Sol', 'address' => 'Las Condes 9876', 'city' => 'Las Condes', 'region' => 'Metropolitana', 'capacity' => 120, 'phone' => '+56 2 2426 8888'],
            ['name' => 'Sala Familiar', 'funeral_home_name' => 'Funeraria San Vicente', 'address' => 'Av. España 654', 'city' => 'Valparaíso', 'region' => 'Valparaíso', 'capacity' => 50, 'phone' => '+56 32 225 9999'],
        ];

        foreach ($wakeRooms as $wakeRoom) {
            WakeRoom::create($wakeRoom);
        }
    }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->string('reception_location')->nullable()->after('service_location');
            $table->string('coffin_model')->nullable()->after('reception_location');
            $table->string('cemetery_sector')->nullable()->after('coffin_model');
            $table->text('procession_details')->nullable()->after('cemetery_sector');
            $table->foreignId('assigned_vehicle_id')->nullable()->constrained('staff')->after('assigned_assistant_id');
            $table->text('additional_staff_notes')->nullable()->after('assigned_vehicle_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropForeign(['assigned_vehicle_id']);
            $table->dropColumn([
                'reception_location',
                'coffin_model',
                'cemetery_sector',
                'procession_details',
                'assigned_vehicle_id',
                'additional_staff_notes'
            ]);
        });
    }
};

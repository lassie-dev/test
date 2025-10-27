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
        Schema::create('staff', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('rut')->unique();
            $table->enum('role', ['secretaria', 'conductor', 'auxiliar', 'administrador', 'propietario']);
            $table->string('email')->nullable();
            $table->string('phone');
            $table->text('address')->nullable();
            $table->date('hire_date');
            $table->decimal('base_salary', 12, 2);
            $table->string('bank_account')->nullable();
            $table->string('bank_name')->nullable();
            $table->string('emergency_contact_name')->nullable();
            $table->string('emergency_contact_phone')->nullable();
            $table->string('vehicle_plate')->nullable(); // For drivers
            $table->string('vehicle_model')->nullable(); // For drivers
            $table->boolean('is_active')->default(true);
            $table->foreignId('branch_id')->nullable()->constrained('branches')->onDelete('set null');
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('staff');
    }
};

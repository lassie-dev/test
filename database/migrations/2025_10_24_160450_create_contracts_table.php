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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('numero_contrato')->unique();
            $table->enum('tipo', ['necesidad_inmediata', 'necesidad_futura']);
            $table->enum('estado', ['cotizacion', 'contrato', 'finalizado', 'cancelado'])->default('cotizacion');
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('deceased_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->constrained()->comment('Secretaria que creó el contrato');
            $table->decimal('subtotal', 12, 2);
            $table->decimal('descuento_porcentaje', 5, 2)->default(0);
            $table->decimal('descuento_monto', 12, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->boolean('es_festivo')->default(false);
            $table->boolean('es_nocturno')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};

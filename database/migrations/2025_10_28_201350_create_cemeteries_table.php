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
        Schema::create('cemeteries', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('type', ['public', 'private', 'parque'])->default('public');
            $table->text('address');
            $table->string('city');
            $table->string('region');
            $table->string('phone')->nullable();
            $table->string('administrator_name')->nullable();
            $table->string('email')->nullable();
            $table->string('office_hours')->nullable();
            $table->boolean('plots_available')->default(true);
            $table->boolean('niches_available')->default(true);
            $table->boolean('cremation_plots_available')->default(false);
            $table->decimal('plot_price_from', 10, 2)->nullable();
            $table->boolean('parking_available')->default(false);
            $table->boolean('wheelchair_accessible')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('city');
            $table->index('region');
            $table->index('name');
            $table->index('type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cemeteries');
    }
};

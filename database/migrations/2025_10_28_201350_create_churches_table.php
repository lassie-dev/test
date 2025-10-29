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
        Schema::create('churches', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('religion')->nullable(); // Catholic, Protestant, Evangelical, etc.
            $table->text('address');
            $table->string('city');
            $table->string('region');
            $table->string('phone')->nullable();
            $table->string('priest_pastor_name')->nullable();
            $table->string('email')->nullable();
            $table->integer('capacity')->nullable();
            $table->string('service_hours')->nullable();
            $table->boolean('parking_available')->default(false);
            $table->boolean('wheelchair_accessible')->default(false);
            $table->text('notes')->nullable();
            $table->timestamps();

            // Indexes
            $table->index('city');
            $table->index('region');
            $table->index('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('churches');
    }
};

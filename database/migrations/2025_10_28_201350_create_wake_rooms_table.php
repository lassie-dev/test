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
        Schema::create('wake_rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('funeral_home_name')->nullable(); // If part of a funeral home
            $table->text('address');
            $table->string('city');
            $table->string('region');
            $table->string('phone');
            $table->string('contact_name')->nullable();
            $table->string('email')->nullable();
            $table->integer('capacity')->nullable();
            $table->decimal('hourly_rate', 10, 2)->nullable();
            $table->decimal('daily_rate', 10, 2)->nullable();
            $table->boolean('has_chapel')->default(false);
            $table->boolean('has_kitchen')->default(false);
            $table->boolean('has_bathrooms')->default(true);
            $table->boolean('has_parking')->default(false);
            $table->boolean('wheelchair_accessible')->default(false);
            $table->boolean('available_24h')->default(false);
            $table->text('amenities')->nullable(); // JSON or comma-separated
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
        Schema::dropIfExists('wake_rooms');
    }
};

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
        // Menu sections (groups)
        Schema::create('menu_sections', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->integer('order')->default(0);
            $table->json('permissions')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Menu items
        Schema::create('menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('menu_section_id')->nullable()->constrained('menu_sections')->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('menu_items')->onDelete('cascade');
            $table->string('name');
            $table->string('href');
            $table->string('icon')->default('Circle');
            $table->integer('badge')->nullable();
            $table->integer('order')->default(0);
            $table->json('permissions')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu_items');
        Schema::dropIfExists('menu_sections');
    }
};

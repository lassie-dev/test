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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('category', [
                'coffin',      // Ataúd
                'urn',         // Urna
                'flowers',     // Flores
                'memorial',    // Memorial items (cards, bookmarks, etc.)
                'other'        // Otros
            ]);
            $table->decimal('price', 12, 2);
            $table->integer('stock')->default(0);
            $table->integer('min_stock')->default(5)->comment('Minimum stock threshold for alerts');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

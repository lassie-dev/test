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
            $table->string('contract_number')->unique();
            $table->enum('type', ['immediate_need', 'future_need']);
            $table->enum('status', ['quote', 'contract', 'completed', 'cancelled'])->default('quote');
            $table->foreignId('client_id')->constrained()->onDelete('cascade');
            $table->foreignId('deceased_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('user_id')->constrained()->comment('User who created the contract');
            $table->decimal('subtotal', 12, 2);
            $table->decimal('discount_percentage', 5, 2)->default(0);
            $table->decimal('discount_amount', 12, 2)->default(0);
            $table->decimal('total', 12, 2);
            $table->boolean('is_holiday')->default(false);
            $table->boolean('is_night_shift')->default(false);
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

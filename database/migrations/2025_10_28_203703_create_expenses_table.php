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
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade'); // Who registered the expense
            $table->string('category'); // salaries, supplies, utilities, vehicle, maintenance, marketing, other
            $table->string('subcategory')->nullable();
            $table->string('description');
            $table->decimal('amount', 12, 2);
            $table->date('expense_date');
            $table->string('payment_method'); // cash, transfer, check, credit_card
            $table->string('vendor_name')->nullable();
            $table->string('vendor_rut')->nullable();
            $table->string('invoice_number')->nullable();
            $table->string('receipt_path')->nullable(); // Path to uploaded receipt
            $table->boolean('is_recurring')->default(false);
            $table->string('recurring_frequency')->nullable(); // monthly, quarterly, yearly
            $table->string('status')->default('pending'); // pending, approved, paid
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('branch_id');
            $table->index('category');
            $table->index('expense_date');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};

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
        Schema::create('agreements', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // AGR-001
            $table->string('company_name');
            $table->string('contact_name');
            $table->string('contact_phone');
            $table->string('contact_email')->nullable();
            $table->text('address')->nullable();
            $table->date('start_date');
            $table->date('end_date');
            $table->integer('covered_employees')->default(0);
            $table->enum('status', ['active', 'expired', 'suspended'])->default('active');

            // Benefits & Terms
            $table->decimal('discount_percentage', 5, 2)->default(0); // e.g., 25.00
            $table->decimal('company_pays_percentage', 5, 2)->default(0); // e.g., 50.00
            $table->decimal('employee_pays_percentage', 5, 2)->default(100); // e.g., 50.00
            $table->string('payment_method')->nullable(); // direct_billing, employee_reimburse
            $table->integer('credit_months')->default(12); // Extended credit terms
            $table->text('included_services')->nullable(); // JSON or comma-separated
            $table->text('special_conditions')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();

            // Indexes
            $table->index('company_name');
            $table->index('status');
            $table->index('end_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agreements');
    }
};

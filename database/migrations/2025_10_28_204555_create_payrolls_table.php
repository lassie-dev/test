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
        Schema::create('payrolls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('branch_id')->constrained('branches')->onDelete('cascade');
            $table->string('period'); // YYYY-MM format
            $table->date('period_start');
            $table->date('period_end');
            $table->decimal('base_salary', 12, 2);
            $table->decimal('commissions_total', 12, 2)->default(0);
            $table->decimal('bonuses', 12, 2)->default(0);
            $table->decimal('overtime', 12, 2)->default(0);
            $table->decimal('gross_salary', 12, 2);
            $table->decimal('health_deduction', 12, 2)->default(0);
            $table->decimal('pension_deduction', 12, 2)->default(0);
            $table->decimal('tax_deduction', 12, 2)->default(0);
            $table->decimal('other_deductions', 12, 2)->default(0);
            $table->decimal('total_deductions', 12, 2);
            $table->decimal('net_salary', 12, 2);
            $table->string('status')->default('draft'); // draft, approved, paid
            $table->date('payment_date')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('user_id');
            $table->index('period');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payrolls');
    }
};

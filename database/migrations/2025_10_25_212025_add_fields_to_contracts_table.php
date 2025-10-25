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
        Schema::table('contracts', function (Blueprint $table) {
            $table->enum('payment_method', ['cash', 'credit'])->nullable()->after('total');
            $table->integer('installments')->nullable()->comment('Number of installments for credit payment')->after('payment_method');
            $table->decimal('down_payment', 12, 2)->nullable()->after('installments');
            $table->string('service_location')->nullable()->after('down_payment');
            $table->dateTime('service_datetime')->nullable()->after('service_location');
            $table->text('special_requests')->nullable()->after('service_datetime');
            $table->foreignId('assigned_driver_id')->nullable()->constrained('users')->after('special_requests');
            $table->foreignId('assigned_assistant_id')->nullable()->constrained('users')->after('assigned_driver_id');
            $table->decimal('commission_percentage', 5, 2)->nullable()->after('assigned_assistant_id');
            $table->decimal('commission_amount', 12, 2)->nullable()->after('commission_percentage');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropForeign(['assigned_driver_id']);
            $table->dropForeign(['assigned_assistant_id']);
            $table->dropColumn([
                'payment_method',
                'installments',
                'down_payment',
                'service_location',
                'service_datetime',
                'special_requests',
                'assigned_driver_id',
                'assigned_assistant_id',
                'commission_percentage',
                'commission_amount'
            ]);
        });
    }
};

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
            // Drop existing foreign keys that reference users table
            $table->dropForeign(['assigned_driver_id']);
            $table->dropForeign(['assigned_assistant_id']);

            // Re-add foreign keys that reference staff table
            $table->foreign('assigned_driver_id')->references('id')->on('staff')->onDelete('set null');
            $table->foreign('assigned_assistant_id')->references('id')->on('staff')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            // Drop staff foreign keys
            $table->dropForeign(['assigned_driver_id']);
            $table->dropForeign(['assigned_assistant_id']);

            // Restore original foreign keys to users table
            $table->foreign('assigned_driver_id')->references('id')->on('users')->onDelete('set null');
            $table->foreign('assigned_assistant_id')->references('id')->on('users')->onDelete('set null');
        });
    }
};

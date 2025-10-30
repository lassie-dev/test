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
        Schema::table('deceaseds', function (Blueprint $table) {
            $table->string('education_level')->nullable()->after('age');
            $table->string('profession')->nullable()->after('education_level');
            $table->string('marital_status')->nullable()->after('profession');
            $table->string('religion')->nullable()->after('marital_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deceaseds', function (Blueprint $table) {
            $table->dropColumn(['education_level', 'profession', 'marital_status', 'religion']);
        });
    }
};

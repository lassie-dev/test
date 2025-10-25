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
            $table->time('death_time')->nullable()->after('death_date');
            $table->integer('age')->nullable()->after('death_time');
            $table->string('cause_of_death')->nullable()->after('age');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deceaseds', function (Blueprint $table) {
            $table->dropColumn(['death_time', 'age', 'cause_of_death']);
        });
    }
};

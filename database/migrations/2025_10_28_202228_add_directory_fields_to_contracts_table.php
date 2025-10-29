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
            $table->foreignId('church_id')->nullable()->after('agreement_id')->constrained('churches')->onDelete('set null');
            $table->foreignId('cemetery_id')->nullable()->after('church_id')->constrained('cemeteries')->onDelete('set null');
            $table->foreignId('wake_room_id')->nullable()->after('cemetery_id')->constrained('wake_rooms')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contracts', function (Blueprint $table) {
            $table->dropForeign(['church_id']);
            $table->dropForeign(['cemetery_id']);
            $table->dropForeign(['wake_room_id']);
            $table->dropColumn(['church_id', 'cemetery_id', 'wake_room_id']);
        });
    }
};

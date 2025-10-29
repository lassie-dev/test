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
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('type'); // contract, staff, vehicle, legal, certificate, permit, other
            $table->string('category')->nullable(); // insurance, license, registration, tax, health, etc.
            $table->text('description')->nullable();
            $table->string('file_path');
            $table->string('file_type'); // pdf, image, document
            $table->integer('file_size'); // in bytes
            $table->morphs('documentable'); // polymorphic relation (contract, staff member, etc)
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('cascade');
            $table->date('issue_date')->nullable();
            $table->date('expiration_date')->nullable();
            $table->boolean('expires')->default(false);
            $table->boolean('is_expired')->default(false);
            $table->string('status')->default('active'); // active, archived, expired
            $table->text('notes')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('type');
            $table->index('status');
            $table->index('expiration_date');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};

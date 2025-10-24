<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

// Welcome page
Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

// Dashboard (requires authentication and email verification)
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Dashboard Example with new layout
Route::get('/dashboard-example', function () {
    return inertia('DashboardExample');
})->middleware(['auth', 'verified'])->name('dashboard.example');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Contracts Routes - Using proper controller
    Route::resource('contracts', ContractController::class);
});

require __DIR__.'/auth.php';

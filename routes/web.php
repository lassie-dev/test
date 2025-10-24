<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'stats' => [
            'contracts_month' => 12,
            'revenue_month' => 15750000,
            'inventory_low' => 3,
            'pending_payments' => 5,
        ],
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Contracts Routes
    Route::get('/contracts', function () {
        return Inertia::render('Contracts/Index', [
            'contracts' => [],
        ]);
    })->name('contracts.index');

    Route::get('/contracts/create', function () {
        return Inertia::render('Contracts/Create');
    })->name('contracts.create');
});

require __DIR__.'/auth.php';

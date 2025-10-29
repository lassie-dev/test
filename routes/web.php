<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\WelcomeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\AgreementController;
use App\Http\Controllers\DirectoryController;
use Illuminate\Support\Facades\Route;

// Welcome page
Route::get('/', [WelcomeController::class, 'index'])->name('welcome');

// Dashboard (requires authentication and email verification)
Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

Route::middleware('auth')->group(callback: function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Contracts Routes - Using proper controller
    Route::resource('contracts', ContractController::class);

    // Contract document printing routes
    Route::get('/contracts/{contract}/print-quotation', [ContractController::class, 'printQuotation'])->name('contracts.print-quotation');
    Route::get('/contracts/{contract}/print-contract', [ContractController::class, 'printContract'])->name('contracts.print-contract');
    Route::get('/contracts/{contract}/print-social-media-auth', [ContractController::class, 'printSocialMediaAuth'])->name('contracts.print-social-media-auth');
    Route::get('/contracts/{contract}/print-receipt/{payment?}', [ContractController::class, 'printReceipt'])->name('contracts.print-receipt');

    // Contract bulk actions and export
    Route::post('/contracts/bulk-update-status', [ContractController::class, 'bulkUpdateStatus'])->name('contracts.bulk-update-status');
    Route::post('/contracts/bulk-delete', [ContractController::class, 'bulkDelete'])->name('contracts.bulk-delete');
    Route::get('/contracts/export', [ContractController::class, 'export'])->name('contracts.export');

    // Accounting exports
    Route::get('/contracts/export-softland', [ContractController::class, 'exportSoftland'])->name('contracts.export-softland');
    Route::get('/contracts/export-nubox', [ContractController::class, 'exportNubox'])->name('contracts.export-nubox');

    // Contract conversion
    Route::post('/contracts/{contract}/convert-to-immediate', [ContractController::class, 'convertToImmediate'])->name('contracts.convert-to-immediate');

    // Services
    Route::resource('services', ServiceController::class);

    // Categories - Separate routes for product and service categories (must come before resource)
    Route::get('/categories/products', [CategoryController::class, 'products'])->name('categories.products');
    Route::get('/categories/services', [CategoryController::class, 'services'])->name('categories.services');
    Route::resource('categories', CategoryController::class);

    // Inventory
    Route::resource('inventory', InventoryController::class);

    // Payments
    Route::resource('payments', PaymentController::class);
    Route::post('/payments/{payment}/mark-as-paid', [PaymentController::class, 'markAsPaid'])->name('payments.mark-as-paid');

    // Staff
    Route::resource('staff', StaffController::class);

    // Payroll
    Route::get('/payroll', [PayrollController::class, 'index'])->name('payroll.index');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::post('/reports/sales', [ReportController::class, 'sales'])->name('reports.sales');
    Route::post('/reports/staff', [ReportController::class, 'staff'])->name('reports.staff');
    Route::post('/reports/financial', [ReportController::class, 'financial'])->name('reports.financial');
    Route::get('/reports/inventory', [ReportController::class, 'inventory'])->name('reports.inventory');
    Route::get('/reports/export-sales', [ReportController::class, 'exportSales'])->name('reports.export-sales');

    // Agreements (Convenios)
    Route::resource('agreements', AgreementController::class);
    Route::get('/agreements/lookup', [AgreementController::class, 'lookup'])->name('agreements.lookup');

    // Directory (Churches, Cemeteries, Wake Rooms)
    Route::get('/directory', [DirectoryController::class, 'index'])->name('directory.index');
    Route::get('/directory/churches', [DirectoryController::class, 'churches'])->name('directory.churches');
    Route::get('/directory/cemeteries', [DirectoryController::class, 'cemeteries'])->name('directory.cemeteries');
    Route::get('/directory/wake-rooms', [DirectoryController::class, 'wakeRooms'])->name('directory.wake-rooms');

    // Expenses & P&L
    Route::get('/api/expenses/check-duplicate', [ExpenseController::class, 'checkDuplicate'])->name('expenses.check-duplicate');
    Route::resource('expenses', ExpenseController::class);
    Route::get('/expenses/profit-loss', [ExpenseController::class, 'profitLoss'])->name('expenses.profit-loss');

    // Documents
    Route::resource('documents', DocumentController::class)->except(['edit', 'update']);

    // Payroll
    Route::resource('payroll', PayrollController::class)->only(['index', 'create', 'show']);
});

require __DIR__.'/auth.php';

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
    Route::get('/contracts/{contract}/generate-document', [ContractController::class, 'generateDocument'])->name('contracts.generate-document');

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

    // Categories
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
    Route::get('/payroll/create', [PayrollController::class, 'create'])->name('payroll.create');
    Route::get('/payroll/{payroll}', [PayrollController::class, 'show'])->name('payroll.show');
    Route::post('/payroll/generate', [PayrollController::class, 'generate'])->name('payroll.generate');
    Route::post('/payroll/{payroll}/approve', [PayrollController::class, 'approve'])->name('payroll.approve');
    Route::post('/payroll/{payroll}/mark-paid', [PayrollController::class, 'markPaid'])->name('payroll.mark-paid');
    Route::post('/payroll/{payroll}/recalculate', [PayrollController::class, 'recalculate'])->name('payroll.recalculate');
    Route::get('/payroll/summary', [PayrollController::class, 'summary'])->name('payroll.summary');
    Route::post('/payroll/bulk-approve', [PayrollController::class, 'bulkApprove'])->name('payroll.bulk-approve');

    // Reports
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
    Route::post('/reports/sales', [ReportController::class, 'sales'])->name('reports.sales');
    Route::post('/reports/staff', [ReportController::class, 'staff'])->name('reports.staff');
    Route::post('/reports/financial', [ReportController::class, 'financial'])->name('reports.financial');
    Route::get('/reports/inventory', [ReportController::class, 'inventory'])->name('reports.inventory');
    Route::get('/reports/export-sales', [ReportController::class, 'exportSales'])->name('reports.export-sales');

    // Agreements (Convenios)
    Route::get('/agreements-lookup', [AgreementController::class, 'lookup'])->name('agreements.lookup');
    Route::get('/agreements/{agreement}/billing-summary', [AgreementController::class, 'billingSummary'])->name('agreements.billing-summary');
    Route::get('/agreements/{agreement}/usage-report', [AgreementController::class, 'usageReport'])->name('agreements.usage-report');
    Route::resource('agreements', AgreementController::class);

    // Directory (Churches, Cemeteries, Wake Rooms)
    Route::get('/directory', [DirectoryController::class, 'index'])->name('directory.index');

    // Churches CRUD
    Route::get('/directory/churches', [DirectoryController::class, 'churchesIndex'])->name('directory.churches.index');
    Route::get('/directory/churches/create', [DirectoryController::class, 'createChurch'])->name('directory.churches.create');
    Route::post('/directory/churches', [DirectoryController::class, 'storeChurch'])->name('directory.churches.store');
    Route::get('/directory/churches/{church}/edit', [DirectoryController::class, 'editChurch'])->name('directory.churches.edit');
    Route::put('/directory/churches/{church}', [DirectoryController::class, 'updateChurch'])->name('directory.churches.update');
    Route::delete('/directory/churches/{church}', [DirectoryController::class, 'destroyChurch'])->name('directory.churches.destroy');

    // Cemeteries CRUD
    Route::get('/directory/cemeteries', [DirectoryController::class, 'cemeteriesIndex'])->name('directory.cemeteries.index');
    Route::get('/directory/cemeteries/create', [DirectoryController::class, 'createCemetery'])->name('directory.cemeteries.create');
    Route::post('/directory/cemeteries', [DirectoryController::class, 'storeCemetery'])->name('directory.cemeteries.store');
    Route::get('/directory/cemeteries/{cemetery}/edit', [DirectoryController::class, 'editCemetery'])->name('directory.cemeteries.edit');
    Route::put('/directory/cemeteries/{cemetery}', [DirectoryController::class, 'updateCemetery'])->name('directory.cemeteries.update');
    Route::delete('/directory/cemeteries/{cemetery}', [DirectoryController::class, 'destroyCemetery'])->name('directory.cemeteries.destroy');

    // Wake Rooms CRUD
    Route::get('/directory/wake-rooms', [DirectoryController::class, 'wakeRoomsIndex'])->name('directory.wake-rooms.index');
    Route::get('/directory/wake-rooms/create', [DirectoryController::class, 'createWakeRoom'])->name('directory.wake-rooms.create');
    Route::post('/directory/wake-rooms', [DirectoryController::class, 'storeWakeRoom'])->name('directory.wake-rooms.store');
    Route::get('/directory/wake-rooms/{wakeRoom}/edit', [DirectoryController::class, 'editWakeRoom'])->name('directory.wake-rooms.edit');
    Route::put('/directory/wake-rooms/{wakeRoom}', [DirectoryController::class, 'updateWakeRoom'])->name('directory.wake-rooms.update');
    Route::delete('/directory/wake-rooms/{wakeRoom}', [DirectoryController::class, 'destroyWakeRoom'])->name('directory.wake-rooms.destroy');

    // Expenses & P&L
    Route::get('/api/expenses/check-duplicate', [ExpenseController::class, 'checkDuplicate'])->name('expenses.check-duplicate');
    Route::get('/expenses/profit-loss-report', function () {
        return inertia('features/expenses/pages/ProfitLoss');
    })->name('expenses.profit-loss-report');
    Route::get('/expenses/profit-loss', [ExpenseController::class, 'profitLoss'])->name('expenses.profit-loss');
    Route::resource('expenses', ExpenseController::class);

    // Documents
    Route::resource('documents', DocumentController::class)->except(['edit', 'update']);

    // Payroll
    Route::resource('payroll', PayrollController::class)->only(['index', 'create', 'show']);
});

require __DIR__.'/auth.php';

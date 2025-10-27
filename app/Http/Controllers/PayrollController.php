<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PayrollController extends Controller
{
    /**
     * Display the payroll management page.
     */
    public function index()
    {
        return Inertia::render('features/payroll/pages/Index');
    }
}

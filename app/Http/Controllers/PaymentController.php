<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    /**
     * Display the payments management page.
     */
    public function index()
    {
        return Inertia::render('Payments/Index');
    }
}

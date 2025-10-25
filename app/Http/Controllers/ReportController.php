<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display the reports page.
     */
    public function index()
    {
        return Inertia::render('Reports/Index');
    }
}

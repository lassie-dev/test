<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class StaffController extends Controller
{
    /**
     * Display the staff management page.
     */
    public function index()
    {
        return Inertia::render('Staff/Index');
    }
}

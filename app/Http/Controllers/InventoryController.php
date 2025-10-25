<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryController extends Controller
{
    /**
     * Display the inventory management page.
     */
    public function index()
    {
        return Inertia::render('Inventory/Index');
    }
}

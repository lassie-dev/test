<?php

namespace App\Http\Controllers;

use App\Models\Church;
use App\Models\Cemetery;
use App\Models\WakeRoom;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DirectoryController extends Controller
{
    /**
     * Display the directory index with all types
     */
    public function index(Request $request)
    {
        $search = $request->get('search', '');
        $city = $request->get('city', '');

        // Get counts for each type
        $churchesCount = Church::when($search, fn($q) => $q->search($search))
            ->when($city, fn($q) => $q->byCity($city))
            ->count();

        $cemeteriesCount = Cemetery::when($search, fn($q) => $q->search($search))
            ->when($city, fn($q) => $q->byCity($city))
            ->count();

        $wakeRoomsCount = WakeRoom::when($search, fn($q) => $q->search($search))
            ->when($city, fn($q) => $q->byCity($city))
            ->count();

        // Get unique cities for filter
        $cities = collect()
            ->merge(Church::select('city')->distinct()->pluck('city'))
            ->merge(Cemetery::select('city')->distinct()->pluck('city'))
            ->merge(WakeRoom::select('city')->distinct()->pluck('city'))
            ->unique()
            ->sort()
            ->values();

        return Inertia::render('features/directory/pages/Index', [
            'churches_count' => $churchesCount,
            'cemeteries_count' => $cemeteriesCount,
            'wake_rooms_count' => $wakeRoomsCount,
            'cities' => $cities,
            'filters' => $request->only(['search', 'city']),
        ]);
    }

    /**
     * List churches
     */
    public function churches(Request $request)
    {
        $query = Church::query();

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('city')) {
            $query->byCity($request->city);
        }

        if ($request->filled('region')) {
            $query->byRegion($request->region);
        }

        $churches = $query->orderBy('name')->paginate(20);

        return response()->json($churches);
    }

    /**
     * List cemeteries
     */
    public function cemeteries(Request $request)
    {
        $query = Cemetery::query();

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('city')) {
            $query->byCity($request->city);
        }

        if ($request->filled('type')) {
            $query->byType($request->type);
        }

        $cemeteries = $query->orderBy('name')->paginate(20);

        return response()->json($cemeteries);
    }

    /**
     * List wake rooms
     */
    public function wakeRooms(Request $request)
    {
        $query = WakeRoom::query();

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('city')) {
            $query->byCity($request->city);
        }

        $wakeRooms = $query->orderBy('name')->paginate(20);

        return response()->json($wakeRooms);
    }
}

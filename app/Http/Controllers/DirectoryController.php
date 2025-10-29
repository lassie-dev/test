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

    // ==================== CHURCHES CRUD ====================

    /**
     * Show the form for creating a new church
     */
    public function createChurch()
    {
        return Inertia::render('features/directory/pages/churches/ChurchForm');
    }

    /**
     * Store a newly created church
     */
    public function storeChurch(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'religion' => 'required|string|max:100',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'region' => 'required|string|max:100',
            'phone' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'capacity' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        Church::create($validated);

        return redirect()->route('directory.churches.index');
    }

    /**
     * Show the form for editing a church
     */
    public function editChurch(Church $church)
    {
        return Inertia::render('features/directory/pages/churches/ChurchForm', [
            'church' => $church,
        ]);
    }

    /**
     * Update the specified church
     */
    public function updateChurch(Request $request, Church $church)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'religion' => 'required|string|max:100',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'region' => 'required|string|max:100',
            'phone' => 'required|string|max:50',
            'email' => 'nullable|email|max:255',
            'capacity' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $church->update($validated);

        return redirect()->route('directory.churches.index');
    }

    /**
     * Remove the specified church
     */
    public function destroyChurch(Church $church)
    {
        $church->delete();
        return redirect()->route('directory.churches.index');
    }

    /**
     * Display churches list page
     */
    public function churchesIndex(Request $request)
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

        if ($request->filled('religion')) {
            $query->where('religion', $request->religion);
        }

        $churches = $query->orderBy('name')->paginate(20);

        $cities = Church::select('city')->distinct()->orderBy('city')->pluck('city');
        $regions = Church::select('region')->distinct()->orderBy('region')->pluck('region');

        return Inertia::render('features/directory/pages/churches/Churches', [
            'churches' => $churches,
            'filters' => $request->only(['search', 'city', 'region', 'religion']),
            'cities' => $cities,
            'regions' => $regions,
        ]);
    }

    // ==================== CEMETERIES CRUD ====================

    /**
     * Show the form for creating a new cemetery
     */
    public function createCemetery()
    {
        return Inertia::render('features/directory/pages/cemeteries/CemeteryForm');
    }

    /**
     * Store a newly created cemetery
     */
    public function storeCemetery(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:public,private,parque',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'region' => 'required|string|max:100',
            'phone' => 'required|string|max:50',
            'administrator_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'office_hours' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        Cemetery::create($validated);

        return redirect()->route('directory.cemeteries.index');
    }

    /**
     * Show the form for editing a cemetery
     */
    public function editCemetery(Cemetery $cemetery)
    {
        return Inertia::render('features/directory/pages/cemeteries/CemeteryForm', [
            'cemetery' => $cemetery,
        ]);
    }

    /**
     * Update the specified cemetery
     */
    public function updateCemetery(Request $request, Cemetery $cemetery)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:public,private,parque',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'region' => 'required|string|max:100',
            'phone' => 'required|string|max:50',
            'administrator_name' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'office_hours' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $cemetery->update($validated);

        return redirect()->route('directory.cemeteries.index');
    }

    /**
     * Remove the specified cemetery
     */
    public function destroyCemetery(Cemetery $cemetery)
    {
        $cemetery->delete();
        return redirect()->route('directory.cemeteries.index');
    }

    /**
     * Display cemeteries list page
     */
    public function cemeteriesIndex(Request $request)
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

        $cities = Cemetery::select('city')->distinct()->orderBy('city')->pluck('city');

        return Inertia::render('features/directory/pages/cemeteries/Cemeteries', [
            'cemeteries' => $cemeteries,
            'filters' => $request->only(['search', 'city', 'type']),
            'cities' => $cities,
        ]);
    }

    // ==================== WAKE ROOMS CRUD ====================

    /**
     * Show the form for creating a new wake room
     */
    public function createWakeRoom()
    {
        return Inertia::render('features/directory/pages/wake-rooms/WakeRoomForm');
    }

    /**
     * Store a newly created wake room
     */
    public function storeWakeRoom(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'funeral_home_name' => 'nullable|string|max:255',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'region' => 'required|string|max:100',
            'phone' => 'required|string|max:50',
            'capacity' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        WakeRoom::create($validated);

        return redirect()->route('directory.wake-rooms.index');
    }

    /**
     * Show the form for editing a wake room
     */
    public function editWakeRoom(WakeRoom $wakeRoom)
    {
        return Inertia::render('features/directory/pages/wake-rooms/WakeRoomForm', [
            'wakeRoom' => $wakeRoom,
        ]);
    }

    /**
     * Update the specified wake room
     */
    public function updateWakeRoom(Request $request, WakeRoom $wakeRoom)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'funeral_home_name' => 'nullable|string|max:255',
            'address' => 'required|string|max:500',
            'city' => 'required|string|max:100',
            'region' => 'required|string|max:100',
            'phone' => 'required|string|max:50',
            'capacity' => 'nullable|integer|min:0',
            'notes' => 'nullable|string',
        ]);

        $wakeRoom->update($validated);

        return redirect()->route('directory.wake-rooms.index');
    }

    /**
     * Remove the specified wake room
     */
    public function destroyWakeRoom(WakeRoom $wakeRoom)
    {
        $wakeRoom->delete();
        return redirect()->route('directory.wake-rooms.index');
    }

    /**
     * Display wake rooms list page
     */
    public function wakeRoomsIndex(Request $request)
    {
        $query = WakeRoom::query();

        if ($request->filled('search')) {
            $query->search($request->search);
        }

        if ($request->filled('city')) {
            $query->byCity($request->city);
        }

        $wakeRooms = $query->orderBy('name')->paginate(20);

        $cities = WakeRoom::select('city')->distinct()->orderBy('city')->pluck('city');

        return Inertia::render('features/directory/pages/wake-rooms/WakeRooms', [
            'wakeRooms' => $wakeRooms,
            'filters' => $request->only(['search', 'city']),
            'cities' => $cities,
        ]);
    }
}

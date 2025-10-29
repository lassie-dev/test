<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentController extends Controller
{
    public function index(Request $request)
    {
        $query = Document::with(['uploader', 'documentable']);

        // Type filter
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $documents = $query->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        // Stats
        $expiringSoonCount = Document::expiringSoon()->count();
        $expiredCount = Document::expired()->count();
        $totalCount = Document::active()->count();

        return Inertia::render('features/documents/pages/Index', [
            'documents' => $documents,
            'filters' => $request->only(['type', 'status', 'search']),
            'stats' => [
                'expiringSoon' => $expiringSoonCount,
                'expired' => $expiredCount,
                'total' => $totalCount,
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('features/documents/pages/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:contract,staff,vehicle,legal,certificate,permit,other',
            'category' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240',
            'issue_date' => 'nullable|date',
            'expiration_date' => 'nullable|date|after:issue_date',
            'expires' => 'boolean',
            'notes' => 'nullable|string',
        ]);

        $filePath = $request->file('file')->store('documents', 'public');
        $fileSize = $request->file('file')->getSize();
        $fileType = $request->file('file')->getClientOriginalExtension();

        Document::create([
            'name' => $validated['name'],
            'type' => $validated['type'],
            'category' => $validated['category'] ?? null,
            'description' => $validated['description'] ?? null,
            'file_path' => $filePath,
            'file_type' => $fileType,
            'file_size' => $fileSize,
            'uploaded_by' => auth()->id(),
            'issue_date' => $validated['issue_date'] ?? null,
            'expiration_date' => $validated['expiration_date'] ?? null,
            'expires' => $validated['expires'] ?? false,
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->route('documents.index')
            ->with('success', 'Document uploaded successfully');
    }

    public function show(Document $document)
    {
        $document->load(['uploader', 'documentable']);

        return Inertia::render('features/documents/pages/Show', [
            'document' => $document,
        ]);
    }

    public function destroy(Document $document)
    {
        if ($document->file_path) {
            \Storage::disk('public')->delete($document->file_path);
        }

        $document->delete();

        return redirect()->route('documents.index')
            ->with('success', 'Document deleted successfully');
    }
}

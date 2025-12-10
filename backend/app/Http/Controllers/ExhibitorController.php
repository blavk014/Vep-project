<?php

namespace App\Http\Controllers;

use App\Models\Exhibitor;
use Illuminate\Http\Request;

class ExhibitorController extends Controller
{
    public function index($eventId)
    {
        return Exhibitor::where('event_id', $eventId)->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'name'     => 'required|string|max:255',
            'logo'     => 'nullable|image',
            'website'  => 'nullable|string',
            'description' => 'nullable|string'
        ]);

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('exhibitors', 'public');
        }

        $exhibitor = Exhibitor::create($validated);

        return response()->json($exhibitor, 201);
    }

    public function show($id)
    {
        return Exhibitor::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $exhibitor = Exhibitor::findOrFail($id);

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'logo'     => 'sometimes|image',
            'website'  => 'sometimes|string',
            'description' => 'sometimes|string'
        ]);

        if ($request->hasFile('logo')) {
            $validated['logo'] = $request->file('logo')->store('exhibitors', 'public');
        }

        $exhibitor->update($validated);

        return response()->json($exhibitor);
    }

    public function destroy($id)
    {
        $exhibitor = Exhibitor::findOrFail($id);
        $exhibitor->delete();

        return response()->json(['message' => 'Exhibitor deleted']);
    }
}

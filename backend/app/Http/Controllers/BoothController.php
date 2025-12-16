<?php

namespace App\Http\Controllers;

use App\Models\Booth;
use App\Models\Exhibitor;
use Illuminate\Http\Request;

class BoothController extends Controller
{
    public function index($exhibitorId)
    {
        return Booth::where('exhibitor_id', $exhibitorId)->firstOrFail();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'exhibitor_id' => 'required|exists:exhibitors,id',
            'title' => 'required',
            'video_url' => 'nullable|string',
            'info' => 'nullable|string',
            'brochure' => 'nullable|file|mimes:pdf',
        ]);

        $existing = Booth::where('exhibitor_id', $request->exhibitor_id)->first();
        if ($existing) {
            return response()->json(['error' => 'Booth for this exhibitor already exists'], 409);
        }

        if ($request->hasFile('brochure')) {
            $path = $request->file('brochure')->store('booths', 'public');
            $data['brochure'] = "/storage/" . $path;
        }

        return Booth::create($data);
    }

    public function show($id)
    {
        return Booth::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $booth = Booth::findOrFail($id);

        $data = $request->validate([
            'title' => 'required',
            'video_url' => 'nullable|string',
            'info' => 'nullable|string',
            'brochure' => 'nullable|file|mimes:pdf',
        ]);

        if ($request->hasFile('brochure')) {
            $path = $request->file('brochure')->store('booths', 'public');
            $data['brochure'] = "/storage/" . $path;
        }

        $booth->update($data);
        return $booth;
    }

    public function destroy($id)
    {
        Booth::findOrFail($id)->delete();
        return response()->json(['message' => 'Booth deleted']);
    }
}


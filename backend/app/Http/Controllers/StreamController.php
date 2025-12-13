<?php

namespace App\Http\Controllers;

use App\Models\Stream;
use Illuminate\Http\Request;
use App\Events\WebRTCSignal;
use Illuminate\Support\Facades\Auth;

class StreamController extends Controller
{
    public function index($eventId)
    {
        return Stream::where('event_id', $eventId)->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'event_id' => 'required|exists:events,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date',
            'stream_url' => 'nullable|url',
        ]);

        $stream = Stream::create($validated);

        return response()->json(['stream' => $stream, 'message' => 'Stream created successfully']);
    }

    public function update(Request $request, $id)
    {
        $stream = Stream::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date',
            'stream_url' => 'nullable|url',
        ]);

        $stream->update($validated);

        return response()->json(['stream' => $stream, 'message' => 'Stream updated successfully']);
    }

    public function destroy($id)
    {
        $stream = Stream::findOrFail($id);
        $stream->delete();

        return response()->json(['message' => 'Stream deleted successfully']);
    }

    
    public function sendSignal(Request $request, $eventId)
    {
        $request->validate([
            'type' => 'required|string',
            'data' => 'required'
        ]);

        broadcast(new WebRTCSignal($eventId, [
            'type' => $request->type,
            'data' => $request->data,
            'user_id' => Auth::id(),
        ]))->toOthers();

        return response()->json(['message' => 'Signal sent']);
    }
}

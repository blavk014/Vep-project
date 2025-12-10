<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function index($eventId, $streamId = null)
    {
        $query = Chat::where('event_id', $eventId);
        if ($streamId) $query->where('stream_id', $streamId);

        return $query->with('user')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'stream_id' => 'nullable|exists:streams,id',
            'message' => 'required|string|max:1000',
        ]);

        $chat = Chat::create([
            'event_id' => $request->event_id,
            'stream_id' => $request->stream_id,
            'user_id' => Auth::id(),
            'message' => $request->message,
        ]);

        return response()->json(['chat' => $chat]);
    }
}

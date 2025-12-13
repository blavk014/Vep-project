<?php

namespace App\Http\Controllers;

use App\Events\PollUpdated;
use App\Models\Poll;
use App\Models\PollOption;
use App\Models\PollVote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Events\PollVoted;

class PollController extends Controller
{
    public function index($eventId, $streamId = null)
    {
        $query = Poll::where('event_id', $eventId);
        if ($streamId) $query->where('stream_id', $streamId);

       return $query->with('options.votes')->get();

    }

    public function store(Request $request)
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'stream_id' => 'nullable|exists:streams,id',
            'question' => 'required|string|max:255',
            'options' => 'required|array|min:2',
        ]);

        $poll = Poll::create([
            'event_id' => $request->event_id,
            'stream_id' => $request->stream_id,
            'question' => $request->question,
        ]);

        foreach ($request->options as $opt) {
            PollOption::create(['poll_id' => $poll->id, 'option_text' => $opt]);
        }

        return response()->json(['poll' => $poll]);
    }

    public function vote(Request $request, $pollId)
{
    $request->validate([
        'option_id' => 'required|exists:poll_options,id',
    ]);

    $vote = PollVote::updateOrCreate(
        [
            'poll_id' => $pollId,
            'user_id' => Auth::id(),
        ],
        [
            'option_id' => $request->option_id,
        ]
    );

    broadcast(new PollUpdated($pollId))->toOthers();

    return response()->json(['message' => 'Vote recorded']);
}
}

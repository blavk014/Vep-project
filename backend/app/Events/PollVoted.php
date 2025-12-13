<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class PollUpdated implements ShouldBroadcast
{
    public int $pollId;

    public function __construct(int $pollId)
    {
        $this->pollId = $pollId;
    }

    public function broadcastOn()
    {
        return new Channel('polls');
    }

    public function broadcastAs()
    {
        return 'poll.updated';
    }
}

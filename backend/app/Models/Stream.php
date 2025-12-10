<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Stream extends Model
{
    protected $fillable = [
        'event_id', 'title', 'description', 'start_time', 'end_time', 'stream_url'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}

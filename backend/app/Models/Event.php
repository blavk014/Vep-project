<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;




class Event extends Model
{
    protected $fillable = [
        'title', 'description', 'banner', 'start_time', 'end_time'
    ];

    public function streams()
    {
        return $this->hasMany(Stream::class);
    }

    public function chats()
    {
        return $this->hasMany(Chat::class);
    }

    public function polls()
    {
        return $this->hasMany(Poll::class);
    }
    public function exhibitors()
    {
    return $this->hasMany(Exhibitor::class);
    }

}

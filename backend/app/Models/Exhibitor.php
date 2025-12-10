<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Exhibitor extends Model
{
   protected $fillable = [
        'event_id', 'name', 'logo', 'website', 'description'
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
    public function booths()
    {
    return $this->hasMany(Booth::class);
    }

}

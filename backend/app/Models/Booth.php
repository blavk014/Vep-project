<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booth extends Model
{
    protected $fillable = [
        'exhibitor_id',
        'title',
        'video_url',
        'info',
        'brochure'
    ];

    public function exhibitor()
    {
        return $this->belongsTo(Exhibitor::class);
    }
}


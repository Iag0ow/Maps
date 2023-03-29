<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shape extends Model
{
    use HasFactory;
    protected $table = 'shapes';
        protected $fillable = [
        'center_lat',
        'center_lng',
        'radius',
    ];
}
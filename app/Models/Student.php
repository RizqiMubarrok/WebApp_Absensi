<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'nis',
        'name',
        'gender',
        'email',
        'class',
        'phone',
        'address',
    ];

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }
}

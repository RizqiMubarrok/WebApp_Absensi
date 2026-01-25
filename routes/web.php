<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    // Redirect root to the login page so the artisan serve URL opens the login by default.
    // Guest middleware on the login route will forward authenticated users to the home/dashboard as needed.
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// Dashboard stats endpoint for charts
Route::get('/dashboard/stats', [\App\Http\Controllers\DashboardController::class, 'stats'])
    ->middleware(['auth'])->name('dashboard.stats');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Students management (pages + actions)
    Route::resource('students', \App\Http\Controllers\StudentController::class);
    // CSV import for bulk student creation/update
    Route::post('students/import', [\App\Http\Controllers\StudentController::class, 'import'])->name('students.import');
    Route::get('students/import/template', [\App\Http\Controllers\StudentController::class, 'importTemplate'])->name('students.import.template');

    // Attendance management
    Route::get('attendances/rekap/print', [\App\Http\Controllers\AttendanceController::class, 'rekapPrint'])->name('attendances.rekap.print');
    Route::get('attendances/rekap/export', [\App\Http\Controllers\AttendanceController::class, 'rekapExport'])->name('attendances.rekap.export');
    Route::get('attendances/rekap', [\App\Http\Controllers\AttendanceController::class, 'rekap'])->name('attendances.rekap');
    Route::get('attendances/classes', [\App\Http\Controllers\AttendanceController::class, 'classes'])->name('attendances.classes');
    Route::get('attendances', [\App\Http\Controllers\AttendanceController::class, 'index'])->name('attendances.index');
    Route::post('attendances', [\App\Http\Controllers\AttendanceController::class, 'store'])->name('attendances.store');
});

require __DIR__.'/auth.php';

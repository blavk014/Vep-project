<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventRegistrationController;
use App\Http\Controllers\StreamController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\PollController;
use App\Http\Controllers\ExhibitorController;
use App\Http\Controllers\BoothController;

    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);


    Route::middleware('auth:sanctum')->group(function () {

        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);

    
        Route::middleware('role:admin')->get('/admin-only', fn() => response()->json(['message' => 'Welcome admin']));
        Route::middleware('role:speaker')->get('/speaker-only', fn() => response()->json(['message' => 'Welcome speaker']));
        Route::middleware('role:attendee')->get('/attendee-only', fn() => response()->json(['message' => 'Welcome attendee']));

        Route::get('/events', [EventController::class, 'index']);
        Route::get('/events/{id}', [EventController::class, 'show']);

    
        Route::post('/events/{id}/register', [EventRegistrationController::class, 'register']);
        Route::delete('/events/{id}/register', [EventRegistrationController::class, 'unregister']);
        Route::get('/my-registrations', [EventRegistrationController::class, 'myRegistrations']);
        Route::get('/events/{event}/chats/{stream?}', [ChatController::class, 'index']);
        Route::post('/chats', [ChatController::class, 'store']);
        Route::get('/events/{event}/polls/{stream?}', [PollController::class, 'index']);
        Route::post('/polls', [PollController::class, 'store']);
        Route::post('/polls/{poll}/vote', [PollController::class, 'vote']);
        Route::get('/events/{eventId}/exhibitors', [ExhibitorController::class, 'index']);
        Route::get('/exhibitors/{id}', [ExhibitorController::class, 'show']);
        Route::post('/signal/offer', [StreamController::class, 'sendOffer']);
        Route::post('/signal/answer', [StreamController::class, 'sendAnswer']);
        Route::post('/signal/candidate', [StreamController::class, 'sendCandidate']);

   
        Route::middleware('role:admin')->group(function () {

        Route::post('/events', [EventController::class, 'store']);
        Route::put('/events/{id}', [EventController::class, 'update']);
        Route::delete('/events/{id}', [EventController::class, 'destroy']);

       
        Route::get('/events/{eventId}/streams', [StreamController::class, 'index']);
        Route::post('/streams', [StreamController::class, 'store']);
        Route::put('/streams/{id}', [StreamController::class, 'update']);
        Route::delete('/streams/{id}', [StreamController::class, 'destroy']);

        Route::post('/exhibitors', [ExhibitorController::class, 'store']);
        Route::put('/exhibitors/{id}', [ExhibitorController::class, 'update']);
        Route::delete('/exhibitors/{id}', [ExhibitorController::class, 'destroy']);
        Route::get('/admin/exhibitors/{id}/booths', [BoothController::class, 'index']);
        Route::post('/admin/booths', [BoothController::class, 'store']);
        Route::get('/admin/booths/{id}', [BoothController::class, 'show']);
        Route::put('/admin/booths/{id}', [BoothController::class, 'update']);
        Route::delete('/admin/booths/{id}', [BoothController::class, 'destroy']);
        });
        });

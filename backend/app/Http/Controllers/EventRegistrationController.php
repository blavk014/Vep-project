<?php

namespace App\Http\Controllers;

use App\Models\EventRegistration;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EventRegistrationController extends Controller
{
    
    public function register(Request $request, $id)
    {
        
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        
        $exists = EventRegistration::where('event_id', $id)
            ->where('user_id', $user->id)
            ->first();

        if ($exists) {
            return response()->json(['message' => 'Already registered'], 409);
        }

        $registration = EventRegistration::create([
            'event_id' => $id,
            'user_id' => $user->id,
        ]);

        return response()->json([
            'message' => 'Registered successfully',
            'registration' => $registration
        ], 201);
    }

    
    public function unregister(Request $request, $id)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        EventRegistration::where('event_id', $id)
            ->where('user_id', $user->id)
            ->delete();

        return response()->json(['message' => 'Registration removed']);
    }

    
    public function myRegistrations(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $registrations = EventRegistration::with('event')
            ->where('user_id', $user->id)
            ->get();

        return response()->json(['registrations' => $registrations]);
    }
}

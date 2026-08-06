<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Login;
use App\Services\ActivityLogService;


class AuthController extends Controller
{
    public function login(Request $request)
{
    $request->validate([
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The credentials are incorrect.'],
        ]);
    }

    event(new Login('web', $user, false));

    $token = $user->createToken('authToken')->plainTextToken;

    // Load roles
    $user->load('roles');
    ActivityLogService::log(
    'Authentication',
    'LOGIN',
    "User {$user->name} logged in",
    null,
    $user->id
);

    return response()->json([
        'token' => $token,
        'user' => $user,
        'roles' => $user->getRoleNames(),
        'permissions' => $user->getAllPermissions()->pluck('name'),
    ]);
}

    public function logout(Request $request)
    {

        ActivityLogService::log(
        'Authentication',
        'LOGOUT',
        "User {$request->user()->name} logged out"
        );

        $request->user()->tokens()->delete();

        return response()->json(['message' => 'Logged out']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
   public function changePassword(Request $request)
    {
        $request->validate([
            'old_password' => 'required',
            'new_password' => 'required|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['message' => 'Old password does not match'], 400);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json(['message' => 'Password changed successfully']);
    }


}

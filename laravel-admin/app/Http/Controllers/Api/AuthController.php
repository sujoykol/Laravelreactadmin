<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Auth\Events\Login;
use App\Services\ActivityLogService;
use Illuminate\Support\Str;
use App\Models\RefreshToken;


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

    $accessToken = $user->createToken('authToken')->plainTextToken;
    $refreshToken = Str::random(64);
    RefreshToken::create([

        'user_id'=>$user->id,

        'token'=>hash('sha256',$refreshToken),

        'expires_at'=>now()->addDays(7),

    ]);

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

    'access_token'=>$accessToken,

    'refresh_token'=>$refreshToken,

    'expires_in'=>900,

    'user'=>$user,

    'roles'=>$user->getRoleNames(),

    'permissions'=>$user->getAllPermissions()->pluck('name'),

    ]);
}
    public function refresh(Request $request){

        $request->validate([
            'refresh_token'=>'required'
        ]);


        $token = RefreshToken::where(
            'token',
            hash('sha256',$request->refresh_token)
        )
        ->where('revoked',false)
        ->where('expires_at','>',now())
        ->first();


        if(!$token){

        return response()->json([
            'message'=>'Invalid refresh token'
        ],401);

        }


        $user = $token->user;


        // optional: remove old access tokens

        $user->tokens()->delete();


        $newAccessToken = $user->createToken(
            'authToken'
        )->plainTextToken;


        return response()->json([

        'access_token'=>$newAccessToken,

        'expires_in'=>900

        ]);

}

    public function logout(Request $request){
    $user = $request->user();


    // Remove access token
    $user->currentAccessToken()->delete();


    // Revoke refresh tokens
    $user->refreshTokens()
         ->update([
             'revoked'=>true
         ]);


    return response()->json([
        'message'=>'Logged out successfully'
    ]);
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

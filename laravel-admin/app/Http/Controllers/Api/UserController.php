<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::with('roles')->get());
    }

    public function store(Request $request)
    {
        $user = User::create([
            'name' => $request->name,
            'email'=> $request->email,
            'password'=> bcrypt($request->password),
        ]);
        return response()->json($user);
    }

    public function show($id)
    {
        return response()->json(User::with('roles')->findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->update($request->only(['name', 'email']));
        return response()->json($user);
    }

    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(['message' => 'User deleted']);
    }

    public function assignRole(Request $request, $id)
    {
        $request->validate([
        'role' => 'required|string|exists:roles,name', // validate role name
    ]);

    $user = User::findOrFail($id);
    $user->syncRoles([$request->role]); // removes old roles, assigns new one

    return response()->json(['message' => 'Role assigned successfully']);
    }

    public function revokeRole(Request $request, $id)
    {
        $user = User::findOrFail($id);
        $user->removeRole($request->role);
        return response()->json(['message' => 'Role revoked']);
    }
}

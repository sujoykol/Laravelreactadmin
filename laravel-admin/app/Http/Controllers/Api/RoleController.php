<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        return response()->json(Role::with('permissions')->get());
    }

    public function store(Request $request)
    {
        $role = Role::create(['name' => $request->name]);
        return response()->json($role);
    }

    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $role->update(['name' => $request->name]);
        return response()->json($role);
    }

    public function destroy($id)
    {
        Role::destroy($id);
        return response()->json(['message' => 'Role deleted']);
    }

    public function givePermission(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $role->givePermissionTo($request->permission);
        return response()->json(['message' => 'Permission assigned']);
    }

    public function revokePermission(Request $request, $id)
    {
        $role = Role::findOrFail($id);
        $role->revokePermissionTo($request->permission);
        return response()->json(['message' => 'Permission revoked']);
    }
}


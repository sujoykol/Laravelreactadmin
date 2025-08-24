<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    public function index()
    {
        return response()->json(Permission::all());
    }

    public function store(Request $request)
    {
        $permission = Permission::create(['name' => $request->name]);
        return response()->json($permission);
    }

    public function update(Request $request, $id)
    {
        $permission = Permission::findOrFail($id);
        $permission->update(['name' => $request->name]);
        return response()->json($permission);
    }

    public function destroy($id)
    {
        Permission::destroy($id);
        return response()->json(['message' => 'Permission deleted']);
    }
}

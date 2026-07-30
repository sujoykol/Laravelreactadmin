<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    /**
     * Display all roles with permissions.
     */
    public function index()
    {
        return response()->json(
            Role::with('permissions')->get()
        );
    }

    /**
     * Create a new role.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
        ]);

        $role = Role::create($validated);

        return response()->json([
            'message' => 'Role created successfully',
            'data' => $role,
        ], 201);
    }

    /**
     * Update an existing role.
     */
    public function update(Request $request, $id)
    {
        $role = Role::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
        ]);

        $role->update($validated);

        return response()->json([
            'message' => 'Role updated successfully',
            'data' => $role,
        ]);
    }

    /**
     * Delete a role.
     */
    public function destroy($id)
    {
        $role = Role::findOrFail($id);

        $role->delete();

        return response()->json([
            'message' => 'Role deleted successfully',
        ]);
    }

    /**
     * Assign a permission to a role.
     */
    public function givePermission(Request $request, $id)
    {
        $validated = $request->validate([
            'permission' => 'required|string|exists:permissions,name',
        ]);

        $role = Role::findOrFail($id);

        if (!$role->hasPermissionTo($validated['permission'])) {
            $role->givePermissionTo($validated['permission']);
        }

        return response()->json([
            'message' => 'Permission assigned successfully',
        ]);
    }

    /**
     * Revoke a permission from a role.
     */
    public function revokePermission(Request $request, $id)
    {
        $validated = $request->validate([
            'permission' => 'required|string|exists:permissions,name',
        ]);

        $role = Role::findOrFail($id);

        if ($role->hasPermissionTo($validated['permission'])) {
            $role->revokePermissionTo($validated['permission']);
        }

        return response()->json([
            'message' => 'Permission revoked successfully',
        ]);
    }
}
<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SliderController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\Api\PermissionController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ActivityLogController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
        Route::get('/users', [UserController::class, 'index'])
        ->middleware('permission:users.view');

    Route::post('/users', [UserController::class, 'store'])
        ->middleware('permission:users.create');

    Route::get('/users/{id}', [UserController::class, 'show'])
        ->middleware('permission:users.view');

    Route::put('/users/{id}', [UserController::class, 'update'])
        ->middleware('permission:users.update');

    Route::delete('/users/{id}', [UserController::class, 'destroy'])
        ->middleware('permission:users.delete');

    // Roles
    Route::get('/roles', [RoleController::class, 'index']);
    Route::post('/roles', [RoleController::class, 'store']);
    Route::put('/roles/{id}', [RoleController::class, 'update']);
    Route::delete('/roles/{id}', [RoleController::class, 'destroy']);

    // Permissions
    Route::get('/permissions', [PermissionController::class, 'index']);
    Route::post('/permissions', [PermissionController::class, 'store']);
    Route::put('/permissions/{id}', [PermissionController::class, 'update']);
    Route::delete('/permissions/{id}', [PermissionController::class, 'destroy']);

    // Assign Role to User
    Route::post('/users/{id}/assign-role', [UserController::class, 'assignRole']);
    Route::post('/users/{id}/revoke-role', [UserController::class, 'revokeRole']);

    // Assign Permission to Role
    Route::post('/roles/{id}/give-permission', [RoleController::class, 'givePermission']);
    Route::post('/roles/{id}/revoke-permission', [RoleController::class, 'revokePermission']);


    Route::get('/me', [AuthController::class, 'me']);
    Route::apiResource('products', ProductController::class);
    Route::apiResource('sliders', SliderController::class);
    Route::apiResource('categories', CategoryController::class);
    Route::apiResource('customers', CustomerController::class);
    Route::patch('customers/{customer}/toggle-status', [CustomerController::class, 'toggleStatus']);
    Route::patch('sliders/{slider}/toggle-status', [SliderController::class, 'toggleStatus']);
    Route::patch('products/{product}/toggle-status', [ProductController::class, 'toggleStatus']);
    Route::patch('categories/{category}/toggle-status', [CategoryController::class, 'toggleStatus']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/change-password', [AuthController::class, 'changePassword']);

    Route::get('/activity-logs', [ActivityLogController::class, 'index'])
        ->middleware('permission:activitylogs.view');

    Route::get('/activity-logs/{id}', [ActivityLogController::class, 'show'])
        ->middleware('permission:activitylogs.view');
});

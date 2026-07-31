<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;

class ActivityLogController extends Controller
{
    public function index()
    {
        $logs = ActivityLog::with('user')
            ->latest()
            ->paginate(10);

        return response()->json($logs);
    }

    public function show($id)
    {
        return ActivityLog::with('user')
            ->findOrFail($id);
    }
}
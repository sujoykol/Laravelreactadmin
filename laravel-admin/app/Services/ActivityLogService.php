<?php

namespace App\Services;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

class ActivityLogService
{
    /**
     * Write an activity log.
     *
     * @param string   $module
     * @param string   $action
     * @param string   $description
     * @param int|null $recordId   ID of the affected record (Product, User, Category, etc.)
     * @param int|null $userId     User performing the action. If null, Auth::id() is used.
     */
    public static function log(
        string $module,
        string $action,
        string $description,
        ?int $recordId = null,
        ?int $userId = null
    ): void {

        ActivityLog::create([

            // Actor
            'user_id' => $userId ?? Auth::id(),

            // What happened
            'module' => $module,
            'action' => strtoupper($action),
            'description' => $description,

            // Affected record
            'record_id' => $recordId,

            // Request information
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
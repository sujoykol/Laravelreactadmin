<?php

namespace App\Listeners;
use Illuminate\Auth\Events\Login;
use App\Models\LoginLog;
use Jenssegers\Agent\Agent;


class LogSuccessfulLogin
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        $agent = new Agent();
        \Log::info('Login listener executed');
        LoginLog::create([
            'user_id' => $event->user->id,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'browser' => $agent->browser(),
            'platform' => $agent->platform(),
            'login_at' => now(),
        ]);
    }
}

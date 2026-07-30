<?php

namespace App\Events;

use App\Models\User;
use Illuminate\Http\Request;

class UserLoggedIn
{
    public $user;
    public $request;

    public function __construct(User $user, Request $request)
    {
        $this->user = $user;
        $this->request = $request;
    }
}
<?php

namespace Phpblaze\Bladelib\Middles;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

class CA1
{
    /**
     * Handle an incoming request.
     *
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (strSync() && migSync() && !strSplic()) {
            if (Route::has('login')) {
                return to_route('login');
            }
        }

        return $next($request)
            ->header('Cache-control', 'no-control, no-store, max-age=0, must-revalidate')
            ->header('Pragma', 'no-cache')->header('Exprires', 'Sat 01 Jan 1990 00:00:00 GMT');
    }
}

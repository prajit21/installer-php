<?php

namespace Phpblaze\Bladelib\Middles;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class B2
{
  /**
   * Handle an incoming request.
   *
   * @return mixed
   */
  public function handle(Request $request, Closure $next)
  {
    if (!strSync()) {
      DB::connection()->getPDO();
      if (DB::connection()->getDatabaseName()) {
          if (env('DB_DATABASE') && env('DB_USERNAME') && env('DB_CONNECTION')) {
              if (Schema::hasTable('seeders') && !migSync()) {
                  if (DB::table('seeders')->count()) {
                      return to_route('install.license');
                  }
              }
          }
      }

      return to_route('install.requirements');
    }

    if ($request->is('install/*')) {
      return $next($request)->header('Cache-control', 'no-control, no-store, max-age=0, must-revalidate')->header('Pragma', 'no-cache')->header('Exprires', 'Sat 01 Jan 1990 00:00:00 GMT');
    }

    return $next($request);
  }
}

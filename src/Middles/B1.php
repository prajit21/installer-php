<?php

namespace Phpblaze\Bladelib\Middles;

use Closure;
use Illuminate\Http\Request;

class B1
{
  /**
   * Handle an incoming request.
   *
   * @return mixed
   */
  public function handle(Request $request, Closure $next)
  {
    $response = $next($request);
    $response->headers->set('Accept', 'application/json');
    if (strSplic()) {
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT, DELETE');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Requested-With, Application');

        throw new \Illuminate\Http\Exceptions\HttpResponseException(response()->json([
            'message' => 'Your license is blocked. Please acquire a new license for continued access.',
            'success' => false
        ], 400));
    }

    return $response;
  }
}

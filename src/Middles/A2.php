<?php

namespace Phpblaze\Bladelib\Middles;

use Closure;
use Illuminate\Http\Request;

class A2
{
    /**
     * Handle an incoming request.
     *
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if (!strSync()) {
          throw new \Illuminate\Http\Exceptions\HttpResponseException(response()->json([
              'message' => 'Complete the installation process before running the API',
              'success' => false
          ], 400));
      }

      if (strSplic() && $request->is('admin/*')) {
          throw new \Illuminate\Http\Exceptions\HttpResponseException(response()->json([
              'message' => 'Your license has been blocked. Please acquire a new license for continued usage.',
              'success' => false
          ], 400));
      }

      $response = $next($request);
      $response->headers->set('Cache-control', 'no-control, no-store, max-age=0, must-revalidate');
      $response->headers->set('Pragma', 'no-cache');
      $response->headers->set('Exprires', 'Sat 01 Jan 1990 00:00:00 GMT');

      return $response;
    }
}

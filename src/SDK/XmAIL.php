<?php

namespace Phpblaze\Bladelib\SDK;

use Exception;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Http;
use Phpblaze\Bladelib\Ex9t;

class XmAIL
{
    public function retLe()
    {

        try {

            $fP = __DIR__ . '/../../' . 'fzip.li.dic';
            if (strFlExs($fP)) {
                $jD = file_get_contents($fP);
                if ($jD && isset($jD)) {
                    return \Illuminate\Support\Facades\Http::post('https://laravel.pixelstrap.net/verify/api/reset/license', [
                        'key' => $jD
                    ]);
                }
            }

        } catch (Exception $e) {

            throw $e;
        }
    }

    public function vl($r)
    {

        try {

            $ls = $r->all();
            if (strPrp()) {
                $rs = \Illuminate\Support\Facades\Http::post('https://laravel.pixelstrap.net/verify/api/envato', [
                    'key' => trim($ls['license']),
                    'envato_username' => $ls['envato_username'],
                    'domain' => str_replace(['block/license/verify', 'install/license', 'install/verify'], '', url()->current()),
                    'project_id' => env('APP_ID'),
                    'server_ip' => $_SERVER['SERVER_ADDR'] ?? $_SERVER['REMOTE_ADDR'],
                ]);

                if ($rs?->status() == \Illuminate\Http\Response::HTTP_OK) {
                    $fP = public_path('cj7kl89.tmp');
                    if (strFlExs($fP)) {
                        strFilRM($fP);
                    }

                    file_put_contents($fP, bXenPUnt($_SERVER['SERVER_ADDR'] ?? $_SERVER['REMOTE_ADDR']));
                }

                return $rs;
            }

        } catch (Exception $e) {

            throw $e;
        }

    }

    public function lg($cnDTyP, $trGLi, $cHtne = null, $dHtne = null)
    {

        try {

            if (strPrp()) {
                $jDm = null;
                $rgLi = null;
                $rIp = null;
                $fP = public_path('_log.dic.xml');
                if (strFlExs($fP)) {
                    $jDm = file_get_contents($fP);
                    if (!is_null($jDm)) {
                        $jDm = xMailBIL($jDm);
                    }
                }

                $fP = public_path('fzip.li.dic');
                if (strFlExs($fP)) {
                    $jLi = file_get_contents($fP);
                    if (!is_null($jLi)) {
                        $rgLi = xMailBIL($jLi);
                    }
                }

                $fP = public_path('cj7kl89.tmp');
                if (strFlExs($fP)) {
                    $jIp = file_get_contents($fP);
                    if (!is_null($jIp)) {
                        $rIp = xMailBIL($jIp);
                    }
                }


                $ul = url()?->current();
                if ($jDm && $rgLi) {
                    return \Illuminate\Support\Facades\Http::post('https://laravel.pixelstrap.net/verify/api/logs', [
                        'key' => $rgLi,
                        'registered_domain' => $dHtne,
                        'requested_domain' => $cHtne,
                        'registered_ip' => $rIp,
                        'requested_ip' => $_SERVER['SERVER_ADDR'] ?? $_SERVER['REMOTE_ADDR'],
                        'condition_type' => $cnDTyP,
                        'triggered_line' => $trGLi,
                    ]);
                }
            }

        } catch (Exception $e) {

            throw $e;
        }
    }
}

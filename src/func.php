<?php

use Illuminate\Http\Request;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
use Phpblaze\Bladelib\Sail\Sail;
use Phpblaze\Bladelib\SDK\XmAIL;
use Symfony\Component\Console\Input\ArgvInput;

if (!function_exists('xMailBIL')) {
  function xMailBIL($exUnt)
  {
    return Sail::xsail($exUnt);
  }
}

if (!function_exists('strPrp')) {
  function strPrp()
  {
    if (!env('APP_ID')) {
      if (!config('app.id')) {
        throw new Exception('Removed APP ID', 500);
      }
    }

    return true;
  }
}

if (!function_exists('strAlPbFls')) {
  function strAlPbFls()
  {
    return [
      public_path('_log.dic.xml'),
      public_path('fzip.li.dic'),
      public_path('cj7kl89.tmp'),
      public_path(config('config.migration')),
      public_path(config('config.installation'))
    ];
  }
}

if (!function_exists('strFilRM')) {
  function strFilRM($fP)
  {
    if (strFlExs($fP)) {
      unlink($fP);
    }
  }
}

if (!function_exists('strFlExs')) {
  function strFlExs($fP)
  {
    return file_exists($fP);
  }
}

if (!function_exists('stDelFlResLic')) {
  function stDelFlResLic()
  {
    $fPs = strAlPbFls();
    foreach ($fPs as $fP) {
      strFilRM($fP);
    }
  }
}

if (!function_exists('scMePkS')) {
  function scMePkS()
  {

    $pNe = 'phpblaze/bladelib';
    if (igetCrPNe($pNe)) {
      return true;
    }
    return false;
  }
}

if (!function_exists('igetCrPNe')) {
  function igetCrPNe($pNe)
  {
    $cr = json_decode(file_get_contents(base_path('composer.json')), true);
    if (isset($cr['require'][$pNe])) {
      return true;
    }
    return false;
  }
}

function __kernel($a)
{
  if (scMePkS()) {
    return $a->make(Kernel::class);
  }
}

function _DIR_($d)
{
  if (scMePkS()) {
    return $d;
  }
}

function ini_app($d)
{
  if (scMePkS()) {
    return new \Illuminate\Foundation\Application(
      $_ENV['APP_BASE_PATH'] ?? $d
    );
  }
}

function singleton($app)
{
  if (scMePkS()) {
    return $app;
  }
}

function scDotPkS()
{
  $pNe = 'jackiedo/dotenv-editor';
  if (!igetCrPNe($pNe)) {
    if (!env('DB_DATABASE') || !env('DB_USERNAME') || !env('DB_CONNECTION')) {
      throw new Exception('.env database credential is invalid', 500);
    }
    return false;
  }
  return true;
}

function scSpatPkS()
{
  $pNe = 'spatie/laravel-permission';
  if (!igetCrPNe($pNe)) {
    return false;
  }
  return true;
}

function datSync()
{
  try {

    if (env('DB_DATABASE') && env('DB_USERNAME') && env('DB_CONNECTION')) {
      DB::connection()->getPDO();
      if (DB::connection()->getDatabaseName()) {
        if (Schema::hasTable('migrations')) {
          if (DB::table('migrations')->count()) {
            return true;
          }
          return false;
        }
      }
    }

    return false;
  } catch (Exception $e) {

    return false;
  }
}

function schSync()
{
  try {

    if (strPrp()) {
      DB::connection()->getPDO();
      if (DB::connection()->getDatabaseName()) {
        if (env('DB_DATABASE') && env('DB_USERNAME') && env('DB_CONNECTION')) {
          if (Schema::hasTable('migrations') && !migSync()) {
            if (DB::table('migrations')->count()) {
              return true;
            }
            return false;
          }
        }
      }
    }

    return false;

  } catch (Exception $e) {

    return false;
  }
}

function liSync()
{
  $fP = public_path('_log.dic.xml');
  if (strFlExs($fP)) {
    $jD = file_get_contents($fP);
    if (str_contains(url()?->current(), 'localhost') || str_contains(url()->current(), '127.0.0.1')) {
      return true;
    }

    if ($jD && isset($jD)) {
      $cUl = url()?->current();
      if (!preg_match("~^(?:f|ht)tps?://~i", $cUl)) {
        $cUl = "http://" . $cUl;
      }

      $cHtne = parse_url($cUl, PHP_URL_HOST);
      $dHtne = parse_url(xMailBIL($jD), PHP_URL_HOST);

      // Check if the host is an IP address
      if (filter_var($cHtne, FILTER_VALIDATE_IP)) {
        $fiP = public_path('cj7kl89.tmp');
        if (strFlExs($fiP)) {
          $jiP = file_get_contents($fiP);
          if (($_SERVER['SERVER_ADDR']) == xMailBIL($jiP) || ($_SERVER['REMOTE_ADDR'] == xMailBIL($jiP))) {
            return true;
          }
        }

        $pHut = new XmAIL();
        $pHut->lg('IP Address Mismatch', 'liSync() line: 221', "full URL: " . url()?->current() . "\n" . " SERVER_ADDR:" . ($_SERVER['SERVER_ADDR']) . "\n" . " REMOTE_ADDR: " . ($_SERVER['REMOTE_ADDR']), "jiP: " . xMailBIL($jiP));
        $fP = __DIR__ . '/..//' . '_log.dic.xml';
        strFilRM($fP);

        $fP = __DIR__ . '/..//' . config('config.installation');
        strFilRM($fP);

        return false;
      }

      if ($cHtne == $dHtne || ($cHtne == "www." . $dHtne) || ("www." . $cHtne == $dHtne)) {
        return true;
      } else {
        $fiP = public_path('cj7kl89.tmp');
        if (strFlExs($fiP)) {
          $jiP = file_get_contents($fiP);
          if (($_SERVER['SERVER_ADDR']) == xMailBIL($jiP) || ($_SERVER['REMOTE_ADDR'] == xMailBIL($jiP))) {
            return true;
          }
        }
      }
    }

    if (!str_contains(url()->current(), 'localhost') && !str_contains(url()->current(), '127.0.0.1')) {
      $pHut = new XmAIL();
      $pHut->lg('Domain Mismatch', 'liSync() line: 238', "full URL: " . url()?->current() . "\n" . "cHtne: ($cHtne)", "dHtne: " . $dHtne);
      $fP = __DIR__ . '/..//' . '_log.dic.xml';
      strFilRM($fP);

      $fP = __DIR__ . '/..//' . config('config.installation');
      strFilRM($fP);

      return false;
    }

    return true;
  }

  return false;
}

function strSplic()
{
  if (strSync() && migSync() && liSync()) {
    $fP = __DIR__ . '/..//' . '.vite.js';
    if (strFlExs($fP)) {
      return true;
    }
  }

  return false;
}

function strSync()
{
  if (strPrp() && liSync()) {
    $fP = public_path(config('config.installation'));
    if (strFlExs($fP)) {
      return true;
    }

    if (schSync()) {
      return true;
    }
  }

  return false;
}

function migSync()
{
  // Level 3
  // return eval(Ex9t::xM8qT5K('migSync', '=RkTnLQSDtNAppuU1NjOLZuNKVDIQI9H'));

  //  Level 2
  // if (strPrp() && liSync()) {
  //     $fP = public_path(config(xMailBIL('Y29uZmlnLm1pZ3JhdGlvbg==')));
  //     if (strFlExs($fP)) {
  //         return true;
  //     }
  // }
  // return false;

  // Level 1
  if (strPrp() && liSync()) {
    $fP = public_path(config('config.migration'));
    if (strFlExs($fP)) {
      return true;
    }
  }
  return false;
}

if (!function_exists('bXenPUnt')) {
  function bXenPUnt($pUnt)
  {
    //  Level 3
    // return eval(Ex9t::xM8qT5K('bXenPUnt', 'EjOVmftSupNAppuU1NjOLZuNKVDIQI9H'));

    //  Level 1
    return base64_encode($pUnt);
  }
}

if (!function_exists('imIMgDuy')) {
  function imIMgDuy()
  {
    // Level 3
    // return eval(Ex9t::xM8qT5K('imIMgDuy', 'ppDZRtvBHjNAppuU1NjOLZuNKVDIQI9H'));

    // Level 2
    // if (env(xMailBIL('RFVNTVlfSU1BR0VTX1VSTA=='))) {
    //     $sP = storage_path(xMailBIL('YXBwL3B1YmxpYw=='));
    //     if (!strFlExs($sP)) {
    //         mkdir($sP, 0777, true);
    //         $rePose = Http::timeout(0)->get(env(xMailBIL('RFVNTVlfSU1BR0VTX1VSTA==')));
    //         if ($rePose?->successful()) {
    //             $fN = basename(env(xMailBIL('RFVNTVlfSU1BR0VTX1VSTA==')));
    //             $zFP = $sP . '/' . $fN;
    //             file_put_contents($zFP, $rePose?->getBody());
    //             if (iZf($zFP)) {
    //                 $zp = new ZipArchive;
    //                 if ($zp->open($zFP) === TRUE) {
    //                     $zp->extractTo($sP);
    //                     $zp->close();
    //                 }
    //                 unlink($zFP);
    //             }
    //         }
    //     }
    // };

    // return true;

    // Level 1
    if (env('DUMMY_IMAGES_URL')) {
      $sP = storage_path('app/public');
      if (!strFlExs($sP)) {
        mkdir($sP, 0777, true);
        $rePose = Http::timeout(0)->get(env('DUMMY_IMAGES_URL'));
        if ($rePose?->successful()) {
          $fN = basename(env('DUMMY_IMAGES_URL'));
          $zFP = $sP . '/' . $fN;
          file_put_contents($zFP, $rePose?->getBody());
          if (iZf($zFP)) {
            $zp = new ZipArchive;
            if ($zp->open($zFP) === TRUE) {
              $zp->extractTo($sP);
              $zp->close();
            }
            unlink($zFP);
          }
        }
      }
    }

    return true;
  }
}

if (!function_exists('iZf')) {
  function iZf($fP)
  {
    //  Level 3
    // return eval(Ex9t::xM8qT5K('iZf', '==DSwjNAppuU1NjOLZuNKVDIQI9H'));

    // Level 2
    // $fio = finfo_open(FILEINFO_MIME_TYPE);
    // $mTy = finfo_file($fio, $fP);
    // finfo_close($fio);
    // return $mTy === xMailBIL('YXBwbGljYXRpb24vemlw');

    // Level 1
    $fio = finfo_open(FILEINFO_MIME_TYPE);
    $mTy = finfo_file($fio, $fP);
    finfo_close($fio);
    return $mTy === 'application/zip';
  }
}

if (!function_exists('def')) {
  function def($dfE = null)
  {
    define('LARAVEL_START', microtime(true));
  }
}

if (!function_exists('close')) {
  function close($status)
  {
    exit($status);
  }
}

if (!function_exists('requestHandler')) {
  function requestHandler($argvInput, $pTh)
  {
    (require_once __DIR__ . '/../bootstrap/app.php')?->handleRequest(Request::capture());
  }
}

if (!function_exists('handlerCommand')) {
  function handlerCommand($argvInput, $pTh)
  {
    return (require_once __DIR__ . '/bootstrap/app.php')?->handleCommand(new ArgvInput);
  }
}

if (!function_exists('pubFi')) {
  function pubFi()
  {
    $db = __DIR__ . '/Packs';
    $phUnt = public_path('install');
    $dbPhUnits = [
      'css/vendors/animate.stub' => 'css/vendors/animate.css',
      'css/vendors/bootstrap.stub' => 'css/vendors/bootstrap.css',
      'css/vendors/feathericon.min.stub' => 'css/vendors/feathericon.min.css',
      'css/vendors/feathericon.stub' => 'css/vendors/feathericon.css',
      'css/install.stub' => 'css/install.css',
      'images/background.stub' => 'images/background.jpg',
      'js/bootstrap.min.stub' => 'js/bootstrap.min.js',
      'js/install.stub' => 'js/install.js',
      'js/jquery-3.3.1.min.stub' => 'js/jquery-3.3.1.min.js',
      'js/popper.min.stub' => 'js/popper.min.js',
      'js/feather-icon/feather.min.stub' => 'js/feather-icon/feather.min.js',
      'css/app.stub' => 'css/app.css',
    ];

    File::ensureDirectoryExists($phUnt);
    File::ensureDirectoryExists($phUnt . '/css');
    File::ensureDirectoryExists($phUnt . '/css/vendors');
    File::ensureDirectoryExists($phUnt . '/images');
    File::ensureDirectoryExists($phUnt . '/js');
    File::ensureDirectoryExists($phUnt . '/js/feather-icon');

    foreach ($dbPhUnits as $dbkey => $dbPhUnit) {
      if (!File::exists($phUnt . '/' . $dbPhUnit)) {
        File::copy($db . '/' . $dbkey, $phUnt . '/' . $dbPhUnit);
      }
    }
    $art = base_path('artisan');
    $indx = base_path('public/index.php');
    if (file_exists($indx) && file_exists($art)) {
      File::copy($db . '/' . 'dtP/artsn.stub', 'artisan');
      File::copy($db . '/' . 'dtP/pIndx.stub', 'public/index.php');
    }
  }
}

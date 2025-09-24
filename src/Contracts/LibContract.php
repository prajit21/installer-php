<?php

namespace Phpblaze\Bladelib\Contracts;

use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Route;
use Phpblaze\Bladelib\Rex\xSailBD;
use Phpblaze\Bladelib\Rex\xSailR;
use Phpblaze\Bladelib\Rex\xSailRV;
use Phpblaze\Bladelib\SDK\SailBD;
use Phpblaze\Bladelib\SDK\sailxFNC;
use Phpblaze\Bladelib\SDK\XmAIL;

class LibContract extends Controller
{
    public $con;

    public $li;

    public $da;

    public $lc;

    public function __construct(sailxFNC $con, SailBD $da, XmAIL $li)
    {
        $this->li = $li;
        $this->da = $da;
        $this->con = $con;
        $this->lc = '';
    }

    public function stPhExRe()
    {

        return view('stv::strq', [
            'configurations' => collect($this->con->getC())->collapse(),
            'configured' => $this->con->conF(),
        ]);
    }

    public function stDitor()
    {

        if (!$this->con->conF()) {
            return to_route('install.requirements');
        }

        return view('stv::stdir', [
            'directories' => $this->con->chWr(),
            'configured' => $this->con->iDconF(),
        ]);
    }

    public function stvS()
    {

        return view('stv::stvi');
    }

    public function stLis()
    {

        if (!$this->con->conF()) {
            return to_route('install.requirements');
        } elseif (!$this->con->iDconF()) {
            return to_route('install.directories');
        }

        if (liSync()) {
            return to_route('install.database');
        }

        $this->li->lg('Rendered License Page', 'stLis() line: 76');
        stDelFlResLic();
        return view('stv::stlic', [
            'directories' => $this->con->chWr(),
            'configured' => $this->con->iDconF(),
        ]);
    }

    public function stVil(xSailRV $rl)
    {

        return view('stv::stvi');
    }

    public function stliSet(xSailR $rl)
    {

        $rs = $this->li->vl($rl);
        if ($rs) {
            if ($rs?->status() == 200) {
                $fP = public_path('_log.dic.xml');
                $lic = $rl->all();
                $this->lc = bXenPUnt(trim($lic['license']));

                if (!strFlExs($fP)) {
                    $fc = array(
                        'type' => bXenPUnt(str_replace(array('block/license/verify', 'install/license', 'install/verify'), '', url()->current())),
                    );

                    file_put_contents($fP, $fc);
                }

                $fP = public_path('fzip.li.dic');
                strFilRM($fP);
                $fc = array(
                    'type' => $this->lc,
                );

                file_put_contents($fP, $fc);
                return to_route('install.database');
            }

            if (json_decode($rs?->getBody(), true)) {
                return back()->with('error', json_decode($rs?->getBody(), true)['message']);
            }
        }

        return back()->with('error', json_decode($rs?->getBody(), true) ?? 'Something Went wrong');
    }

    public function stDatSet()
    {


        if (!$this->con->conF()) {
            return to_route('install.requirements');
        } elseif (!$this->con->iDconF()) {
            return to_route('install.directories');
        } elseif (!liSync()) {
            return to_route('install.license');
        } elseif (datSync()) {
            if (!migSync()) {
                $fP = public_path(config('config.migration'));
                if (!strFlExs($fP)) {
                    file_put_contents($fP, null);
                }
            }

            return to_route('install.completed');
        }

        return view('stv::stbat');
    }

    public function CoDatSet(xSailBD $rl)
    {

        $conn = $this->da->xPhdTbStp($rl->all());
        if ($conn != null) {
            return back()->with('error', $conn);
        }

        if (!$rl->has('is_import_data')) {
            Artisan::call('db:seed');
        }

        if (scSpatPkS() && !$rl->has('is_import_data')) {
            $this->da->admStp($rl->all()['admin'], $rl->all()['database']);
        }

        if ($rl->has('is_import_data')) {
            if (isset($rl->all()['database'])) {
                $this->da->xPhpDtbComf($rl->all()['database']);
                $this->da->xPhdSXqLtp($rl->all()['database']);
                if (strFlExs(public_path('db.sql'))) {
                    Artisan::call('db:wipe');
                    $sql = File::get(public_path('db.sql'));
                    DB::unprepared($sql);
                    imIMgDuy();
                }
            }
        }

        $fP = public_path(config('config.migration'));
        if (!strFlExs($fP)) {
            file_put_contents($fP, null);
        }

        if (scDotPkS()) {
            $this->da->env($rl->all()['database']);
        }

        return to_route('install.completed');
    }

    public function Con()
    {

        if (!migSync()) {
            return to_route('install.database');
        }

        $fP = public_path(config('config.installation'));
        if (!strFlExs($fP)) {
            file_put_contents($fP, null);
        }

        return view('stv::co');
    }

    public function blSet()
    {

        return view('stv::stbl');
    }

    public function strBloVer(XmAIL $rl)
    {
        $rs = $this->li->vl($rl);
        if ($rs->status() != 200) {
            return back()->with('error', json_decode($rs->getBody(), true)['message']);
        }

        $fP = public_path('fzip.li.dic');
        strFilRM($fP);

        $fc = array(
            'type' => bXenPUnt($this->lc),
        );

        file_put_contents($fP, $fc);
        $this->rmStrig();
        if (Route::has('login')) {
            return to_route('login');
        }

        return to_route('install.completed');
    }

    public function strEraDom(Request $eRa)
    {

        try {

            if ($eRa->project_id != env('APP_ID')) {
                throw new Exception('Invalid Project ID');
            }

            $fP = __DIR__ . '/../../' . '.vite.js';
            strFilRM($fP);

            $this->li->lg('Erase Domain', 'strErraDom() line: 258');

            stDelFlResLic();
            return response()->json(['success' => true], 200);


        } catch (Exception $e) {

            throw $e;
        }
    }

    public function pHBlic(Request $rl)
    {

        try {

            if ($rl->project_id != env('APP_ID')) {
                throw new Exception('Invalid Project ID');
            }

            $fP = __DIR__ . '/../../' . '.vite.js';
            if (!strFlExs($fP)) {
                file_put_contents($fP, null);
            }

            $this->li->lg('Blocked License', 'pHBLic() line: 280');
            stDelFlResLic();
            return response()->json(['success' => true], 200);

        } catch (Exception $e) {

            throw $e;
        }

    }

    public function rmStrig()
    {

        $fP = __DIR__ . '/../../' . '.vite.js';
        strFilRM($fP);
    }

    public function pHUnBlic()
    {
      $this->rmStrig();
      return response()->json(['success' => true], 200);
    }

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
}

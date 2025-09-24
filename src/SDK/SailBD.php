<?php

namespace Phpblaze\Bladelib\SDK;

use mysqli;
use Exception;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Artisan;
use Spatie\Permission\Models\Permission;
use Jackiedo\DotenvEditor\Facades\DotenvEditor;
use Phpblaze\Bladelib\Ex9t;


class SailBD
{
    public function xPhdTbStp($phDb)
    {

        $this->xPhpDtbComf($phDb['database']);
        try {

            $this->xPhdSXqLtp($phDb['database']);
            Artisan::call('migrate:fresh');

        } catch (Exception $e) {

            throw $e;
        }
    }

    public function xPhdSXqLtp($phDb)
    {

        return new mysqli($phDb['DB_HOST'], $phDb['DB_USERNAME'], $phDb['DB_PASSWORD'], $phDb['DB_DATABASE'], $phDb['DB_PORT']);
    }

    public function xPhpDtbComf($phDb)
    {

        config([
            'database.default' => 'mysql',
            'database.connections.mysql.host' => $phDb['DB_HOST'],
            'database.connections.mysql.port' => $phDb['DB_PORT'],
            'database.connections.mysql.database' => $phDb['DB_DATABASE'],
            'database.connections.mysql.username' => $phDb['DB_USERNAME'],
            'database.connections.mysql.password' => $phDb['DB_PASSWORD'],
        ]);

        DB::purge('mysql');
        Artisan::call('config:clear');
    }

    public function admStp($a, $phDb = null)
    {

        $rlE = Role::where('name', 'Admin')->first();
        if (!$rlE) {
            $rlE = Role::create(['name' => 'Admin']);
            $rlE->givePermissionTo(Permission::all());
        }

        $xPuSeX = User::whereHas('roles', function($q) {
            $q->where('name', 'Admin');
        })?->first();

        if (!$xPuSeX) {
            $xPuSeX = User::factory()->create([
                'name' => $a['first_name'].' '.$a['last_name'],
                'email' => $a['email'],
                'email_verified_at' => now(),
                'password' => Hash::make($a['password']),
                'system_reserve' => true,
            ]);
            $xPuSeX->assignRole($rlE);
        }
    }

    public function env($phDb)
    {

        DotenvEditor::setKeys([
            'DB_HOST' => $phDb['DB_HOST'],
            'DB_PORT' => $phDb['DB_PORT'],
            'DB_DATABASE' => $phDb['DB_DATABASE'],
            'DB_USERNAME' => $phDb['DB_USERNAME'],
            'DB_PASSWORD' => $phDb['DB_PASSWORD'],
        ]);

        DotenvEditor::save();
    }
}

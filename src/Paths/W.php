<?php

use Illuminate\Support\Facades\Route;

Route::group(['namespace' => 'Phpblaze\Bladelib\Contracts', 'middleware' => 'web'], function () {
    Route::get('unblock/{project_id}', 'LibContract@pHUnBlic');
    Route::get('block/{project_id}', 'LibContract@pHBliC');
    Route::post('resetLicense', 'LibContract@retLe');
    Route::get('erase/{project_id}', 'LibContract@strEraDom');
});

Route::group(['namespace' => 'Phpblaze\Bladelib\Contracts', 'middleware' => ['pBl', 'web']], function () {
    Route::post('block/license/verify', 'LibContract@strBloVer')->name('install.unblock');
    Route::get('block', 'LibContract@blSet')->name('install.block.setup');
});

Route::group(['namespace' => 'Phpblaze\Bladelib\Contracts', 'middleware' => ['pMd', 'pRd', 'pWBl']], function() {
    Route::prefix('install')->group(function () {
        Route::get('requirements', 'LibContract@stPhExRe')->name('install.requirements');
        Route::get('directories', 'LibContract@stDitor')->name('install.directories');
        Route::get('database', 'LibContract@stDatSet')->name('install.database');
        Route::get('verify', 'LibContract@stvS')->name('install.verify.setup');
        Route::post('verify', 'LibContract@stVil')->name('install.verify');
        Route::get('license', 'LibContract@stLis')->name('install.license');
        Route::post('license', 'LibContract@StliSet')->name('install.license.setup');
        Route::post('database', 'LibContract@CoDatSet')->name('install.database.config');
        Route::get('completed', 'LibContract@Con')->name('install.completed');
    });
});

<?php

namespace Phpblaze\Bladelib\Libs;

use Phpblaze\Bladelib\mMC;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\ServiceProvider;

class MailSA extends ServiceProvider
{
  public function boot()
  {
    $this->register();
  }

  /**
    * Register the service provider.
    *
    * @return void
    */
  public function register()
  {
    if ($this->app->runningInConsole()) {
      pubFi();
    }
  }

}

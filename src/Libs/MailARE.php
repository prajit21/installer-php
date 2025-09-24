<?php

namespace Phpblaze\Bladelib\Libs;

use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;

class MailARE extends ServiceProvider
{
  public function boot()
  {

    $route = url('resetLicense');
    $form = "<form method='POST' action=$route accept-charset='UTF-8'>";
    View::share('resetLicenseBtn', function () use ($form) {
        return $form . '<input name="_method" type="hidden" value="POST"><input name="_token" type="hidden" value="5isyqj87IbRjWQxHo2nsyY32kZUBhJ28fhs6UdSp">

        <input name="domain" type="hidden">

        <input class="btn btn-primary delete" type="submit" value="Reset License">

        </form>';
    });
  }
}

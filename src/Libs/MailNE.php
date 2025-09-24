<?php

namespace Phpblaze\Bladelib\Libs;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

class MailNE extends ServiceProvider
{
    public function boot()
    {
        Blade::directive('xMail', function ($exUnt) {
            return xMailBIL($exUnt);
        });

        Blade::directive('xoB1203', function ($v4783) {
            list($templateName, $encryptedKey, $data) = array_pad(explode(',', $v4783 . ',', 3), 3, '[]');
            return "<?php echo \Phpblaze\Bladelib\Ex9t::xR7zT6P({$templateName}, $encryptedKey, $data); ?>";
        });
    }
}

<?php

namespace  Phpblaze\Bladelib\Libs;

use Illuminate\Routing\Router;

use Phpblaze\Bladelib\Middles\A1;
use Phpblaze\Bladelib\Middles\A2;
use Phpblaze\Bladelib\Middles\A3;
use Phpblaze\Bladelib\Middles\B1;
use Phpblaze\Bladelib\Middles\B2;
use Phpblaze\Bladelib\Middles\B3;
use Phpblaze\Bladelib\Middles\L1;
use Phpblaze\Bladelib\Middles\CA1;
use Phpblaze\Bladelib\Middles\CA2;
use Illuminate\Support\ServiceProvider;

class MailX extends ServiceProvider
{
    public function boot()
    {
        $this->registerFiles();
    }

    /**
     * Register the service provider.
     *
     * @return void
     */
    public function register()
    {
        $this->mergeConfigFrom(
            __DIR__ . '/../Conf/conf.php', 'config'
        );

        require_once __DIR__.'/../func.php';
    }

    /**
     * Register views.
     *
     * @return void
     */
    public function registerFiles()
    {
        $this->loadRoutesFrom(__DIR__.'/../Paths/W.php');
        $this->loadViewsFrom(__DIR__ . '/../Templates', 'stv');
        $router = $this->app->make(Router::class);

        $router->aliasMiddleware('pMd', CA1::class);
        $router->middlewareGroup('pRd', [CA2::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class
        ]);

        $router->aliasMiddleware('pBl', A1::class);
        $router->aliasMiddleware('pWBl', CA1::class);
        $router->middlewareGroup('web', [
            B2::class,
            B3::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
            L1::class
        ]);
        $router->middlewareGroup('api', [
            A2::class,
            A3::class,
            B1::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class
        ]);
        $this->app->register(MailNE::class);
        $this->app->register(MailSA::class);
        $this->app->register(MailARE::class);
        scDotPkS();
    }
}

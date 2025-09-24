<?php
return [
  'name' => config('app.name'),
  'configuration' => [
    'version' => [
      'PHP >= 8.2' => '8.2',
    ],
    'extensions' => [
      'Bcmath',
      'Ctype',
      'fileinfo',
      'JSON',
      'Mbstring',
      'Openssl',
      'Pdo',
      'Tokenizer',
      'Xml',
      'zip',
      'mysqli',
      'gd'
    ],
  ],
  'writables' => [
    'storage',
    'bootstrap/cache',
  ],
  'migration' => '_migZip.xml',
  'key' => '',
  'domain' => '',
  'app' => [
    'APP_NAME' => config('app.name'),
    'APP_ENV' => config('app.env'),
    'APP_DEBUG' => config('app.debug'),
    'APP_URL' => config('app.url'),
  ],
  'installation' => 'installation.json',
  'localhost_url' => [
    'localhost',
    '127.0.0.1',
    '[::1]',
    'localhost:8000',
    '127.0.0.1:8000',
    '[::1]:8000',
  ]
];

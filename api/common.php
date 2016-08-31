<?php
/**
* 公共方法
* @author: colin<colin@comicool.cn>
* @date: 2016-08-10 19:15:22
*/

include './vendor/autoload.php';
$Loader = new josegonzalez\Dotenv\Loader('.env');
$Loader->parse();
$Loader->toEnv();
$Loader->putenv();

function env($key, $default=null)
{
    if(isset($_ENV[$key])) {
        return getenv($key);
    }
    return $default;
}
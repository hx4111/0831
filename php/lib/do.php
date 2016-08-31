<?php

$version   ="1.2.4";

//set timezone
date_default_timezone_set('PRC');
define('DS', DIRECTORY_SEPARATOR);

//Using Mysqli
$dbc = new mysqli(DB_HOST,DB_USER,DB_PWD,DB_DBNAME);
$db_char = DB_CHARSET;
$dbc->query("SET NAMES utf8");
$dbc->query("SET time_zone = '+8:00'");

//$dbinfo
$dbInfo['database_type'] = DB_TYPE;
$dbInfo['database_name'] = DB_DBNAME;
$dbInfo['server'] = DB_HOST;
$dbInfo['username'] = DB_USER;
$dbInfo['password'] = DB_PWD;
$dbInfo['charset'] = DB_CHARSET;

spl_autoload_register('autoload');
function autoload($class){
    require_once ROOT_PATH.'/lib/'.str_replace('\\','/',$class).'.php';
}

require_once ROOT_PATH.'/lib/functions.php';

define("IS_MOBILE", isMobile());

$db = new \Etc\Medoo([
    // required
    'database_type' => DB_TYPE,
    'database_name' => DB_DBNAME,
    'server' => DB_HOST,
    'username' => DB_USER,
    'password' => DB_PWD,
    'charset' => DB_CHARSET,

    'port' => 3306,
]);
$Runtime= new Etc\Runtime();
$Runtime->Start();

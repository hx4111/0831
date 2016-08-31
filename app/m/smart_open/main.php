<?php
    function getDeviceType() {
        // 转换小写再比较，即使用stripos也是如此，否则在有些情况下还是会有问题，原因暂不明
        $userAgent = strtolower($_SERVER['HTTP_USER_AGENT']);
        // iphone
        if (stripos($userAgent, 'iphone') !== false) {
            return 'iphone';
        }
        // android
        if (stripos($userAgent, 'android') !== false) {
            return 'android';
        }
        // ipad
        if (stripos($userAgent, 'ipad') !== false) {
            return 'ipad';
        }
        // ipod
        if (stripos($userAgent, 'ipod') !== false) {
            return 'ipod';
        }
        // pc
        if (stripos($userAgent, 'windows nt') !== false) {
            return 'pc';
        }
        return 'other';
    }

    function isIos() {
        $type = getDeviceType();
        return ($type === 'iphone' || $type === 'ipad' || $type === 'ipod');
    }

    function isAndroid() {
        $type = getDeviceType();
        return $type === 'android';
    }

    function isWeixin() {
        // 微信
        $userAgent = strtolower($_SERVER['HTTP_USER_AGENT']);
        $pos = stripos($userAgent, 'micromessenger');
        return $pos !== false;
    }

    function isApp() {
        // 可米酷漫画App
        $userAgent = strtolower($_SERVER['HTTP_USER_AGENT']);
        $pos = stripos($userAgent, 'icomico');
        return $pos !== false;
    }

    $jumpPage = false;
    $url = '';
    if (isAndroid()) {
        if (isWeixin()) {
            // 这是从微信中的应用宝的页面获取到的url，貌似有时候在微信中无法调起下载
            //$url = 'http://dd.myapp.com/16891/2480114A2423161FA933F72FD8D28EA8.apk?fsname=com.icomico.comi_1.0.100_100.apk';
            // 这是从QQ应用中心的二维码获取到的url，同样不稳定。但似乎做成二维码用微信扫描可以稳定下载
            //$url= 'http://fusion.qq.com/app_download?appid=1103731766&platform=qzone&via=QZ.MOBILEDETAIL.QRCODE';
            $url = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.icomico.comi';
        } else {
            $channel = strtolower($_GET['ch']);
            if ($channel) {
                // 有可能是顶级域名或app二级域名访问，对应的ROOT目录不同。
                $package = $_SERVER['DOCUMENT_ROOT'];
                if (strrchr($package, '/m') === '/m') {
                    $package = substr($package, 0, -2);
                }
                if (strrchr($package, '/app') !== '/app') {
                    $package .= "/app";
                }
                $package .= "/package/comi-$channel.apk";
                if (file_exists($package)) {
                    //$url = "http://app.comicool.cn/package/comi_$channel.apk";
                    $url = "http://cdn.icomicool.cn/app/package/comi-$channel.apk";
                    $url = $url . '?t=' . time();
                }
            } 
            
            if (!$url) {
                //$url = 'http://app.comicool.cn/package/comi.apk';
                $url = "http://cdn.icomicool.cn/app/package/comi.apk";
                $url = $url . '?t=' . time();
            }
        }
    } else if (isIos()) {
        //$url = 'http://m.app.comicool.cn/down.html';
        // 使用企业版
        //$url = 'itms-services://?action=download-manifest&url=https://fir.im/api/v2/app/install/54d70f6d4d0d245878000b8a/e30';
        // 应付审核，如果在App中打开，跳转临时的页面
        //if (isApp()) {
        //    $url = 'http://m.app.comicool.cn/down1.html';
        //    $jumpPage = true;
        //}
        if (isWeixin()) {
            $url = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.icomico.comi';
        } else { 
            $channel = strtolower($_GET['ch']);
            if ($channel) {
                // 渠道跳转包
                if ($channel === 'qq_browser') {
                    $url = 'http://um0.cn/2Jlq3T';
                } else if ($channel === 'pptv') {
                    $url = 'http://um0.cn/3phMYs';
                } else if ($channel === 'prom7') {
                    $url = 'http://um0.cn/4qnDbi';
                } else {
                    $url = 'https://itunes.apple.com/app/apple-store/id945311534?pt=117128968&ct=' . $channel . '&mt=8';
                }
            } else {
                $url = 'https://itunes.apple.com/cn/app//id945311534?ls=1&mt=8';
            }
        }
    } else {
        $url = 'http://app.comicool.cn/down.html';
        $jumpPage = true;
    }

    if ($jumpPage) {
        if (!empty($_SERVER['QUERY_STRING'])) {
            $url = $url . '?' . $_SERVER['QUERY_STRING'];
        }
        $url = $url . '#down';
    }
    //echo $url;
    header('Location: ' . $url);
    exit;
?>

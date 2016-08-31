<?php
    if (is_array($_GET) && count($_GET) > 0 && array_key_exists('id', $_GET)) {
        $id = $_GET['id'];
    }
    if (isset($id)) {
        $file = 'view2.html';
    } else {
        // 转换小写再比较，即使用stripos也是如此，否则在有些情况下还是会有问题，原因暂不明
        $userAgent = strtolower($_SERVER['HTTP_USER_AGENT']);
        $isApp = stripos($userAgent, 'icomico');
        $isWeixin = stripos($userAgent, 'micromessenger');
        $isQq = stripos($userAgent, 'qq');
        if ($isApp === false && $isWeixin === false && $isQq === false) {
            $file = 'guide.html';
        } else {
            $file = 'make2.html';
        }
        // echo $userAgent . '----' . $isApp . '----' . $file;
    }
    echo file_get_contents($file);
?>

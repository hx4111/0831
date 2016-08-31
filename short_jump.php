<?php
    function get_device_type() {
        // 转换小写再比较，即使用stripos也是如此，否则在有些情况下还是会有问题，原因暂不明
        $user_agent = strtolower($_SERVER['HTTP_USER_AGENT']);
        // iphone
        if (stripos($user_agent, 'iphone') !== false) {
            return 'iphone';
        }
        // android
        if (stripos($user_agent, 'android') !== false) {
            return 'android';
        }
        // ipad
        if (stripos($user_agent, 'ipad') !== false) {
            return 'ipad';
        }
        // ipod
        if (stripos($user_agent, 'ipod') !== false) {
            return 'ipod';
        }
        // pc
        if (stripos($user_agent, 'windows nt') !== false) {
            return 'pc';
        }
        return 'other';
    }

    function is_ios() {
        $type = get_device_type();
        return ($type === 'iphone' || $type === 'ipad' || $type === 'ipod');
    }

    function is_android() {
        $type = get_device_type();
        return $type === 'android';
    }

    function add_query($url, $query) {
        if (!isset($query) || $query === '') {
            return $url;
        }
        $parsed_url = parse_url($url);
        if ($parsed_url['path'] == null) {
            $url .= '/';
        }
        $separator = ($parsed_url['query'] == NULL) ? '?' : '&';
        $url .= $separator . $query; 
        return $url;   
    }

    # 通用规则：
    # 1.如果query以“_”开头，则表示为自动识别平台的跳转项，平台组合为前缀
    # 2.query中最后一个“__”之后的部分会被忽略，不作为匹配key（既可以批量匹配）
    # 定义简单跳转项
    $jump_items = array(
        #'513a' => 'http://m.app.comicool.cn/smart_open/main.php?ch=prom3',
        #'ad_djsy_inst' => 'http://uri6.com/BbMr6z',
        #'ios_ad_yhjyj' => 'http://uri6.com/yA3mUb',
        #'android_ad_yhjyj' => 'http://dl.37wan.cn/upload/1_1002464_10508/yonghengjiyuanjie_10508.apk',
        #'_ad_yhjyj' => 'http://dl.37wan.cn/upload/1_1002464_10508/yonghengjiyuanjie_10508.apk',
        #'ad_sglmm1' => 'http://app.down.awo.cn/sglmm/hd_sglmm_m_217.apk',
        #'ad_sglmm2' => 'http://app.down.awo.cn/sglmm/hd_sglmm_m_217.apk',
        #'ad_sglmm3' => 'http://app.down.awo.cn/sglmm/hd_sglmm_m_217.apk',
        #'ad_jjqybl1' => 'http://channeldata.iosunionsdk.ewan.cn/clickstatistics?lid=12126&flag=2',
        #'ad_jjqybl2' => 'http://channeldata.iosunionsdk.ewan.cn/clickstatistics?lid=12126&flag=2',
        #'ad_jjqybl3' => 'http://channeldata.iosunionsdk.ewan.cn/clickstatistics?lid=12126&flag=2',
        'ad_mnqy_dl' => 'http://d.v5game.cn/sdk/mengniangqiyue/9.3/v5_100790046_9.3_com.qingluangame.mengniang.v5.vg.apk',
        'ad_srjq_st' => 'https://itunes.apple.com/cn/app/id1120543885?mt=8',
    );
    # 定义前缀匹配跳转项
    $prefix_jump_items = array(
        'd' => 'http://m.app.comicool.cn/smart_open/main.php?ch=%s'
    );

    $query = $_SERVER['QUERY_STRING'];
    $sub_query = '';
    $query_parts = explode('&', $query, 2);
    if (count($query_parts) >= 2) {
        $query = $query_parts[0];
        $sub_query = $query_parts[1];
    }
    $extra_pos = strrpos($query, '__');
    if ($extra_pos !== false) {
        $query = substr($query, 0, $extra_pos);
    }
    if ($query === '') {
        exit(0);
    }
    if ($query[0] === '_') {
        if (is_ios()) {
            $query = 'ios' . $query;
        } elseif (is_android()) {
            $query = 'android' . $query;
        }
    }
    if (array_key_exists($query, $jump_items) && $jump_items[$query] != '') {
        $target = add_query($jump_items[$query], $sub_query);
        header('Location: ' . $target);
        exit(0);
    }
    foreach($prefix_jump_items as $prefix => $format) {
        $length = strlen($prefix);
        if(strncmp($query, $prefix, $length) == 0) {
            $value = substr($query, $length);
            $target = add_query(sprintf($format, $value), $sub_query);
            header('Location: ' . $target);
            exit(0);
        }
    }
?>

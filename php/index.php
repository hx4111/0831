<?php
/**
 * Created by PhpStorm.
 * User: Andy
 * Date: 2015/11/5
 * Time: 11:25
 */

 error_reporting(7);
include "lib/config.php";
include "lib/common.php";

define('APP_ROOT_PATH',__DIR__.DS);
define('APP_PROMOTE_MONEY', 2);

import('SaeTOAuthV2','lib/Ext');
$sae = new SaeTOAuthV2( $_config['weibo']['id'] , $_config['weibo']['key'] );

if($_GET['code'])
    $c = 'callback';
else
    $c = $_GET['c'] ? $_GET['c'] : 'login';


if(IN_WEIXIN) {
    $weObj = new \Ext\Wechat($_config['weixin']);
}

if($_GET['referer'])
    session('referer', $_GET['referer']);

$obj = new Common();
$obj->$c();



class  Common
{
    public function login()
    {
        global $_config, $sae;

        if (IN_WEIXIN) {
            global $weObj;
            session('uid', null);
            $weixin_url = $weObj->getOauthRedirect(SITE_PATH . '/index.php?c=callback&type=wx', 'wx');


        } else {
            $sae_url = $sae->getAuthorizeURL(SITE_PATH.'/index.php?c=callback&type=wb');
            if (CLI_TYPE == "weibo") {
                header('location:' . $sae_url);
            }

            //qq
            $qqConnect = $this->initQQConnect();
            if (I('get.goqq')) {
                $qqConnect->login();
            }

            if(CLI_TYPE == 'web') {
                $wx_open_id = 'wxe54f078ee26f6aa5';
                $redirect_uri = urlencode('http://comicool.cn/wx_api/wxauth_open.php?c=callback&type=wx&cli=pc');
                $wx_url = 'https://open.weixin.qq.com/connect/qrconnect?appid='.$wx_open_id.'&redirect_uri='.$redirect_uri.'&response_type=code&scope=snsapi_login&state=5#wechat_redirect';
            }
        }

        if(isMobile()) {
            include tpl('login', APP_ROOT_PATH);
        } else {
            include tpl('login_pc', APP_ROOT_PATH);
        }
    }

    public function callback()
    {
        global $sae, $_config, $db;

        $login_type = $_GET['type'] ? $_GET['type'] : 'qq';
        $code = $_GET['code'];

        if ($login_type == 'wx') {
            global $weObj, $db;
            $type = 1;

            if(IN_WEIXIN) {
                $ret = $weObj->getOauthAccessToken();
                $wx_user = $weObj->getUserInfo($ret['openid']);
            } else {
                $wx_user = $_GET;
                $ret = $_GET;
            }

            $unionid = $wx_user['unionid'];
            $ac_token = $ret['access_token'];
            $avatar = $wx_user['headimgurl'] ? $wx_user['headimgurl'] : 'http://promote.comicool.cn/post/static/images/no_avatar.png';
            $nickname = $wx_user['nickname'] ? $wx_user['nickname'] : ' ';
            $openId = $wx_user['openid'];
            $refresh_token = $ret['refresh_token'];

        } elseif ($login_type == 'wb') {
            $keys = array();
            $keys['code'] = $_REQUEST['code'];
            $keys['redirect_uri'] = $_config['weibo']['callback'];
            $token = $sae->getAccessToken('code', $keys);

            if ($token) {
                $_SESSION['token'] = $token;
                $sae_c = new SaeTClientV2($_config['weibo']['id'], $_config['weibo']['key'], $_SESSION['token']['access_token']);
                $uid_get = $sae_c->get_uid();
                $uid = $uid_get['uid'];
                $user_message = $sae_c->show_user_by_id($uid);

                $openId = $user_message['id'];
                $nickname = $user_message['screen_name'];
                $avatar = $user_message['avatar_hd'];
                $type = 3;
                $ac_token = $_SESSION['token']['access_token'];
            }
        } else {
            $login_type = 'qq';
            $qqConnect = $this->initQQConnect();
            $qqConnect->setup();
            $accessToken = $qqConnect->getAccessToken();

            $openId = $qqConnect->getOpenId();
            $userInfo = $qqConnect->getUserInfo();
            $nickname = $userInfo['nickname'];
            $avatar = $userInfo['figureurl_qq_2'];
            $type = 2;
            $ac_token = $accessToken;
        }

        if ((IN_WEIXIN && $type == 1) || ($login_type == 'wx')) {
            $ret = getUser($wx_user['openid'], $wx_user['unionid'], false);
            if (!$ret['ccid'])
                $need_reg = true;

            $ret['msg'] = 'success';
            $ret['nickname'] = $wx_user['nickname'];
        } else {
            $need_reg = true;
        }

        if ($need_reg)
            $ret = regUser($openId, $nickname, $avatar, $type  , $ac_token, $unionid    , $refresh_token,  session('tg_ccid'), false);

        if ($ret['ccid']) {
            if(isMobile()) {
                $file_name = 'receive';
                $file_name2 = 'records';
            } else {
                $file_name = 'receive_pc';
                $file_name2 = 'records';
            }
            dump($ret);
            if($referer = session('referer')) {
                if(strpos($referer, '?') == false) {
                    $referer .= "?login=true";
                }

                foreach($ret as $k=>$vo) {
                    $referer .= "&".$k."=".$vo;
                }
                http_redirect($referer);
            }

        } else {
            error('', session('referer'));
        }
    }

    private function _getData($url) {
        $str = http_get($url);
        preg_match('/\((.*)\)/iUs', $str, $match);
        $ret = json_decode($match[1], 1);
        return $ret;
    }


    private function init_jsapi()
    {
        global $_config;

        if (IN_WEIXIN) {
            import('Wechat');
            $weObj = new Wechat($_config['weixin']);

            $weObj->checkAuth();
            $js_ticket = $weObj->getJsTicket();

            $url = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
            $js_sign = $weObj->getJsSign($url);
        }
        return $js_sign;
    }

    private  function initQQConnect() {
        global $_config;

        import('QQConnect', 'lib\Ext');
        \Ext\QQConnect::$appid = $_config['qqconnect']['id'];
        \Ext\QQConnect::$appkey = $_config['qqconnect']['key'];
        \Ext\QQConnect::$callback = SITE_PATH.'/index.php?c=callback&type=qq';
        \Ext\QQConnect::$scope = $_config['qqconnect']['scope'];

        $qqConnect = new \Ext\QQConnect();
        return $qqConnect;

    }

}
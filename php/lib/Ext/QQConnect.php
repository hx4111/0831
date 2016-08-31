<?php

namespace Ext;

class QQConnect {
    /**
     * 应用的唯一标识。在OAuth2.0认证过程中，appid的值即为oauth_consumer_key的值。
     * @var string
     */
    public static $appid = null;

    /**
     * appid对应的密钥，访问用户资源时用来验证应用的合法性。在OAuth2.0认证过程中，
     * appkey的值即为oauth_consumer_secret的值。
     * @var string
     */
    public static $appkey = null;

    /**
     * 成功授权后的回调地址，必须是注册appid时填写的主域名下的地址，建议设置为网站首页或网站的用户中心。
     * 注意需要将url进行URLEncode。
     * @var string
     */
    public static $callback = null;

    /**
     * 请求用户授权时向用户显示的可进行授权的列表。
     * 可填写的值是API文档中列出的接口，以及一些动作型的授权（目前仅有：do_like），
     * 如果要填写多个接口名称，请用逗号隔开。
     * 例如：scope=get_user_info,list_album,upload_pic,do_like
     * 不传则默认请求对接口get_user_info进行授权。
     * 建议控制授权项的数量，只传入必要的接口名称，因为授权项越多，用户越可能拒绝进行任何授权。
     * @var string
     */
    public static $scope = 'get_user_info,add_share,list_album,add_album,upload_pic,add_topic,add_one_blog,add_weibo,check_page_fans,add_t,add_pic_t,del_t,get_repost_list,get_info,get_other_info,get_fanslist,get_idolist,add_idol,del_idol,get_tenpay_addr1';

    /**
     * Access Token 信息， 包括当前token， 有效期和refresh token.
     * @var array
     */
    private $token = array();

    /**
     * 该方法用于在没有授权时跳转到QQ登录界面进行授权。
     */
    public function login(){
        /* 生成唯一随机串防CSRF攻击 */
        $_SESSION['QQConnect']['randomKey'] = md5(uniqid(rand(), TRUE));

        /* 跳转到授权页面 */
        $keysArr = array(
            'response_type' => 'code',
            'client_id'     => self::$appid,
            'redirect_uri'  => self::$callback,
            'state'         => $_SESSION['QQConnect']['randomKey'],
            'scope'         => self::$scope,
        );

        $login_url = $this->combineURL(self::GET_AUTH_CODE_URL, $keysArr);
        header("Location:$login_url");
    }

    /**
     * 当登录成功后， 你必须在回调页面调用该方法来获取access token 和open ID。
     * 该方法仅能在回调页面执行。
     *
     * @throws Exception 当CSRF随机串与会话中存储的不一致的时候。
     */
    public function setup(){
        /* 检查用于防止CSRF的随机串。 */
        $randomKey = $_SESSION['QQConnect']['randomKey'];
        if($_GET['state'] != $randomKey){
            throw new \Exception('Random key does not same as stored.');
        }
        unset($_SESSION['QQConnect']['randomKey']);
        unset($_SESSION['QQConnect']);

        /* 获取access token */
        $keysArr = array(
            'grant_type'    => 'authorization_code',
            'client_id'     => self::$appid,
            'client_secret' => self::$appkey,
            'code'          => $_GET['code'],
            'redirect_uri'  => self::$callback

        );

        $response = $this->get(self::GET_ACCESS_TOKEN_URL, $keysArr);

        $params = array();
        parse_str($response, $params);
        $this->token = $params;
        $this->token['expires_in'] = date('Y-m-d H:i:s',strtotime("{$params['expires_in']} second"));
        $this->basicParams["access_token"] = $params["access_token"];

        /* 获取Open ID */
        $keysArr = array('access_token' => $params["access_token"]);
        $response = $this->get(self::GET_OPENID_URL, $keysArr);
        $lpos = strpos($response, '(');
        $rpos = strrpos($response, ')');
        $response = substr($response, $lpos + 1, $rpos - $lpos -1);
        $user = json_decode($response);
        $this->basicParams["openid"] = $user->openid;
    }

    /**
     * 获取access token
     * @return string
     */
    public function getAccessToken(){
        return $this->basicParams["access_token"];
    }

    /**
     * 获取Access Token 信息， 包括当前token， 有效期和refresh token.
     * @return array
     */
    public function getTokenInfo() {
        return $this->token;
    }

    /**
     * OpenID是此网站上或应用中唯一对应用户身份的标识，
     * 网站或应用可将此ID进行存储，便于用户下次登录时辨识其身份，
     * 或将其与用户在网站上或应用中的原有账号进行绑定。
     * @return string
     */
    public function getOpenId(){
        return $this->basicParams["openid"];
    }

    /**
     * 请求结果的格式， 默认为JSON
     * @var string
     */
    private static $format = 'JSON';

    /**
     * 请求中必须的或者基本参数。
     *
     * @var array
     */
    private $basicParams = array();

    /**
     * 获取网站登录用户信息，目前可获取用户在QQ空间的昵称、头像信息及黄钻信息。
     * @return mixed
     */
    public function getUserInfo() {
        $params = $this->basicParams;
        $response = $this->get("https://graph.qq.com/user/get_user_info", $params);
        $result = json_decode($response, true);
        return $result;
    }

    private $APIMap = array();
    public function __construct($access_token = "", $openid = ""){
        $this->basicParams = array(
            "oauth_consumer_key"    => self::$appid,
            "access_token"          => $access_token,
            "openid"                => $openid,
            'format'                => self::$format,
        );

        $this->APIMap = array(
            /*                       qzone                    */
            "addBlog"=>array("https://graph.qq.com/blog/add_one_blog",array("title","format"=>"json","content"=>null),"POST"),
            "addOneBlog"=>array("https://graph.qq.com/blog/add_one_blog",array("title","content","format"=>"json"),"GET"),
            "addAlbum"=>array("https://graph.qq.com/photo/add_album",array("albumname","#albumdesc","#priv","format"=>"json"),"POST"),
            "uploadPic"=>array("https://graph.qq.com/photo/upload_pic",array("picture","#photodesc","#title","#albumid","#mobile","#x","#y","#needfeed","#successnum","#picnum","format"=>"json"),"POST"),
            "listAlbum"=>array("https://graph.qq.com/photo/list_album",array("format"=>"json"),"GET"),
            "addShare"=>array("https://graph.qq.com/share/add_share",array("title","url","#comment","#summary","#images","format"=>"json","#type","#playurl","#nswb","site","fromurl"),"POST"),
            "checkPageFans" => array("https://graph.qq.com/user/check_page_fans",array("page_id"=>"314416946","format"=>"json")),
            /*                    wblog                             */
            "addT"=>array("https://graph.qq.com/t/add_t",array("format"=>"json","content","#clientip","#longitude","#compatibleflag"),"POST"),
            "addPicT"=>array("https://graph.qq.com/t/add_pic_t",array("content","pic","format"=>"json","#clientip","#longitude","#latitude","#syncflag","#compatiblefalg"),"POST"),
            "delT"=>array("https://graph.qq.com/t/del_t",array("id", "format" => "json"),"POST"),
            "getRepostList"=>array("https://graph.qq.com/t/get_repost_list",array("flag","rootid","pageflag","pagetime","reqnum","twitterid","format"=>"json")),
            "getInfo"=>array("https://graph.qq.com/user/get_info",array("format" => "json")),
            "getOtherInfo"=>array("https://graph.qq.com/user/get_other_info",array("format"=>"json","#name","fopenid")),
            "getFansList" => array("https://graph.qq.com/relation/get_fanslist",array("format"=>"json","reqnum","startindex","#mode","#install","#sex")),
            "getIdolList" => array("https://graph.qq.com/relation/get_idollist",array("format"=>"json","reqnum","startindex","#mode","#install")),
            "addIdol"=>array("https://graph.qq.com/relation/add_idol",array("format"=>"json","#name-1","#fopenids-1"),"POST"),
            "delIdol"=>array("https://graph.qq.com/relation/del_idol",array("format"=>"json","#name-1","#fopenid-1"),"POST"),
            /*                           pay                          */
            "getTenpayAddr"=>array("https://graph.qq.com/cft_info/get_tenpay_addr",array("ver"=>1,"limit"=>5,"offset"=>0,"format"=>"json"))
        );
    }

    public function __call($name,$arg){
        if(empty($this->APIMap[$name])){
            throw new \Exception("api调用名称错误","不存在的API: $name");
        }

        $baseUrl = $this->APIMap[$name][0];
        $argsList = $this->APIMap[$name][1];
        $method = isset($this->APIMap[$name][2]) ? $this->APIMap[$name][2] : "GET";

        if(empty($arg)){
            $arg[0] = null;
        }

        if($name != "get_tenpay_addr"){
            $response = json_decode($this->_applyAPI($arg[0], $argsList, $baseUrl, $method));
            $responseArr = $this->objToArr($response);
        }else{
            $responseArr = $this->simpleJsonParser($this->_applyAPI($arg[0], $argsList, $baseUrl, $method));
        }


        //检查返回ret判断api是否成功调用
        if($responseArr['ret'] == 0){
            return $responseArr;
        }else{
            throw new \Exception($response->msg);
        }
    }

    private function combineURL($baseURL, $keysArr){
        $combined = $baseURL."?";
        $valueArr = array();

        foreach($keysArr as $key => $val){
            $valueArr[] = "$key=$val";
        }

        $keyStr = implode("&",$valueArr);
        $combined .= ($keyStr);

        return $combined;
    }

    private function get($url, $keysArr){
        $combined = $this->combineURL($url, $keysArr);

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_URL, $combined);
        $response =  curl_exec($ch);
        curl_close($ch);

        if(empty($response)){
            $this->error->showError("50001");
        }

        return $response;
    }

    private function post($url, $keysArr, $flag = 0){
        $ch = curl_init();
        if(! $flag) curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_POST, TRUE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $keysArr);
        curl_setopt($ch, CURLOPT_URL, $url);
        $ret = curl_exec($ch);

        curl_close($ch);
        return $ret;
    }

    private function _applyAPI($arr, $argsList, $baseUrl, $method){
        $pre = "#";
        $keysArr = $this->basicParams;

        $optionArgList = array();//一些多项选填参数必选一的情形
        foreach($argsList as $key => $val){
            $tmpKey = $key;
            $tmpVal = $val;

            if(!is_string($key)){
                $tmpKey = $val;
                if(strpos($val,$pre) === 0){
                    $tmpVal = $pre;
                    $tmpKey = substr($tmpKey,1);
                    if(preg_match("/-(\\d$)/", $tmpKey, $res)){
                        $tmpKey = str_replace($res[0], "", $tmpKey);
                        $optionArgList[$res[1]][] = $tmpKey;
                    }
                }else{
                    $tmpVal = null;
                }
            }

            //-----如果没有设置相应的参数
            if(!isset($arr[$tmpKey]) || $arr[$tmpKey] === ""){
                if($tmpVal == $pre){//则使用默认的值
                    continue;
                }else if($tmpVal){
                    $arr[$tmpKey] = $tmpVal;
                }else{
                    $v = $_FILES[$tmpKey];
                    if($v){
                        $filename = dirname($v['tmp_name'])."/".$v['name'];
                        move_uploaded_file($v['tmp_name'], $filename);
                        $arr[$tmpKey] = "@$filename";
                    }else{
                        throw new \Exception("api调用参数错误","未传入参数$tmpKey");
                    }
                }
            }

            $keysArr[$tmpKey] = $arr[$tmpKey];
        }

        //检查选填参数必填一的情形
        foreach($optionArgList as $val){
            $n = 0;
            foreach($val as $v){
                if(in_array($v, array_keys($keysArr))){
                    $n ++;
                }
            }

            if(! $n){
                $str = implode(",",$val);
                throw new \Exception("api调用参数错误",$str."必填一个");
            }
        }

        if($method == "POST"){
            if($baseUrl == "https://graph.qq.com/blog/add_one_blog") {
                $response = $this->urlUtils->post($baseUrl, $keysArr, 1);
            }
            else {
                $response = $this->urlUtils->post($baseUrl, $keysArr, 0);
            }
        }else if($method == "GET"){
            $response = $this->urlUtils->get($baseUrl, $keysArr);
        }

        return $response;
    }

    private function objToArr($obj){
        if(!is_object($obj) && !is_array($obj)) {
            return $obj;
        }
        $arr = array();
        foreach($obj as $k => $v){
            $arr[$k] = $this->objToArr($v);
        }
        return $arr;
    }

    private function simpleJsonParser($json){
        $json = str_replace("{","",str_replace("}","", $json));
        $jsonValue = explode(",", $json);
        $arr = array();
        foreach($jsonValue as $v){
            $jValue = explode(":", $v);
            $arr[str_replace('"',"", $jValue[0])] = (str_replace('"', "", $jValue[1]));
        }
        return $arr;
    }

    const VERSION = "2.0";

    const GET_AUTH_CODE_URL = "https://graph.qq.com/oauth2.0/authorize";
    const GET_ACCESS_TOKEN_URL = "https://graph.qq.com/oauth2.0/token";

    const GET_OPENID_URL = "https://graph.qq.com/oauth2.0/me";
}
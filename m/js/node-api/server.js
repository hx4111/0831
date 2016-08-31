var http = require("http");
var url = require("url");
var querystring = require("querystring");

http.createServer(function(request, response) {
    var pathname = url.parse(request.url).pathname;
    var query = url.parse(request.url).query;
    var postData = querystring.parse(query);
    var retJSON = null;
    var jsonpCallback;

    console.log('***************** ' + pathname + ' *****************');
    console.log(postData);
    response.writeHead(200, {"Content-Type": "text/html"});

    if (pathname === '/betInfolist4h5') {
        jsonpCallback = 'jsonp_betInfolist';
        retJSON = {
            "ret":0,    //返回状态
            "msg":"xxxxxxx",    //返回信息
            "league_id":1000018,    //周赛id
            "league_info_update_time":0,    //周赛基本信息的最后更新时间
            "ep_list_update_time":0,    //参赛作品列表的最后更新时间
            "banner_list_update_time":0,    //Banner列表的最后更新时间
            "bet_info":    //押宝基本信息
            {
                "end_time":1447776000,    //周赛截止时间，UnixTime，秒为单位
                "comment_list_title":"xxx",    //评论列表的标题
                "bet_win_money":0,    //累计押宝奖励酷币数量
            },
            "banner_list":    //banner列表
            [
                {
                    "banner_id":0,
                    "banner_cover":"http://icomicotest.qiniudn.com/zhousailaixi001_banner_20151102.jpg",
                    "banner_url":"http://m.baidu.com"
                },
                {
                    "banner_id":1,
                    "banner_cover":"http://ct.cdn.icomico.com/zhousaixinguize_banner_20151014.jpg",
                    "banner_url":"http://m.tmall.com"
                }
            ],
            "ep_list":    //参赛作品列表
            [
                {
                    "comic_id":1342,
                    "ep_id":1,
                    "ep_title":"星轨",
                    "ep_poster":"1342_ccover_b5b4592a220d5f50.jpg",
                    "ep_poster_v": "1342_ccover_hp_14bbdebb771f1958.jpg"
                },
                {
                    "comic_id":70,
                    "ep_id":1,
                    "ep_title":"诡来了",
                    "ep_poster":"70_ccover_7a94cdcc72d23596.jpg",
                    "ep_poster_v": "70_ccover_hp_46b279b8a13827fd.jpg"
                },
                {
                    "comic_id":682,
                    "ep_id":1,
                    "ep_title":"不可思议少年",
                    "ep_poster":"682_ccover_61c67a4f0247a1d0.jpg",
                    "ep_poster_v": "682_ccover_hp_f444eba1474e8bdc.jpg"
                },
                {
                    "comic_id":775,
                    "ep_id":1,
                    "ep_title":"大叔吐槽星座",
                    "ep_poster":"775_ccover_05811c102c291846.jpg",
                    "ep_poster_v": "775_ccover_hp_72d7f7eac4b76924.jpg"
                },
                {
                    "comic_id":10420,
                    "ep_id":1,
                    "ep_title":"撕破天幕",
                    "ep_poster":"10420_ccover_a4fc23eaae996fd8.jpg",
                    "ep_poster_v": "10420_ccover_hp_da8be0b6c657f12f.jpg"
                }
            ]
        };

        if (postData.ccid) {
          //参赛作品扩展信息列表，时间戳无关，每次均返回最新数据
          retJSON.ep_ext_list = [
                {
                    "comic_id":1342,    //作品id
                    "ep_id":1,    //作品id
                    "ep_order":0,    //作品排序字段
                    "bet_state":0,    //当前用户对该作品的押宝下注状态：0-未押宝下注同期任何一部作品；1-已押宝下注对应comic_id的作品；2-已经押宝了同期的另外一部作品；
                    "bet_count":20    //当前用户对该作品押宝下注的酷币数
                },
                {
                    "comic_id":70,
                    "ep_id":1,
                    "ep_order":0,
                    "bet_state":0,
                    "bet_count":50
                },
                {
                    "comic_id":682,
                    "ep_id":1,
                    "ep_order":0,
                    "bet_state":0,
                    "bet_count":40
                },
                {
                    "comic_id":775,
                    "ep_id":1,
                    "ep_order":0,
                    "bet_state":0,
                    "bet_count":80
                },
                {
                    "comic_id":10420,
                    "ep_id":1,
                    "ep_order":0,
                    "bet_state":0,
                    "bet_count":20
                }
            ];
        }
        
    } else if (pathname === '/bet') {
        var ret = Number(Math.random() - 0.5 > 0);
        var msg = ret ? '酷币不足' : '投注成功';

        jsonpCallback = 'jsonp_bet';
        retJSON = {
            "ret": ret,    //错误码：0-成功；1-失败（酷币不足）；2-失败（已经押宝了同期的另外一部作品）；3-其它-失败；
            "msg": msg,
            "comic_id":70,    //押宝下注的漫画ID
            "bet_state":0,    //当前用户对该作品的押宝下注状态：0-未押宝下注同期任何一部作品；1-已押宝下注对应comic_id的作品；2-已经押宝了同期的另外一部作品；
            "bet_money":200,    //当前用户对该作品押宝下注的酷币数
            "bet_count":2,    //该部作品当前总的押宝下注数
        };
    } else if (pathname === '/getpostlist') {
        jsonpCallback = 'jsonp_getpostlist';
        retJSON = {
          "ret":0,
          "msg":"success",
          "post_count":352,    //对应请求维度下，帖子总数
          "post_list": null,
          "user_list":    //post_list中对应的帖子发布者基本用户信息列表
          [
              {
                  "ccid":"1",
                  "nickname":"西红柿炒番茄",    //用户昵称
                  "icon":"http://q.qlogo.cn/qqapp/1103731766/A08D5391084FB13EAE42386D738B8936/100",    //用户头像
                  "author_id":0    //帖子发布者如果是一个漫画作者，则返回对应的作者ID，否则传0
              },
              {
                  "ccid":"2",
                  "nickname":"落魄的失魂鱼",    //用户昵称
                  "icon":"http://q.qlogo.cn/qqapp/1103731766/8D6B0B2E230CB9BDCEBE7F91A18900AA/100",    //用户头像
                  "author_id":0    //帖子发布者如果是一个漫画作者，则返回对应的作者ID，否则传0
              }
          ]
        };
    } else if (pathname == '/betdetail4h5') {
        jsonpCallback = 'jsonp_betdetail';
        retJSON = {
            "ret":0,    //错误码：0-成功；其它-失败
            "msg":"xxx",
            "bet_total_cost":600,    //累计押宝消耗的酷币数
            "bet_total_earn":200,    //累计押宝奖励的酷币数
            "bet_record":
            [
                {
                    "bet_id":0,
                    "title":"15期押宝消耗",
                    "subtitle":"共押12注，共消耗120酷币"
                },
                {
                    "bet_id":0,
                    "title":"15期押宝奖励",
                    "subtitle":"押中冠军，共获得40酷币"
                },
                {
                    "bet_id":0,
                    "title":"14期押宝消耗",
                    "subtitle":"共押8注，共消耗80酷币"
                },
                {
                    "bet_id":0,
                    "title":"14期押宝奖励",
                    "subtitle":"押中亚军，共获得30酷币"
                }
            ]
        };
    } else if (pathname == '/betresult') {
        retJSON = {
            "ret": 0,
            "msg": "success",
            "champion": {
                "poster": "http://cdn.icomico.com/10497_ccover_9ed6ec857f4cf84c.jpg",
                "comic_id": 10497,
                "ep_id": 1,
                "title": "迷路的异世界旅人",
                "subtitle":  "面对封闭的内心和王子的帮助，洛可可能逆转命运之轮吗？"
            },
            "winner_list": [
                {
                    "icon": "http://q.qlogo.cn/qqapp/1103731766/9D0F9827F73B72DD4E11A54FCA0BA991/100",
                    "nickname": "时间流逝",
                    "bet_count": 100
                },
                {
                    "icon": "http://ww3.sinaimg.cn/crop.0.0.768.768.1024/0062qSvGjw8euovaf2fw0j30lc0lcgmr.jpg",
                    "nickname": "系玲人i",
                    "bet_count": 95
                },
                {
                    "icon": "http://q.qlogo.cn/qqapp/1103731766/37E4D422677AD66B0EF16CABA1BAD9DD/100",
                    "nickname": "我想静静",
                    "bet_count": 80
                }
            ]
        };
        jsonpCallback = 'jsonp_betresult';
    } else if (pathname == '/checkinfo') {
        jsonpCallback = 'jsonp_checkinfo';
        retJSON = {
            "ret": 0,
            "msg": "success",
            "history":    //任务历史记录列表，按照时间从旧到新顺序排序
              [
                  {
                      "duty_type":"checkin",    //目前支持checkin类型的记录
                      "done_time":1446480000,    //完成时间，以秒为单位的UnixTime
                      "duty_money":0    //该次完成任务以后获取到的酷币数
                  },
                  {
                      "duty_type":"checkin",    //目前支持checkin类型的记录
                      "done_time":1446566400,    //完成时间，以秒为单位的UnixTime
                      "duty_money":0    //该次完成任务以后获取到的酷币数
                  },
                  {
                      "duty_type":"checkin",    //目前支持checkin类型的记录
                      "done_time":1446707420,    //完成时间，以秒为单位的UnixTime
                      "duty_money":0    //该次完成任务以后获取到的酷币数
                  },
                  {
                      "duty_type":"checkin",    //目前支持checkin类型的记录
                      "done_time":1447516800,    //完成时间，以秒为单位的UnixTime
                      "duty_money":0    //该次完成任务以后获取到的酷币数
                  },
                  {
                      "duty_type":"checkin",    //目前支持checkin类型的记录
                      "done_time":1447603200,    //完成时间，以秒为单位的UnixTime
                      "duty_money":0    //该次完成任务以后获取到的酷币数
                  },
                  {
                      "duty_type":"checkin",    //目前支持checkin类型的记录
                      "done_time":1447689600,    //完成时间，以秒为单位的UnixTime
                      "duty_money":0    //该次完成任务以后获取到的酷币数
                  },
                  {
                      "duty_type":"normal",    //目前支持checkin类型的记录
                      "done_time":1447776000,    //完成时间，以秒为单位的UnixTime
                      "duty_money":0    //该次完成任务以后获取到的酷币数
                  }
              ],
            "comic_list": [
                {
                    "comic_id": 10543,
                    "ep_id": 1,
                    "poster": "http://cdn.icomico.com/10543_ccover_hp_d0b1f34f03defeaf.jpg",
                    "title": "锵锵锵三人行"
                },
                {
                    "comic_id": 739,
                    "ep_id": 1,
                    "poster": "http://cdn.icomico.com/739_ccover_085a5af8c67674eb.jpg",
                    "title": "斗破苍穹"
                },
                {
                    "comic_id": 1095,
                    "ep_id": 1,
                    "poster": "http://cdn.icomico.com/1095_ccover_44f800e59800f3b2.jpg",
                    "title": "丘比丘比特"
                },
                {
                    "comic_id": 703,
                    "ep_id": 1,
                    "poster": "http://cdn.icomico.com/703_ccover_3652dbe6344b879f.jpg",
                    "title": "逆转童话"
                },
                {
                    "comic_id": 740,
                    "ep_id": 1,
                    "poster": "http://cdn.icomico.com/740_ccover_f66338f738c3c72c.jpg",
                    "title": "日常幻想"
                },
                {
                    "comic_id": 706,
                    "ep_id": 1,
                    "poster": "http://cdn.icomico.com/706_ccover_0ed6d86b90758b45.jpg",
                    "title": "你好！我有病！"
                }
            ]
        };
    } else if (pathname == '/report_duty4h5') {
        jsonpCallback = 'jsonp_report_duty';
        retJSON = {
            "ret":0,
            "msg":"ok",
            "wealth_total": "100元",
            "wealth_avail": "50元",   
            "duty":   //这个任务的最新数据, 结构同 任务列表的item
            {
              "duty_id": 123,
              "duty_type":"checkin",
              "detail_url": "http://",
              "status": "notdo|finished|doing",
              "title": "签到",
              "subtitle": "完成1/3, 共获得7.5元",
              "award_title": "+1元"
            },
            "duty_result":"sucess"    
        }
    }

    retJSON = JSON.stringify(retJSON);
    response.write(jsonpCallback + '(' + retJSON + ')');
    response.end();
    console.log(retJSON + '\n');
}).listen(8888);
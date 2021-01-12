import "../css/20200828.scss";
import "../../../../../node_modules/swiper/dist/css/swiper.min.css";
import "./util/api"
import axios from 'axios'
require('es6-promise').polyfill();

import Vue from 'vue'
import {vueBaberrage,MESSAGE_TYPE} from 'vue-baberrage'
import Clipboard from 'clipboard'
import Umeng from '../../../../Common/js/Umeng';
import HybridApi from '../../../common/js/hybrid';
import Toast from '../../../../Common/js/component/toast'
import Swiper from 'swiper/dist/js/swiper.min.js';
import {config} from './util/config'
import {getQueryParams} from './util/utils'

Vue.use(vueBaberrage)
const tumeng = new Umeng('1279198006', function () {
    this.push(['欧气十足抽手机', '活动H5', '访问']);
});

const swiperList = [
    require('../img/20200828/list_1.png'),
    // require('../img/20200828/list_2.png'),
    require('../img/20200828/list_3.png'),
    require('../img/20200828/list_4.png'),
    require('../img/20200828/list_5.png'),
    require('../img/20200828/list_6.png'),
    require('../img/20200828/list_7.png'),
    require('../img/20200828/list_8.png'),
    require('../img/20200828/list_9.png'),
    require('../img/20200828/list_10.png'),
    require('../img/20200828/list_11.png')
]

const vm = new Vue({
    el: '#J_pageWraper',
    data: {
        isDrawing: false,
        type: true,
        drawingGifSrcVersion1: Math.random(),
        drawingGifSrcVersion2: Math.random(),
        isFetching: false,
        // entry: getQueryParams('entry') || '1',
        userId: '',
        token: '',
        appid: null,
        platformid:null,
        userInfo: {},
        myRecord: [],
        accountInfo: {},
        allRecord: [],
        // activityId: '5982388230000000001',
        activityId: '5991881760000000001',
        shareSuccess:null,
        firstRotate:'',
        showBtn_1:false,
        showBtn_2:false,
        showBtn_3:true,
        showModalRecords: false,
        showModalNoChance: false,
        showModalBlessing: false,
        showModalSugar: false,
        showModalJK: false,
        showModalDZZ: false,
        showModalYZ: false,
        showModalYQFD: false,
        showModalYQMXP: false,
        showModalMNDFS: false,
        swiper1: null,
        swiper2: null,
        swiperList: swiperList,
        currentId: 0,
        sugarNum: 0,
        barrageList: [],
        timer: null
    },
    created() {
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            let self = this;
            self.cacheGif();
            self.getUserInfo().then(() => {
                if (self.userId) {
                    self.initLogined();
                } else {
                    self.showBtn_1=false;
                    self.showBtn_2=false;
                    self.showBtn_3=true;
                }
            });

            self.lucklyAllRecord();
            self.$nextTick(() => {
                if (self.swiper1) {
                    self.swiper1.destroy();
                }
                self.swiper1 = new Swiper('#swiper1', {
                    slidesPerView: 'auto',
                    speed: 1000,
                    loop: true,
                    autoplay: {
                      delay: 300,
                      disableOnInteraction: false,
                    },
                });
            })
        },
        initLogined() {
            let self = this
            Promise.all([self.GetUserAccount(), self.isFirst(), self.getTicketAmount()]).then(() => {
                if(self.firstRotate==true){
                    self.showBtn_1=false;
                    self.showBtn_2=false;
                    self.showBtn_3=true;
                }else if(self.shareSuccess>0){
                    self.showBtn_1=false;
                    self.showBtn_2=true;
                    self.showBtn_3=false;
                }else{
                    self.showBtn_1=true;
                    self.showBtn_2=false;
                    self.showBtn_3=false;
                }
            })
        },
        // 缓存gif动画
        cacheGif() {
            let self = this;
            if (self.type) {
                let src = 'http://statics.zhuishushenqi.com/mhd/activity/luckDraw/draw.gif?v=' + self.drawingGifSrcVersion1;
                setTimeout(function () {
                    new Image().src = src;
                }, 0);
            } else {
                let src = 'http://statics.zhuishushenqi.com/mhd/activity/luckDraw/draw.gif?v=' + self.drawingGifSrcVersion2;
                setTimeout(function () {
                    new Image().src = src;
                }, 0);
            }
        },
        getBrowser: function () {
            var userAgent = navigator.userAgent;
            return {
                ios: !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                android: userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1,
                wechat: userAgent.indexOf('MicroMessenger') > -1 || userAgent.indexOf('WindowsWechat') > -1,
                isNative: !!window.mhdJSBridge,
            };
        },
        //判断是否第一次抽奖
        isFirst:function () {
            let self = this;
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.isFirst + "?apptype=8&channel=web-app" + '&v=1',
                    data: ApiUtil.format({
                        "userid": self.userId,
                        "activityid": self.activityId,
                        "appid": self.appid,
                        "platformid":self.platformid
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        self.firstRotate = !!JSON.parse(ApiUtil.unformat(data.data.info)).isfirst;
                        console.log(self.firstRotate);
                    }
                    resolve()
                });
            })
        },
        payDraw() {
            let self = this;
            tumeng.push(['欧气十足抽手机', '活动H5', '付费抽']);
            self.getUserInfo().then(() => {
                if (self.isFetching || self.isDrawing) {
                    return false;
                }
                self.isFetching = true;
                if (!self.userId) {
                    self.isDrawing = false;
                    self.isFetching = false;
                    self.login();
                    return
                } else if ((!self.accountInfo.usingpresent && !self.accountInfo.usingdeposit) || (self.accountInfo.usingpresent+self.accountInfo.usingdeposit < 3)) {
                    self.isDrawing = false;
                    self.isFetching = false;
                    self.showModalNoChance = true;
                    return
                } else {
                    console.log(self.accountInfo.usingpresent+self.accountInfo.usingdeposit);
                    self.lucklyGift().then(() => {
                        self.$nextTick(() => {
                            let gif = document.getElementById('draw');
                            let src = '';
                            if (self.type) {
                                src = new String('http://statics.zhuishushenqi.com/mhd/activity/luckDraw/draw.gif?v=' + self.drawingGifSrcVersion1);
                            } else {
                                src = new String('http://statics.zhuishushenqi.com/mhd/activity/luckDraw/draw.gif?v=' + self.drawingGifSrcVersion2);
                            }
                            self.type = !self.type;
                            setTimeout(function(){
                                gif.src = src;
                            },0)
                            setTimeout(() => {
                                self.showModalBlessing = false;
                                self.showModalSugar = false;
                                self.isDrawing = true;
                                self.cacheGif();
                                setTimeout(function () {
                                    switch (self.giftInfo.prizearea) {
                                        // 华为 5G 手机
                                        case 'niudan202009_001':
                                            // self.showModalBlessing = true;
                                            break;
                                            // Ｊk 制服
                                        case 'niudan202009_002':
                                            self.showModalJK = true;
                                            break;
                                            // 大主宰福袋
                                        case 'niudan202009_003':
                                            self.showModalDZZ = true;
                                            break;
                                            // 元尊福袋
                                        case 'niudan202009_004':
                                            self.showModalYZ = true;
                                            break;
                                            // 迷你电风扇
                                        case 'niudan202009_005':
                                            self.showModalMNDFS = true;
                                            break;
                                            // 福袋
                                        case 'niudan202009_006':
                                            self.showModalYQFD = true;
                                            break;
                                        case 'niudan202009_007':
                                            self.showModalYQMXP = true;
                                            break;
                                            // 漫画券 800
                                        case 'niudan202009_008':
                                            self.sugarNum = 800;
                                            self.showModalSugar = true;
                                            break;
                                            // 漫画券 500
                                        case 'niudan202009_009':
                                            self.sugarNum = 500;
                                            self.showModalSugar = true;
                                            break;
                                            // 漫画券 100
                                        case 'niudan202009_010':
                                            self.sugarNum = 100;
                                            self.showModalSugar = true;
                                            break;
                                            // 漫画券 88
                                        case 'niudan202009_012':
                                            self.sugarNum = 88;
                                            self.showModalSugar = true;
                                            break;
                                            // 祝福卡
                                        case 'niudan202009_011':
                                            self.showModalBlessing = true;
                                            break;
                                        default:
                                            break;
                                    }
                                    self.GetUserAccount();
                                    self.isDrawing = false;
                                    self.isFetching = false;
                                    if (self.giftInfo.prizearea !== 'niudan202009_011') {
                                        self.barrageList.push({
                                            id: Math.random(),
                                            msg: '欧气通告: ' + self.userInfo.userName + '获得' + self.giftInfo.name,
                                            time: 5,
                                            type: MESSAGE_TYPE.NORMAL,
                                        });
                                    }
                                }, 3300)
                            },100)
                        })
                    }).catch(err => {
                        self.isDrawing = false;
                        self.isFetching = false;
                    })
                }
            })
        },

        freeDrawOnce(){
            let self = this;
            self.showBtn_1=true;
            self.showBtn_2=false;
            self.showBtn_3=false;
            tumeng.push(['欧气十足抽手机', '活动H5', '免费抽一次']);
            self.getUserInfo().then(() => {
                if (self.isFetching || self.isDrawing) {
                    return false;
                }
                self.isFetching = true;
                if (!self.userId) {
                    self.isDrawing = false;
                    self.isFetching = false;
                    self.login();
                    return
                }  else {
                    self.freeLucklyGift().then(() => {
                        self.$nextTick(() => {
                            let gif = document.getElementById('draw');
                            let src = '';
                            if (self.type) {
                                src = new String('http://statics.zhuishushenqi.com/mhd/activity/luckDraw/draw.gif?v=' + self.drawingGifSrcVersion1);
                            } else {
                                src = new String('http://statics.zhuishushenqi.com/mhd/activity/luckDraw/draw.gif?v=' + self.drawingGifSrcVersion2);
                            }
                            self.type = !self.type;
                            setTimeout(function(){
                                gif.src = src;
                            },0)
                            setTimeout(() => {
                                self.showModalBlessing = false;
                                self.showModalSugar = false;
                                self.isDrawing = true;
                                self.cacheGif();
                                setTimeout(function () {
                                    switch (self.giftInfo.prizearea) {
                                        // 华为 5G 手机
                                        case 'niudan202009_001':
                                            // self.showModalBlessing = true;
                                            break;
                                            // Ｊk 制服
                                        case 'niudan202009_002':
                                            self.showModalJK = true;
                                            break;
                                            // 大主宰福袋
                                        case 'niudan202009_003':
                                            self.showModalDZZ = true;
                                            break;
                                            // 元尊福袋
                                        case 'niudan202009_004':
                                            self.showModalYZ = true;
                                            break;
                                            // 迷你电风扇
                                        case 'niudan202009_005':
                                            self.showModalMNDFS = true;
                                            break;
                                            // 福袋
                                        case 'niudan202009_006':
                                            self.showModalYQFD = true;
                                            break;
                                            //  明星片
                                        case 'niudan202009_007':
                                            self.showModalYQMXP = true;
                                            break;
                                            // 漫画券 800
                                        case 'niudan202009_008':
                                            self.sugarNum = 800;
                                            self.showModalSugar = true;
                                            break;
                                            // 漫画券 500
                                        case 'niudan202009_009':
                                            self.sugarNum = 500;
                                            self.showModalSugar = true;
                                            break;
                                            // 漫画券 100
                                        case 'niudan202009_010':
                                            self.sugarNum = 100;
                                            self.showModalSugar = true;
                                            break;
                                            // 漫画券 88
                                        case 'niudan202009_012':
                                            self.sugarNum = 88;
                                            self.showModalSugar = true;
                                            break;
                                            // 祝福卡
                                        case 'niudan202009_011':
                                            self.showModalBlessing = true;
                                            break;
                                        default:
                                            break;
                                    }
                                    self.GetUserAccount();
                                    self.isDrawing = false;
                                    self.isFetching = false;
                                    if (self.giftInfo.prizearea !== 'niudan202009_011') {
                                        self.barrageList.push({
                                            id: Math.random(),
                                            msg: '欧气通告: ' + self.userInfo.userName + '获得' + self.giftInfo.name,
                                            time: 5,
                                            type: MESSAGE_TYPE.NORMAL,
                                        });
                                    }
                                }, 3300)
                            },100)
                        })
                    }).catch(err => {
                        self.isDrawing = false;
                        self.isFetching = false;
                    })
                }
            })
        },
        freeDraw(){
            let self = this;
            tumeng.push(['欧气十足抽手机', '活动H5', '免费抽']);
            if (!self.userId) {
                self.isDrawing = false;
                self.isFetching = false;
                self.login();
                return
            } else {
                Promise.all([self.GetUserAccount(), self.isFirst(), self.getTicketAmount()]).then(() => {
                    if(self.shareSuccess>0){
                        self.showBtn_1=false;
                        self.showBtn_2=true;
                        self.showBtn_3=false;
                    }else{
                        self.showBtn_1=true;
                        self.showBtn_2=false;
                        self.showBtn_3=false;
                    }
                })
            }
            self.getUserInfo().then(() => {
                if (self.isFetching || self.isDrawing) {
                    return false;
                }
                self.isFetching = true;
                if (!self.userId) {
                    self.isDrawing = false;
                    self.isFetching = false;
                    self.login();
                    return
                }  else {
                    self.freeLucklyGift().then(() => {
                        self.$nextTick(() => {
                            let gif = document.getElementById('draw');
                            let src = '';
                            if (self.type) {
                                src = new String('http://statics.zhuishushenqi.com/mhd/activity/luckDraw/draw.gif?v=' + self.drawingGifSrcVersion1);
                            } else {
                                src = new String('http://statics.zhuishushenqi.com/mhd/activity/luckDraw/draw.gif?v=' + self.drawingGifSrcVersion2);
                            }
                            self.type = !self.type;
                            setTimeout(function(){
                                gif.src = src;
                            },0)
                            setTimeout(() => {
                                self.showModalBlessing = false;
                                self.showModalSugar = false;
                                self.isDrawing = true;
                                self.cacheGif();
                                setTimeout(function () {
                                    switch (self.giftInfo.prizearea) {
                                        // 华为 5G 手机
                                        case 'niudan202009_001':
                                            // self.showModalBlessing = true;
                                            break;
                                            // Ｊk 制服
                                        case 'niudan202009_002':
                                            self.showModalJK = true;
                                            break;
                                            // 大主宰福袋
                                        case 'niudan202009_003':
                                            self.showModalDZZ = true;
                                            break;
                                            // 元尊福袋
                                        case 'niudan202009_004':
                                            self.showModalYZ = true;
                                            break;
                                            // 迷你电风扇
                                        case 'niudan202009_005':
                                            self.showModalMNDFS = true;
                                            break;
                                            // 福袋
                                        case 'niudan202009_006':
                                            self.showModalYQFD = true;
                                            break;
                                            //  明星片
                                        case 'niudan202009_007':
                                            self.showModalYQMXP = true;
                                            break;
                                            // 漫画券 800
                                        case 'niudan202009_008':
                                            self.sugarNum = 800;
                                            self.showModalSugar = true;
                                            break;
                                            // 漫画券 500
                                        case 'niudan202009_009':
                                            self.sugarNum = 500;
                                            self.showModalSugar = true;
                                            break;
                                            // 漫画券 100
                                        case 'niudan202009_010':
                                            self.sugarNum = 100;
                                            self.showModalSugar = true;
                                            break;
                                            // 漫画券 88
                                        case 'niudan202009_012':
                                            self.sugarNum = 88;
                                            self.showModalSugar = true;
                                            break;
                                            // 祝福卡
                                        case 'niudan202009_011':
                                            self.showModalBlessing = true;
                                            break;
                                        default:
                                            break;
                                    }
                                    self.GetUserAccount();
                                    self.isDrawing = false;
                                    self.isFetching = false;
                                    if (self.giftInfo.prizearea !== 'niudan202009_011') {
                                        self.barrageList.push({
                                            id: Math.random(),
                                            msg: '欧气通告: ' + self.userInfo.userName + '获得' + self.giftInfo.name,
                                            time: 5,
                                            type: MESSAGE_TYPE.NORMAL,
                                        });
                                    }
                                }, 3300)
                            },100)
                        })
                    }).catch(err => {
                        self.isDrawing = false;
                        self.isFetching = false;
                    })
                }
            })
        },

        copy: function () {
            var self = this;
            var clipboard = new Clipboard('.btn_copy');
            tumeng.push(['欧气十足抽手机', '活动H5', '复制']);
            clipboard.on('success', e => {
                Toast.show('复制成功');
                // 释放内存
                clipboard.destroy()
            })
            clipboard.on('error', e => {
                // 不支持复制
                Toast.show('复制失败，请手动选择复制');
                // 释放内存
                clipboard.destroy()
            })
        },
        postSharePrize:function () {
            let self=this;
            axios({
                method: 'POST',
                url: config.sharePrize + "?apptype=8&channel=web-app" + '&v=1',
                data: ApiUtil.format({
                    "userid": self.userId,
                    "activityid": self.activityId,
                    "appid": self.appid,
                    "platformid":self.platformid
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(function (res) {
                if(res.data.code==200){
                    let shareInfo = JSON.parse(ApiUtil.unformat(res.data.info));
                    self.shareSuccess=shareInfo.totalamount;
                    console.log("分享成功抽奖次数 " + self.shareSuccess);
                    if (!self.userId) {
                        self.showBtn_1=false;
                        self.showBtn_2=false;
                        self.showBtn_3=true;
                    }else {
                        if(self.shareSuccess>0){
                            self.showBtn_1=false;
                            self.showBtn_2=true;
                            self.showBtn_3=false;
                        }else{
                            self.showBtn_1=true;
                            self.showBtn_2=false;
                            self.showBtn_3=false;
                        }
                    }
                }
            });
        },
        // 我的中奖记录
        lucklyMyRecord: function () {
            let self = this;
            tumeng.push(['欧气十足抽手机', '活动H5', '我的奖品']);
            axios({
                method: 'POST',
                url: config.lucklyMyRecord + "?apptype=8",
                data: ApiUtil.format({
                    "activityid": self.activityId,
                    "userid": self.userId,
                }),
                // data: {
                //     "activityid": self.activityId,
                //     "userid": self.userId,
                // },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(function (data) {
                if (data.data.code == 200) {
                    self.myRecord = JSON.parse(ApiUtil.unformat(data.data.info));
                    // self.myRecord = data.data.info;
                }
            });
        },
        //分享
        shareUrl:function () {
            let self=this;
            tumeng.push(['欧气十足抽手机', '活动H5', '分享']);
            var browser = self.getBrowser();
            if(browser.ios === true){
                var shareUrl = 'https://apps.apple.com/cn/app/%E6%BC%AB%E7%94%BB%E5%B2%9B-%E5%BF%AB%E7%9C%8B%E4%BA%8C%E6%AC%A1%E5%85%83%E5%8A%A8%E6%BC%AB%E6%BC%AB%E7%94%BB%E7%A5%9E%E5%99%A8app/id1142972033';
            }else{
                var shareUrl = 'https://a.app.qq.com/o/simple.jsp?pkgname=com.android.comicsisland.activity';
            }
            var backUrl = 'http://m.manhuadao.cn/activity/test/20200828.html?userid=1&test=1&token=1&clientId=1';
            HybridUtil.request({
                action: 'h5Share',
                param: {
                    shareType: 'url',
                    shareUrl: shareUrl,
                    shareTitle: '欧气十足抽手机',
                    shareContent: '每天可享受免费抽奖，你还等什么',
                    shareImgUrl: 'http://statics.zhuishushenqi.com/share/share.png',
                },
                callback: function (data) {
                    if (!self.userId) {
                        self.showBtn_1=true;
                        self.showBtn_2=false;
                        return
                    }else{
                        if(data.result=='success'){
                            self.postSharePrize();
                        }else{
                            self.showBtn_1=true;
                            self.showBtn_2=false;
                            self.showBtn_2=false;
                        }
                    }
                },
            });
        },
        login: function () {
            var self = this;
            var backurl = location.href;
            HybridUtil.login({
                backurl: backurl
            });
            let timer = setInterval(() => {
                self.getUserInfo().then(() => {
                    if (self.userId) {
                        self.initLogined();
                        clearInterval(timer)
                    }
                });
            }, 1000)
            return;
        },
        // 获取票券数量
        getTicketAmount:function () {
            let self = this;
            return new Promise((resolve,reject) => {
                axios({
                    method: 'POST',
                    url: config.ticketAmount + "?apptype=8",
                    data: ApiUtil.format({
                        "activityid": self.activityId,
                        "userid": self.userId,
                        "platformid":self.platformid,
                        "tickettype":3
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        let ticketInfo = JSON.parse(ApiUtil.unformat(data.data.info));
                        self.shareSuccess=ticketInfo.ticketamount;
                        console.log(JSON.stringify("抽奖次数" + self.shareSuccess));
                    }
                    resolve()
                });
            })
        },
        // init:获取奖品：参activityid
        getUserInfo: function () {
            var self = this;
            return new Promise(function (resolve, reject) {
                var browser = self.getBrowser();
                var userInfo = HybridUtil.getUserInfo();
                self.userId = userInfo.userId;
                self.platformid = userInfo.platformid;
                self.token = userInfo.deviceCode;
                self.channel = userInfo.channel;
                self.userImg = userInfo.userImg;
                if (browser.android === true) {
                    self.appid = 6;
                } else {
                    self.appid = 1;
                }
                if (userInfo.appVersion) {
                    self.appVersion = parseInt(userInfo.appVersion.replace(/[\.]/g, ''));
                }
                self.userInfo = userInfo;
                resolve();
            });
        },
        // 账户余额
        GetUserAccount: function (fn) {
            let self = this;
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.account,
                    data: ApiUtil.format({
                        userid: self.userId,
                        platformid: 1,
                        token: self.token,
                        appid: 13,
                        apptype: 8,
                        realapptype: 16,
                        appversion: 1.0,
                        channel: 'web-app',
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        self.accountInfo = JSON.parse(ApiUtil.unformat(data.data.info));
                        console.log(JSON.stringify(self.accountInfo));
                    }
                    resolve()
                });
            })
        },
        // 所有中奖记录
        lucklyAllRecord: function () {
            var self = this;
            axios({
                method: 'POST',
                url: config.lucklyAllRecord + "?apptype=8",
                data: ApiUtil.format({
                    "activityid": self.activityId,
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(function (data) {
                if (data.data.code == 200) {
                    let count = 0,
                        limit = 4,
                        filterResult = [];
                    let allRecord = JSON.parse(ApiUtil.unformat(data.data.info));
                    allRecord.map((item) => {
                        if (item.PrizeName == '漫画券100') {
                            if (count < limit) {
                                count++;
                                filterResult.push(item)
                            }
                        } else {
                            filterResult.push(item)
                        }
                    })
                    self.allRecord = filterResult;
                    if (self.timer) {
                        clearTimeout(self.timer);
                    }
                    self.loop();
                    if (self.swiper2) {
                        self.swiper2.destroy();
                    }
                    self.$nextTick(() => {
                        self.swiper2 = new Swiper('#swiper2', {
                            direction: 'vertical',
                            speed: 1000,
                            loop: self.allRecord.length<5?false:true,
                            autoplay: {
                            delay: 300,
                            disableOnInteraction: false,
                            },
                            slidesPerView: 9,
                            loopedSlides: 11
                        });
                    })
                }
            });
        },
        loop() {
            let self = this;
            self.timer = setTimeout(() => {
                if (self.currentId >= self.allRecord.length) {
                    self.currentId = 0;
                    self.lucklyAllRecord();
                } else {
                    self.barrageList.push({
                        id: Math.random(),
                        msg: '欧气通告:' + self.allRecord[self.currentId].UserName + '获得' + self.allRecord[self.currentId].PrizeName,
                        time: 5,
                        type: MESSAGE_TYPE.NORMAL,
                    });
                    ++self.currentId;
                    self.loop();
                }
            }, Math.random() * 1000 * 5);
        },

        // 用户中奖信息
        lucklyGift: function () {
            let self = this;
            tumeng.push(['欧气十足抽手机', '活动H5', '付费抽奖信息']);
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.lucklyGift + "?apptype=8" + '&v=1',
                    data: ApiUtil.format({
                        "activityid": self.activityId,
                        "userid": self.userId,
                        "appid": self.appid,
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        tumeng.push(['欧气十足抽手机', '活动H5', '中奖']);
                        self.giftList = JSON.parse(ApiUtil.unformat(data.data.info));
                        self.giftInfo = self.giftList[0];
                        console.log(self.giftInfo);
                        if (self.giftInfo.prizetype == 1) {
                            tumeng.push(['欧气十足抽手机', '活动H5', '中奖-实物']);
                        } else {
                            tumeng.push(['欧气十足抽手机', '活动H5', '中奖-虚拟']);
                        }
                        resolve()
                    } else {
                        if (data.data.code == 203) {
                            Toast.show('由于账号限制，你无法参与抽奖');
                        } else if (data.data.code == 400) {
                            Toast.show('活动信息错误');
                        } else if (data.data.code == 202) {
                            Toast.show('参数错误');
                        } else if (data.data.code == 204) {
                            Toast.show('请注册或重新登录');
                        } else if (data.data.code == 294) {
                            Toast.show('当日机会已用完');
                        }else if (data.data.code == 293) {
                            Toast.show('抽奖次数不足');
                        }
                        reject()
                    }
                }).catch(err => {
                    reject()
                });
            })
        },
        freeLucklyGift:function () {
            let self = this;
            tumeng.push(['欧气十足抽手机', '活动H5', '免费抽奖信息']);
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.freeLucklyGift + "?apptype=8" + '&v=1',
                    data: ApiUtil.format({
                        "activityid": self.activityId,
                        "userid": self.userId,
                        "appid": self.appid,
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    console.log(JSON.stringify(data.data));
                    self.giftList = JSON.parse(ApiUtil.unformat(data.data.info));
                    console.log(JSON.stringify(self.giftList));
                    if (data.data.code == 200) {
                        tumeng.push(['欧气十足抽手机', '活动H5', '中奖']);
                        self.giftInfo = self.giftList[0];

                        if (self.giftInfo.prizetype == 1) {
                            tumeng.push(['欧气十足抽手机', '活动H5', '中奖-实物']);
                        } else {
                            tumeng.push(['欧气十足抽手机', '活动H5', '中奖-虚拟']);
                        }
                        resolve()
                    } else {
                        if (data.data.code == 203) {
                            Toast.show('由于账号限制，你无法参与抽奖');
                        } else if (data.data.code == 400) {
                            Toast.show('活动信息错误');
                        } else if (data.data.code == 202) {
                            Toast.show('参数错误');
                        } else if (data.data.code == 204) {
                            Toast.show('请注册或重新登录');
                        } else if (data.data.code == 294) {
                            Toast.show('当日机会已用完');
                        }else if(data.data.code==293){
                            Toast.show('抽奖次数不足');
                        }
                        reject()
                    }
                }).catch(err => {
                    reject()
                });
            })
        },
        //我的奖品
        showMyGift: function () {
            var self = this;
            self.getUserInfo().then(() => {
                if (!self.userId) {
                    self.login();
                    return
                } else {
                    this.lucklyMyRecord();
                    this.showModalRecords = true;
                }
            })
        },
        // 打开任务中心
        pay() {
            var self=this;
            tumeng.push(['欧气十足抽手机', '活动H5', '充值']);
            self.showModalNoChance=false;
            if (!self.userId) {
                self.isDrawing = false;
                self.isFetching = false;
                self.login();
                return
            }else{
                HybridUtil.request({
                    action: 'topUp',
                    param: {
                        type: 'dcoin',
                    },
                    callback: function() {
                        self.GetUserAccount();
                    }
                });
            }
        },
    }
});

window.refreshCallBack = function(data) {
}
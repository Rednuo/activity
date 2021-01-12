import "../css/20200813.scss";
import "../../../../../node_modules/swiper/dist/css/swiper.min.css";
import "./util/api"
import axios from 'axios'
require('es6-promise').polyfill();

import Vue from 'vue'
import {
    vueBaberrage,
    MESSAGE_TYPE
} from 'vue-baberrage'
import Clipboard from 'clipboard'
import Umeng from '../../../../Common/js/Umeng';
import HybridApi from '../../../common/js/hybrid';
import Toast from '../../../../Common/js/component/toast'
// import Swiper from 'swiper';
// import 'swiper/dist/css/swiper.min.css';
// import 'swiper/dist/js/swiper.min.js';
import Swiper from 'swiper/dist/js/swiper.min.js';
import {
    config
} from './util/config'
import {
    getQueryParams
} from './util/utils'

Vue.use(vueBaberrage)
const tumeng = new Umeng('1279198006', function () {
    this.push(['抽奖活动', '扭蛋机', '活动H5', '访问']);
});

const swiperList = [
    require('../img/20200813/list_1.png'),
    // require('../img/20200813/list_2.png'),
    require('../img/20200813/list_3.png'),
    require('../img/20200813/list_4.png'),
    require('../img/20200813/list_5.png'),
    require('../img/20200813/list_6.png'),
    require('../img/20200813/list_7.png'),
    require('../img/20200813/list_8.png'),
    require('../img/20200813/list_9.png'),
    require('../img/20200813/list_10.png'),
    require('../img/20200813/list_11.png')
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
        appid: 13,
        userInfo: {},
        myRecord: [],
        accountInfo: {},
        allRecord: [],
        activityId: '5982388230000000001',
        // activityId: '5967708390000000001',
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
    filters: {
        gold(val) {
            return val >= 10000 ? (val/10000).toFixed(2) + '万' : val
        },
    },
    methods: {
        init() {
            let self = this;
            self.cacheGif();
            self.lucklyAllRecord();
            self.getUserInfo().then(() => {
                self.GetUserAccountAdInfo();
            });
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
        draw() {
            let self = this;
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
                } else if ((!self.accountInfo.usingpresentad) || (self.accountInfo.usingpresentad < 300)) {
                    self.isDrawing = false;
                    self.isFetching = false;
                    self.showModalNoChance = true;
                    return
                } else {
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
                                        case 'niudan202008_001':
                                            // self.showModalBlessing = true;
                                            break;
                                            // Ｊk 制服
                                        case 'niudan202008_002':
                                            self.showModalJK = true;
                                            break;
                                            // 大主宰福袋
                                        case 'niudan202008_003':
                                            self.showModalDZZ = true;
                                            break;
                                            // 元尊福袋
                                        case 'niudan202008_004':
                                            self.showModalYZ = true;
                                            break;
                                            // 迷你电风扇
                                        case 'niudan202008_005':
                                            self.showModalMNDFS = true;
                                            break;
                                            // 福袋
                                        case 'niudan202008_006':
                                            self.showModalYQFD = true;
                                            break;
                                        case 'niudan202008_007':
                                            self.showModalYQMXP = true;
                                            break;
                                            // 元气糖 800
                                        case 'niudan202008_008':
                                            self.sugarNum = 800;
                                            self.showModalSugar = true;
                                            break;
                                            // 元气糖 500
                                        case 'niudan202008_009':
                                            self.sugarNum = 500;
                                            self.showModalSugar = true;
                                            break;
                                            // 元气糖 100
                                        case 'niudan202008_010':
                                            self.sugarNum = 100;
                                            self.showModalSugar = true;
                                            break;
                                            // 祝福卡
                                        case 'niudan202008_011':
                                            self.showModalBlessing = true;
                                            break;
                                        default:
                                            break;
                                    }
                                    self.GetUserAccountAdInfo();
                                    self.isDrawing = false;
                                    self.isFetching = false;
                                    if (self.giftInfo.prizearea !== 'niudan202008_011') {
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
            tumeng.push(['抽奖活动', '扭蛋机', '活动H5', '复制']);
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
        login: function () {
            var self = this;
            var backurl = location.href;
            HybridUtil.login({
                backurl: backurl
            });
            let timer = setInterval(() => {
                self.getUserInfo().then(() => {
                    if (self.userId) {
                        self.GetUserAccountAdInfo();
                        clearInterval(timer)
                    }
                });
            }, 1000)
            return;
        },
        // init:获取奖品：参activityid
        getUserInfo: function () {
            var self = this;
            return new Promise(function (resolve, reject) {
                var userInfo = HybridUtil.getUserInfo();
                self.userId = userInfo.userId;
                self.platformid = userInfo.platformid;
                self.token = userInfo.deviceCode;
                self.channel = userInfo.channel;
                self.userImg = userInfo.userImg;
                if (userInfo.appVersion) {
                    self.appVersion = parseInt(userInfo.appVersion.replace(/[\.]/g, ''));
                }
                self.userInfo = userInfo;
                resolve();
            });
        },
        // 账户余额
        GetUserAccountAdInfo: function (fn) {
            let self = this;
            axios({
                method: 'POST',
                url: config.GetUserAccountAdInfo,
                data: ApiUtil.format({
                    userid: self.userId || localStorage.getItem('userId'),
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
                    console.log(self.accountInfo);
                }
            });
        },
        // 所有中奖记录
        lucklyAllRecord: function () {
            var self = this;
            axios({
                method: 'POST',
                url: config.lucklyAllRecord + "?apptype=8",
                // data: {
                //     "activityid": self.activityId,
                // },
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
                    // let allRecord = data.data.info;
                    allRecord.map((item) => {
                        if (item.PrizeName == '元气糖100') {
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
                            loop: true,
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
        // 我的中奖记录
        lucklyMyRecord: function () {
            let self = this;
            tumeng.push(['抽奖活动', '扭蛋机', '活动H5', '我的奖品']);
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
        // 用户中奖信息
        lucklyGift: function () {
            let self = this;
            tumeng.push(['抽奖活动', '扭蛋机', '活动H5', '抽奖']);
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.lucklyGift + "?apptype=8" + '&v=1',
                    // data: {
                    //     "activityid": self.activityId,
                    //     "userid": self.userId,
                    //     "appid": self.appid,
                    // },
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
                        tumeng.push(['抽奖活动', '扭蛋机', '活动H5', '中奖']);
                        // self.giftList = data.data.info;
                        self.giftList = JSON.parse(ApiUtil.unformat(data.data.info));
                        self.giftInfo = self.giftList[0];
                        if (self.giftInfo.prizetype == 1) {
                            tumeng.push(['抽奖活动', '扭蛋机', '活动H5', '中奖-实物']);
                        } else {
                            tumeng.push(['抽奖活动', '扭蛋机', '活动H5', '中奖-虚拟']);
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
        openTaskCenter() {
            tumeng.push(['抽奖活动', '扭蛋机', '活动H5', '去赚元气糖']);
            HybridUtil.request({
                action: 'taskCenter',
            });
        },
    }
});

window.refreshCallBack = function(data) {
}
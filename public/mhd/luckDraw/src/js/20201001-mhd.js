import "../css/20201001-mhd.scss";
import "./util/api"
import axios from 'axios'
require('es6-promise').polyfill();

import Vue from 'vue'
import Umeng from '../../../../Common/js/Umeng';
import HybridApi from '../../../common/js/hybrid';
import Toast from '../../../../Common/js/component/toast'
import * as utils from '../js/util/utils'

let baseUrl = location.protocol.split(':')[0] + '://' + 'mhdpay.1391.com';
// let baseUrl = location.protocol.split(':')[0] + '://' + '192.168.21.154';
let params = '?apptype=8&appversion=1&channel=web-app'
const config = {
  //获取用户账户信息
  account: baseUrl + '/UserAccount/GetUserAccountInfo' + params,
  // 1.获取用户报名状态
  IsBaoMing: baseUrl + '/ActivityGuoQing/IsBaoMing' + params,
  // 2.报名参与活动
  CreateBaoMing: baseUrl + '/ActivityGuoQing/CreateBaoMing' + params,
  // 3.获取打卡列表及状态
  GetSignInfos: baseUrl + '/ActivityGuoQing/GetSignInfos' + params,
  // 4.打卡/补签
  Sign: baseUrl + '/ActivityGuoQing/Sign' + params,
  // 5.瓜分领取奖励
  CreatePrize: baseUrl + '/ActivityGuoQing/CreatePrize' + params,
  // 6.获取奖励领取状态
  IsCreatePrize: baseUrl + '/ActivityGuoQing/IsCreatePrize' + params,
  // 7.已补签次数
  RepairsignTime: baseUrl + '/ActivityGuoQing/RepairsignTime' + params,
  //获取服务器时间：
  getServerTime: baseUrl + '/Config/GetServerTime' + params,
};

const tumeng = new Umeng('1279198006', function () {
    this.push(['2020国庆活动- ','访问']);
});

const vm = new Vue({
    el: '#J_pageWraper',
    data: {
        userId: '',
        activeTab: 'manhuaquan',
        showModal: false,
        // sign 补签 tip 提示 gift 瓜分奖励
        modalType: 'tip',
        gift: 'gift',
        appid: 6,
        platformid: 1,
        // 已补签次数
        signCount: 0,
        // 是否已报名
        isSignUp: false,
        // 签到列表
        signList: [
            {
                date: '2020-10-01',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-10-02',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-10-03',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-10-04',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-10-05',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-10-06',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-10-07',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-10-08',
                isrepairsign: 0,
                signed: false
            },
        ],
        // 是否已领奖
        isCreatePrize: false,
        currentTime: null,
        currentDate: new Date(),
        currentSign: {}
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
        date(val) {
            let arr = val.split('-');
            return parseInt(arr[1]) + '月' + parseInt(arr[2]) + '号'
        },
    },
    methods: {
        init() {
            let self = this;
            self.getServerTime();
            self.getUserInfo().then(() => {
                if (!self.userId) {
                    self.login().then(() => {
                        self.GetSignInfos();
                        self.IsBaoMing();
                        self.IsCreatePrize();
                        self.RepairsignTime();
                    })
                } else {
                    self.GetSignInfos();
                    self.IsBaoMing();
                    self.IsCreatePrize();
                    self.RepairsignTime();
                }
            });
        },
        login: function () {
            let self = this;
            let backurl = location.href;
            return new Promise((resolve,reject) => {
                HybridUtil.login({
                    backurl: backurl
                });
                let timer = setInterval(() => {
                    self.getUserInfo().then(() => {
                        if (self.userId) {
                            clearInterval(timer);
                            resolve()
                        }
                    });
                }, 1000)
            })
        },
        getUserInfo: function () {
            let self = this;
            return new Promise(function (resolve, reject) {
                let browser = self.getBrowser();
                let userInfo = HybridUtil.getUserInfo();
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
        getServerTime() {
            let self = this;
            axios.get(config.getServerTime + '&t=' + new Date().getTime()).then((res) => {
                if (res.data.code == 200) {
                    let info = JSON.parse(ApiUtil.unformat(res.data.info));
                    self.currentTime = new Date(info * 1000);
                    self.currentDate = utils.getDate(self.currentTime);
                    console.log(self.currentDate)
                    let tick = 5;
                    setInterval(() => {
                        self.currentTime = new Date(self.currentTime.getTime() + 1000 * tick);
                        self.currentDate = utils.getDate(self.currentTime);
                    }, 1000 * tick)
                }
            })
        },
        IsBaoMing:function () {
            let self = this;
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.IsBaoMing,
                    data: ApiUtil.format({
                        "userid": self.userId,
                        "appid": self.appid,
                        "platformid":self.platformid
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        self.isSignUp = true;
                    }
                    resolve()
                });
            })
        },
        CreateBaoMing:function () {
            let self = this;
            if (self.isSignUp) {
                return
            }
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.CreateBaoMing,
                    data: ApiUtil.format({
                        "userid": self.userId,
                        "appid": self.appid,
                        "platformid":self.platformid
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        self.isSignUp = true;
                        Toast.show('报名成功')
                    } else {
                        Toast.show(data.data.code_msg)
                    }
                    tumeng.push(['2020国庆活动- ','点击报名']);
                    resolve()
                });
            })
        },
        GetSignInfos:function () {
            let self = this;
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.GetSignInfos,
                    data: ApiUtil.format({
                        "userid": self.userId,
                        "appid": self.appid,
                        "platformid":self.platformid
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        console.log(ApiUtil.unformat(data.data.info))
                        let info = JSON.parse(ApiUtil.unformat(data.data.info));
                        console.log(info)
                        self.signList = self.signList.map((signitem) => {
                            let temp  = info.find((infoitem) => {
                                return infoitem.signtime == signitem.date
                            })
                            if (temp) {
                                signitem.signed = true
                            }
                            return signitem
                        })
                    } else {
                        Toast.show(data.data.code_msg)
                    }
                    resolve()
                });
            })
        },
        toogle(tab) {
            this.activeTab = tab;
            tumeng.push(['2020国庆活动- ','tab切换',tab == 'manhuaquan' ? '漫画券' : '爆更']);
        },
        Sign:function (item, isrepairsign) {
            let self = this;
            console.log({
                "userid": self.userId,
                "signtime": item.date,
                "isrepairsign": isrepairsign,
                "appid": self.appid,
                "platformid":self.platformid
            })
            if (isrepairsign) {
                tumeng.push(['2020国庆活动- ','点击签到']);
            } else {
                tumeng.push(['2020国庆活动- ','点击补签']);
            }
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.Sign,
                    data: ApiUtil.format({
                        "userid": self.userId,
                        "signtime": item.date,
                        "isrepairsign": isrepairsign,
                        "appid": self.appid,
                        "platformid":self.platformid
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        self.signList = self.signList.map((signitem) => {
                            if (signitem.date == item.date) {
                                signitem.signed = true;
                            }
                            return signitem
                        })
                        Toast.show('签到成功')
                        self.showModal = false;
                        if (isrepairsign) {
                            self.signCount ++;
                        }
                        if (self.signList.filter((item) => item.signed).length == self.signList.length) {
                            self.modalType = 'gift';
                            self.showModal = true;
                            tumeng.push(['2020国庆活动- ','8天弹窗']);
                        }
                    } else {
                        Toast.show(data.data.code_msg)
                    }
                    resolve()
                });
            })
        },
        CreatePrize:function () {
            let self = this;
            tumeng.push(['2020国庆活动- ','瓜分奖励']);
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.CreatePrize,
                    data: ApiUtil.format({
                        "userid": self.userId,
                        "appid": self.appid,
                        "platformid":self.platformid
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        let info = JSON.parse(ApiUtil.unformat(data.data.info));
                        self.modalType = 'tip';
                        self.gift = info;
                        self.showModal = true;
                        tumeng.push(['2020国庆活动- ','瓜分奖励弹窗']);
                    } else {
                        Toast.show(data.data.code_msg)
                    }
                    resolve()
                });
            })
        },
        IsCreatePrize:function () {
            let self = this;
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.IsCreatePrize,
                    data: ApiUtil.format({
                        "userid": self.userId,
                        "appid": self.appid,
                        "platformid":self.platformid
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        self.isCreatePrize = false;
                    } else {
                        self.isCreatePrize = true;
                    }
                    resolve()
                });
            })
        },
        RepairsignTime:function () {
            let self = this;
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.RepairsignTime,
                    data: ApiUtil.format({
                        "userid": self.userId,
                        "appid": self.appid,
                        "platformid":self.platformid
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        let info = JSON.parse(ApiUtil.unformat(data.data.info));
                        console.log(info)
                        self.signCount = info;
                    }
                    resolve()
                });
            })
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
        onClickCard(item) {
            let self = this;
            if (!self.isSignUp) {
                Toast.show('需要先报名活动')
                return
            }
            console.log(item.date)
            console.log(new Date(item.date.replace(/-/g, "/")))
            console.log(self.currentDate)
            if (item.signed) {
                return
            } else if (new Date(item.date.replace(/-/g, "/")) < new Date(self.currentDate.replace(/-/g, "/"))) {
                self.modalType = 'sign';
                self.showModal  = true;
                self.currentSign = item;
                tumeng.push(['2020国庆活动- ','补签弹窗']);
            } else if (new Date(item.date.replace(/-/g, "/")) > new Date(self.currentDate.replace(/-/g, "/"))) {
                Toast.show('未到签到时间')
            } else {
                self.Sign(item, 0)
            }
        },
        openComicDetail:function (id) {
            tumeng.push(['2020国庆活动- ','点击阅读', id]);
            HybridUtil.request({
                action: 'comicDetail',
                param: {
                    storeBookId: id,
                }
            });
        }
    }
});

window.refreshCallBack = function(data) {
}
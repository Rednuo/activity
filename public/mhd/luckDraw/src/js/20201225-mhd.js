import "../css/20201225-mhd.scss";
import "./util/api"
import axios from 'axios'
require('es6-promise').polyfill();

import Vue from 'vue'
import Umeng from '../../../../Common/js/Umeng';
import HybridApi from '../../../common/js/hybrid';
import Toast from '../../../../Common/js/component/toast'
import * as utils from './util/utils'
// import vConsole from 'vconsole'
// new vConsole();

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
  // 7.已补签次数
  RepairsignTime: baseUrl + '/ActivityGuoQing/RepairsignTime' + params,
    //提示获取奖金金额
  GetPrizeInfo: baseUrl + '/ActivityGuoQing/GetPrizeInfo' + params,
  //获取服务器时间：
  getServerTime: baseUrl + '/Config/GetServerTime' + params,
};

const tumeng = new Umeng('1279198006', function () {
    this.push(['2020双旦活动- ','访问']);
});

const vm = new Vue({
    el: '#J_pageWraper',
    data: {
        userId: '',
        showModal: false,
        gift: 'gift',
        appid: 6,
        platformid: 1,
        signCount:0,
        projectid:2,
        // 是否已报名
        isSignUp: false,
        isEnough:false,//余额不足
        baoMing:false,//报名
        getPrize:false,//成功瓜分
        signSuccess:false,//成功签到
        signAdd:false,//补签
        // 签到列表
        signList: [
            {
                date: '2020-12-15',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-12-16',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-12-17',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-12-18',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-12-19',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-12-20',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-12-21',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-12-22',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-12-23',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-12-24',
                isrepairsign: 0,
                signed: false
            },
            {
                date: '2020-12-25',
                isrepairsign: 0,
                signed: false
            },
        ],
        // 是否已领奖
        currentTime: null,
        currentDate: new Date(),
        signedLen:null,
        currentSign:{},
        dialog:["瓜分500W豪礼！","下拉页面去报名~"],
        dialogItem:'瓜分500W豪礼！',
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
            let i=0;
            setInterval(() => {
                self.dialogItem=self.dialog[i];
                i++;
                if(i>1){
                    i=0
                }
            }, 1000);
            self.getUserInfo().then(() => {
                if (!self.userId) {
                    self.login().then(() => {
                        self.GetSignInfos();
                        self.IsBaoMing();
                    })
                } else {
                    self.GetSignInfos();
                    self.IsBaoMing();
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
                self.appid = 6;
                // if (browser.android === true) {
                //     self.appid = 6;
                // } else {
                //     self.appid = 1;
                // }
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
                    console.log('1'+self.currentDate);
                    self.currentDate = utils.getDate(self.currentTime);
                    console.log('2'+self.currentDate);
                    let tick = 5;
                    setInterval(() => {
                        self.currentTime = new Date(self.currentTime.getTime() + 1000 * tick);
                        self.currentDate = utils.getDate(self.currentTime);
                        if(new Date('2021/01/03 20:08:00') < self.currentTime){
                            if(localStorage.getItem("isGetPrize"+self.userId)){
                                console.log("非第一次");
                            }else{
                                self.GetPrizeInfo();
                                localStorage.setItem("isGetPrize"+self.userId,true);
                            }
                        }
                    }, 1000 * tick);
                }
            })
        },
        goLottery:function () {
            let self=this;
            // HybridUtil.request({
            //     action: "jump",
            //     param: {
            //         'jumpType':'webview',
            //         'fullscreen': 1,
            //         'title':'抽奖',
            //         'link':'http://m.manhuadao.cn/activity/mhd-lottery/index01.html'
            //     },
            //     callback:function () {
            //         self.freshen=false;
            //         self.init();
            //     },
            // });
            Toast.show('活动已结束');
        },
        goPay:function () {
            HybridUtil.request({
                action: 'topUp',
                param: {
                    type: 'dcoin',
                },
            });
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
                        "platformid":self.platformid,
                        "projectid":2
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
        //参与瓜分
        CreateBaoMing:function () {
            let self = this;
            if (self.isSignUp) {
                Toast.show('已报名成功')
                return
            }
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.CreateBaoMing,
                    data: ApiUtil.format({
                        "userid": self.userId,
                        "appid": self.appid,
                        // "platformid":self.platformid,
                        "platformid":1,
                        "projectid":2
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        self.isSignUp = true;
                        self.baoMing=true;
                        Toast.show('报名成功')
                    } else {
                        Toast.show(data.data.code_msg);
                        self.isEnough=true;//余额不足
                    }
                    tumeng.push(['2020双旦活动- ','点击报名']);
                    resolve()
                });
            })
        },
        //签到历史
        GetSignInfos:function () {
            let self = this;
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.GetSignInfos,
                    data: ApiUtil.format({
                        "userid": self.userId,
                        "appid": self.appid,
                        "platformid":self.platformid,
                        "projectid":2
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        let info = JSON.parse(ApiUtil.unformat(data.data.info));
                        // self.signList = self.signList.map((signitem) => {
                        //     let temp  = info.find((infoitem) => {
                        //         return infoitem.signtime == signitem.date
                        //     })
                        //     if (temp) {
                        //         signitem.signed = true
                        //     }
                        //     return signitem
                        // });
                        let signedList=info.filter((item)=>{
                            return item.isSign==true
                        });
                        self.signedLen=signedList.length;
                        self.signList=info;
                        console.log('signList');
                        console.log(self.signList);
                    } else {
                        Toast.show(data.data.code_msg)
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
                        self.signCount=info;
                        console.log('RepairsignTime')
                        console.log(info)
                    }
                    resolve()
                });
            })
        },
        //签到
        Sign:function (item, isrepairsign) {
            let self = this;
            console.log({
                "userid": self.userId,
                "signtime": item.signtime,
                "isrepairsign": isrepairsign,
                "appid": self.appid,
                "platformid":self.platformid
            })
            if (isrepairsign) {
                tumeng.push(['2020双旦活动- ','点击签到']);
            } else {
                tumeng.push(['2020双旦活动- ','点击补签']);
            }
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.Sign,
                    data: ApiUtil.format({
                        "userid": self.userId,
                        "signtime": item.signtime,
                        "isrepairsign": isrepairsign,
                        "appid": self.appid,
                        "platformid":self.platformid,
                        "projectid":2
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        self.signSuccess=true;
                        self.GetSignInfos();
                        Toast.show('签到成功')
                        tumeng.push(['2020双旦活动- ','签到成功']);
                    } else {
                        Toast.show(data.data.code_msg)
                    }
                    resolve()
                });
            })
        },
        GetPrizeInfo:function () {
            let self = this;
            tumeng.push(['2020双旦活动- ','瓜分奖励']);
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.GetPrizeInfo,
                    data: ApiUtil.format({
                        "userid": self.userId,
                        "appid": self.appid,
                        "platformid":self.platformid,
                        "projectid":2
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        let info = JSON.parse(ApiUtil.unformat(data.data.info));
                        self.gift = info;
                        self.getPrize = true;
                        if(info){
                            tumeng.push(['2020双旦活动- ','瓜分奖励弹窗']);
                        }else{
                            tumeng.push(['2020双旦活动- ','未中奖']);
                        }

                    } else {
                        Toast.show(data.data.code_msg)
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
            if(new Date('2021/01/03 20:00:00') > self.currentTime){
                if (!self.isSignUp) {
                    Toast.show('需要先报名活动');
                    return
                }
                if (item.signed) {//已签到
                    Toast.show('已签到');
                    return
                } else if ((new Date(item.signtime.replace(/-/g, "/")) < new Date(self.currentDate.replace(/-/g, "/"))) && item.isSign==false) {
                    //补签
                    self.RepairsignTime();
                    self.signAdd=true;
                    self.currentSign = item;
                    tumeng.push(['2020双旦活动- ','补签弹窗']);
                } else if (new Date(item.signtime.replace(/-/g, "/")) > new Date(self.currentDate.replace(/-/g, "/"))) {
                    //未到签到时间
                    Toast.show('未到签到时间')
                } else {//签到
                    self.Sign(item, 0);
                }
            }else{
                Toast.show('签到已结束');
            }
        }
    }
});

window.refreshCallBack = function(data) {
}
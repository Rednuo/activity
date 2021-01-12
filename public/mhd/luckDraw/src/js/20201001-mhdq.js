import "../css/20201001-mhdq.scss";
require('es6-promise').polyfill();

import Vue from 'vue'
import "./util/api"
import axios from 'axios'
import Umeng from '../../../../Common/js/Umeng';
import HybridApi from '../../../common/js/hybrid';
import Toast from '../../../../Common/js/component/toast'
import {
    config
} from './util/config'
import {
    getQueryParams
} from './util/utils'

const tumeng = new Umeng('1279198006', function () {
    this.push(['漫画大全-积分许愿瓶', '许愿瓶', '活动H5', '访问']);
});

const vm = new Vue({
    el: '#J_pageWraper',
    data: {
        type: true,
        // userId: 17127931,
        userId: localStorage.getItem('userId') || '',
        token: '',
        appid: 16,
        userInfo: {},
        isStart: true,
        isEnd:false,
        accountInfo: {},
        activityId: '6014297420000000002',
        ouqiInfo:{},
        tipTxt:'',
        todayouqi:null,
        allouqi:0,
        sugarNum:888,
        showModalOq:false,
        showModalExchange:false,
        // showModalDZZ:false,
        showModalDzz:false,
        showModalBz:false,
        showModalYqt:false,
        isShake:false,
        isRward:false,
        yqName:'',
        currentGift: {}
    },
    created() {
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            let self = this;
            self.getUserInfo().then(() => {
                console.log(!self.userId);
                if(!self.userId){
                    self.login().then(()=>{
                        self.GetUserAccountAdInfo();
                        self.getOuqiInfo();
                    });
                }else{
                    self.GetUserAccountAdInfo();
                    self.getOuqiInfo();
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
                console.log('用户信息');
                console.log(userInfo);
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
                    appid: self.appid,
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(function (data) {
                if (data.data.code == 200) {
                    self.accountInfo = JSON.parse(ApiUtil.unformat(data.data.info));
                    console.log('账户信息');
                    console.log(self.accountInfo.usingpresentad);
                }
            });
        },
        // 每日签到获取积分信息
        getOuqiInfo: function () {
            let self = this;
            axios({
                method: 'POST',
                url: config.getOuqiInfo,
                data: ApiUtil.format({
                    activityid: self.activityId,
                    userid: self.userId || localStorage.getItem('userId'),
                    platformid: 1,
                    token: self.token,
                    appid: self.appid,
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(function (data) {
                if (data.data.code == 200) {
                    let ouqiInfo = JSON.parse(ApiUtil.unformat(data.data.info));
                    self.ouqiInfo=ouqiInfo;
                    self.allouqi=ouqiInfo.allouqi;
                    tumeng.push(['漫画大全-积分许愿瓶', '活动H5', '签到']);
                    console.log('积分信息');
                    console.log(ouqiInfo);
                    self.isEnd=false;
                    self.isStart=true;
                    if(ouqiInfo.todayouqi>0){
                        self.showModalOq=true;
                    }
                    if(ouqiInfo.isaward==1){
                        self.tipTxt="已开奖~";
                        self.isShake=true;
                        Toast.show('已获得奖品，无法再次抽奖')
                    }else if(ouqiInfo.allouqi>6665){
                        self.tipTxt="可开奖~";
                        self.isShake=true;
                        Toast.show('积分已满，快去开奖')
                    }else{
                        self.tipTxt="积分蓄力ing...";
                        self.isShake=false;
                    }
                }else if(data.data == 211){
                    self.isStart=false;
                    Toast.show('活动未开始');
                }else if(data.data == 212){
                    self.isEnd=true;
                    Toast.show('活动已停止');
                }else{
                    Toast.show(data.data.code_msg);
                }
            });
        },
        // 每日签到获取积分信息
        updateOuqiInfo: function () {
            let self = this;
            axios({
                method: 'POST',
                url: config.getOuqiInfo,
                data: ApiUtil.format({
                    activityid: self.activityId,
                    userid: self.userId || localStorage.getItem('userId'),
                    platformid: 1,
                    token: self.token,
                    appid: self.appid,
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            }).then(function (data) {
                if (data.data.code == 200) {
                    let ouqiInfo = JSON.parse(ApiUtil.unformat(data.data.info));
                    self.ouqiInfo=ouqiInfo;
                    self.allouqi=ouqiInfo.allouqi;
                    // tumeng.push(['漫画大全-积分许愿瓶', '活动H5', '签到']);
                    // console.log('积分信息');
                    // console.log(ouqiInfo);
                    self.isEnd=false;
                    self.isStart=true;
                    // if(ouqiInfo.todayouqi>0){
                    //     self.showModalOq=true;
                    // }
                    // if(ouqiInfo.isaward==1){
                    self.tipTxt="已开奖~";
                    self.isShake=true;
                    //     Toast.show('已获得奖品，无法再次抽奖')
                    // }else if(ouqiInfo.allouqi>6665){
                    //     self.tipTxt="可开奖~";
                    //     self.isShake=true;
                    //     Toast.show('积分已满，快去开奖')
                    // }else{
                    //     self.tipTxt="积分蓄力ing...";
                    //     self.isShake=false;
                    // }
                }else if(data.data == 211){
                    self.isStart=false;
                    Toast.show('活动未开始');
                }else if(data.data == 212){
                    self.isEnd=true;
                    Toast.show('活动已停止');
                }else{
                    Toast.show(data.data.code_msg);
                }
            });
        },
        // 用户漫画大全糖兑换积分
        exchangeOuqi: function (ouqi) {
            var self = this;
            console.log(ouqi);
            if(ouqi>self.accountInfo.usingpresentad){
                Toast.show('积分不足')
            }else if(ouqi>888){
                Toast.show('最多可兑换888积分')
            }else{
                axios({
                    method: 'POST',
                    url: config.exchangeOuqi,
                    data: ApiUtil.format({
                        activityid: self.activityId,
                        userid: self.userId || localStorage.getItem('userId'),
                        platformid: 1,
                        needouqi:ouqi,
                        token: self.token,
                        appid: self.appid,
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    if (data.data.code == 200) {
                        tumeng.push(['漫画大全-积分许愿瓶', '活动H5', '兑换']);
                        let info = JSON.parse(ApiUtil.unformat(data.data.info));
                        self.showModalExchange=false;
                        Toast.show('兑换'+info.useyqt+'成功');
                        self.getOuqiInfo();
                        self.GetUserAccountAdInfo();
                        console.log(info)
                    }else{
                        Toast.show(data.data.code_msg);
                    }
                });
            }

        },
        // 注入漫画大全值
        showExchange:function () {
            let self=this;
            if (self.tipTxt == '已开奖~') {
                Toast.show('已获得奖品，无法再次抽奖')
            }else if(self.isStart==false){
                Toast.show('活动未开始');
                return false
            }else if(self.isEnd==true){
                Toast.show('活动已结束');
            }else if(self.ouqiInfo.isaward==1){
                Toast.show('已开奖')
            }else if(self.accountInfo.usingpresentad>1){
                self.showModalExchange=true;
                tumeng.push(['漫画大全-积分许愿瓶', '活动H5', '兑换点击']);
            }else{
                Toast.show('余额不足')
            }
        },
        // 提示
        showToast:function (msg) {
            Toast.show(msg);
        },
        // 开始抽奖 用户中奖信息
        lucklyGift: function () {
            let self = this;
            console.log(1);
            return new Promise((resolve, reject) => {
                axios({
                    method: 'POST',
                    url: config.startRotate,
                    data: ApiUtil.format({
                        activityid: self.activityId,
                        userid: self.userId || localStorage.getItem('userId'),
                        platformid: 1,
                        token: self.token,
                        appid: self.appid,
                    }),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }).then(function (data) {
                    console.log("data");
                    console.log(data);
                    if (data.data.code == 200) {
                        tumeng.push(['漫画大全-积分许愿瓶', '活动H5', '中奖']);
                        let giftInfo = JSON.parse(ApiUtil.unformat(data.data.info));
                        console.log('giftInfo');
                        console.log(giftInfo);
                        self.currentGift = giftInfo[0];
                        switch (self.currentGift.prizearea) {
                            case 'ouqi202010_101':
                                // self.yqName='50';
                                self.showModalYqt = true;
                                break;
                            case 'ouqi202010_102':
                                console.log(11111111);
                                // self.yqName='100';
                                self.showModalYqt = true;
                                break;
                            case 'ouqi202010_103':
                                // self.yqName='300';
                                self.showModalYqt = true;
                                break;
                            case 'ouqi202010_104':
                                self.showModalBz = true;
                                break;
                                // 福袋随机
                            // case 'ouqi202010_105':
                            //     self.showModalDZZ = true;
                            //     break;
                                // 大主宰画册
                            case 'ouqi202010_106':
                                self.showModalDzz = true;
                                break;
                            default:
                                break;
                        }
                        resolve()
                    } else if(data.data.code==295){
                        self.isRward=true;
                        Toast.show(data.data.code_msg);
                    }else {
                        Toast.show(data.data.code_msg);
                    }
                }).then(() => {
                    self.GetUserAccountAdInfo();
                    // self.tipTxt="已领取~";
                    // self.isShake=true;
                    self.updateOuqiInfo();
                }).catch(err => {
                    reject()
                });
            })
        },
    }
});

window.refreshCallBack = function(data) {
}
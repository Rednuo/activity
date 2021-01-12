import "../scss/201905018.scss";
require('es6-promise').polyfill();

import Vue from 'vue'
import axios from 'axios'
import { url } from './config'
import * as tools from './utils'
import fastclick from '../../../Common/js/fastclick'
import HybridApi from '../../../Common/js/bridge'

new Vue({
    el: '#J_pageWraper',
    data: {
        token: tools.getQueryParams('token') || '',
        pageType: tools.getQueryParams('type') || 'main',
        isFetching: true,
        bookList:[],
        joinCount: 0,
        isMonthly: false
    },
    created: function () {
        fastclick.init();
        HybridApi.init();
    },
    mounted: function () {
        this.umeng('201905018访问')
        HybridApi.setUserBehavior(`f02##-1|201905018`);
        this.init();
    },
    methods: {
        init(){
            this.getUserAccount();
            this.getJoinCount();
        },
        umeng: function(action){
            _czc.push(["_trackEvent", "爆款书籍", "活动H5", action, 1, "active"]);
        },
        callNative:function( data ){
            var self = this;
            if( data.umeng ){
                self.umeng( umeng );
            }
            HybridApi.request({
                action: data.action,
                param: data.params
            });
        },
        getUserAccount() {
            let self = this;
            if(!self.token){
                self.isFetching = false;
                return;
            } 
            axios.get(url.getAccount+self.token).then((res) => {
                self.isFetching = false;
                res = res.data;
                if (res && res.ok) {
                    self.isMonthly = res.isMonthly;
                }
            });
        },
        getJoinCount(){
            let timeStemp = parseInt(new Date().getTime()/1000)-1559094000;
            this.joinCount = parseInt(timeStemp/2);
        },
        jumpVip(){
            const isMonthly = this.isMonthly;
            HybridApi.setUserBehavior(`40##-1|5`);
            if(isMonthly){
                this.callNative({action: 'jump',params:{'jumpType':'native','pageType':'bookDetail','id':'5c35cbd30ed881c662f8de71','code':'B1##-1|5c35cbd30ed881c662f8de71##九龙拉棺##-1##-1##201905018$__$爆款书籍##-1##-1##-1'}});
            }else{
                this.callNative({action: 'jump',params:{'jumpType':'native','pageType':'monthlyPay'}})
            }
        }
    }
});
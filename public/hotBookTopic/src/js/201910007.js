import "../scss/201910007.scss";
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
        bookList:[],
        isFetching:true,
        isMonthly: true
    },
    created: function () {
        fastclick.init();
        HybridApi.init();
    },
    mounted: function () {
        this.umeng('201910007访问')
        HybridApi.setUserBehavior(`f02##-1|201910007`);
        this.init();
    },
    methods: {
        init(){
            this.getUserInfo();
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
        clickVideo:function () {
            this.umeng( '201910007视频点击' );
        },
        getUserInfo() {
            let self=this;
            if(self.token){
                this.getUserAccount();
            }else{
                self.isMonthly=true
            }
        },
        getUserAccount() {
            let self = this;
            axios.get(url.getAccount+self.token).then((res) => {
                self.isFetching = false;
                res = res.data;
                if (res && res.ok) {
                    self.isMonthly = res.isMonthly;
                }
            });
        },
    }
});
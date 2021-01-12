import "../scss/201911001.scss";
require('es6-promise').polyfill();

import Vue from 'vue'
import * as tools from './utils'
import fastclick from '../../../Common/js/fastclick'
import HybridApi from '../../../Common/js/bridge'
import { initExposure } from "../../../Common/js/exposure";

new Vue({
    el: '#J_pageWraper',
    data: {
        token: tools.getQueryParams('token') || '',
        bookList:[],
        isFetching:true,
        isLogin:false,
        isMonthly: true
    },
    created: function () {
        fastclick.init();
        HybridApi.init();
        initExposure();
    },
    mounted: function () {
        this.umeng('201911001访问')
        HybridApi.setUserBehavior(`f02##-1|201911001`);
        this.init();
    },
    methods: {
        init(){
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
        setBI:function (data) {
            HybridApi.setUserBehavior(data);
        }
    }
});
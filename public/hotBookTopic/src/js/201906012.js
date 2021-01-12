import "../scss/201906012.scss";
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
        edition: tools.getQueryParams('edition') == 'free' ? '免费版' : '付费版', //付费版payment /免费版 free
    },
    created: function () {
        fastclick.init();
        HybridApi.init();
    },
    mounted: function () {
        this.umeng('201906012访问' + this.edition)
        HybridApi.setUserBehavior(`f02##-1|201906012##` + this.edition);
    },
    methods: {
        umeng: function(action){
            _czc.push(["_trackEvent", "爆款书籍", this.edition, "活动H5", action, 1, "active"]);
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
    }
});
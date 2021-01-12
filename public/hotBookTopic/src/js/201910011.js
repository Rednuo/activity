import "../scss/201910011.scss";
require('es6-promise').polyfill();

import Vue from 'vue'
import fastclick from '../../../Common/js/fastclick'
import HybridApi from '../../../Common/js/bridge'

new Vue({
    el: '#J_pageWraper',
    data: {
        bookList:[],
        isFetching:true
    },
    created: function () {
        fastclick.init();
        HybridApi.init();
    },
    mounted: function () {
        this.umeng('201910011访问')
        HybridApi.setUserBehavior(`f02##-1|201910011`);
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
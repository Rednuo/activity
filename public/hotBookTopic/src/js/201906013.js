import "../scss/201906013.scss";
require('es6-promise').polyfill();

import Vue from 'vue'
import fastclick from '../../../Common/js/fastclick'
import HybridApi from '../../../Common/js/bridge'

new Vue({
    el: '#J_pageWraper',
    data: {
        bookList:[]
    },
    created: function () {
        fastclick.init();
        HybridApi.init();
    },
    mounted: function () {
        this.umeng('201906013访问')
        HybridApi.setUserBehavior(`f02##-1|201906013`);
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
        linkNative:function(link,title){
            HybridApi.request({
                action: 'jump',
                param: {
                    "link": link,
                    "jumpType": "webview",
                    "title": title,
                }
            });
        }
    }
});
import "../scss/201905008.scss";
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
        bookList:[],
        joinCount: 0,
        isMonthly: false
    },
    created: function () {
        fastclick.init();
        HybridApi.init();
    },
    mounted: function () {
        this.umeng('201905008访问')
        this.init();
    },
    methods: {
        init(){
            this.getBookList();
            this.getJoinCount();
            this.getUserAccount();
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
        getBookList() {
            let self = this;
            axios.get(`${url.getBookListNode}${self.pageType=='free' ? 'a633c621362d4e889ecefa048d8e2fb8': 'b07f73cf89f04703aa69df89fed8ba69'}`).then((res) => {
                res = res.data;
                if (res && res.ok) {
                    self.bookList = res.data.books.splice(0,6);
                }
            });
        },
        getUserAccount() {
            let self = this;
            if(!self.token) return;
            axios.get(url.getAccount+self.token).then((res) => {
                res = res.data;
                if (res && res.ok) {
                    self.isMonthly = res.isMonthly;
                }
            });
        },
        getJoinCount(){
            let timeStemp = parseInt(new Date().getTime()/1000)-1558078000;
            this.joinCount = parseInt(timeStemp/2);
        }
    }
});
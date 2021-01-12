import "../scss/201905015.scss";
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
        isFetching: true,
        joinCount: 0,
        isMonthly: false
    },
    created: function () {
        fastclick.init();
        HybridApi.init();
    },
    mounted: function () {
        this.umeng('201905015访问')
        HybridApi.setUserBehavior(`f02##-1|201905015`);
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
            axios.get(`${url.getBookListNode}6059310f70cf4fb18a91ed873ae8c545`).then((res) => {
                res = res.data;
                if (res && res.ok) {
                    self.bookList = res.data.books.splice(0,6);
                }
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
            let timeStemp = parseInt(new Date().getTime()/1000)-1558582000;
            this.joinCount = parseInt(timeStemp/2);
        },
        jumpVip(){
            const isMonthly = this.isMonthly;
            HybridApi.setUserBehavior(`40##-1|5`);
            if(isMonthly){
                this.callNative({action: 'jump',params:{'jumpType':'native','pageType':'bookDetail','id':'59427fe08d76f6415f40a168','code':'B1##-1|59427fe08d76f6415f40a168##王爷，心有鱼力不足##-1##-1##201905015$__$爆款书籍##-1##-1##-1'}})
            }else{
                this.callNative({action: 'jump',params:{'jumpType':'native','pageType':'monthlyPay'}})
            }
        }
    }
});
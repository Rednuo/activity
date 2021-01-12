import "../scss/201908012.scss";
require('es6-promise').polyfill();

import Vue from 'vue'
import axios from 'axios'
import { url } from './config'
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
        this.umeng('201908012访问')
        HybridApi.setUserBehavior(`f02##-1|201908012`);
        this.init();
    },
    methods: {
        init(){
            this.getBookList();
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
            axios.get(`${url.getBookListNode}7dadecc974ad441ab958e83d30ad462a`).then((res) => {
                res = res.data;
                if (res && res.ok) {
                    self.bookList = res.data.books;
                }
            });
        }
    }
});
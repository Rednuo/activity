import "../scss/201907002.scss";
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
        bookList:[]
    },
    created: function () {
        fastclick.init();
        HybridApi.init();
    },
    mounted: function () {
        this.umeng('201907002访问')
        HybridApi.setUserBehavior(`f02##-1|201907002`);
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
        getBookList() {
            let self = this;
            axios.get(`${url.getBookListNode}ed87f064125c4296a3867f30b5a85c8f`).then((res) => {
                res = res.data;
                if (res && res.ok) {
                    console.log(res)
                    self.bookList = res.data.books;
                }
            });
        },
    }
});
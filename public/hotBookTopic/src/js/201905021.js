import "../scss/201905021.scss";
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
        this.umeng('201905021访问')
        HybridApi.setUserBehavior(`f02##-1|201905021`);
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
            axios.get(`${url.getBookListNode}fc725a8c5d2546e0be6f1c621e0bac5e`).then((res) => {
                res = res.data;
                if (res && res.ok) {
                    self.bookList = res.data.books.splice(0,6);
                }
            });
        },
        batchAddBookShelf() {
            let self = this,
                idArr = [];
            for(let i=0; i<self.bookList.length; i++){
                idArr.push(self.bookList[i]._id)
                HybridApi.request({
                    action: 'handleBookShelf',
                    param: {
                        "id": self.bookList[i]._id,
                        "type":'add'
                    },
                    callback:function(){
                    }
                });
            }
            HybridApi.setUserBehavior(`f021##-1|201905021##${idArr.join(',')}`);
        }
    }
});
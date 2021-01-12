import "../scss/201905006.scss";
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
        endTime:new Date("2019/05/01 23:59:59"),
        platform:tools.getQueryParams('platform'),
        hour: ['0', '0'],
        min: ['0', '0'],
        sec: ['0', '0'],
        showDesc:false,
        bookList:[]
    },
    created: function () {
        fastclick.init();
        HybridApi.init();
    },
    mounted: function () {
        this.umeng('201905006访问')
        this.init();
    },
    methods: {
        init(){
            this.getBookInfo();
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
        getBookInfo(){
            let self = this;
            axios.get(`${url.getBookPriceInfo}5af56b824f008d561837cf58/price-info?platform=${self.platform}`).then((res) => {
                res = res.data;
                if (res && res.ok) {
                    console.log(res)
                    if(res.doc.discount){
                        self.endTime = new Date(res.doc.discount.endTime);
                        self.getCountdown();
                        setInterval(function(){self.getCountdown();},1000)
                    }else{
                        self.getCountdown();
                        setInterval(function(){self.getCountdown();},1000)
                    }
                }
            });
        },
        getCountdown: function () {
            var self = this,
                lastTime = self.endTime.getTime(),
                nowTime = new Date().getTime(),
                difference = (lastTime - nowTime) / 1000,
                hour = Math.floor((difference) / (60 * 60)),
                min = Math.floor((difference - hour * 60 * 60) / (60)),
                sec = Math.floor(difference - hour * 60 * 60 - min * 60);

            if (difference <= 0) {
                return;
            }

            if (hour.toString().length > 1) {
                self.hour = hour.toString();
                self.hour = self.hour.split("");
            } else {
                self.hour = '0' + hour.toString();
                self.hour = self.hour.split("");
            }
            if (min.toString().length > 1) {
                self.min = min.toString();
                self.min = self.min.split("");
            } else {
                self.min = '0' + min.toString();
                self.min = self.min.split("");
            }
            if (sec.toString().length > 1) {
                self.sec = sec.toString();
                self.sec = self.sec.split("");
            } else {
                self.sec = '0' + sec.toString();sec
                self.sec = self.sec.split("");
            }

        },
        getBookList() {
            let self = this;
            axios.get(`${url.getBookListNode}4d9e0825811a4658bf355907a0113c44`).then((res) => {
                res = res.data;
                if (res && res.ok) {
                    console.log(res)
                    self.bookList = res.data.books;
                }
            });
        },
    }
});
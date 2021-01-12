import "../scss/201905016.scss";
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
        bookList:[
            {"_id":'5bc06d0bf7634e0d9cb4b31b',"title":"最佳女婿","cover":'http://statics.zhuishushenqi.com/agent/http://img.1391.com/api/v1/bookcenter/cover/1/3310394/3310394_74873ac41e7d45e9af3003d13f18cadd.jpg/'},
            {"_id":'5c7509db146b2754b4a9b07e',"title":"第一赘婿","cover":'http://statics.zhuishushenqi.com/agent/http://img.1391.com/api/v1/bookcenter/cover/1/3354168/3354168_5f27559ec3dd4c389c74577d080664b8.jpg/'},
            {"_id":'5a97d996c31fd7599e920575',"title":"狂婿","cover":'http://statics.zhuishushenqi.com/agent/http://img.1391.com/api/v1/bookcenter/cover/1/2231356/2231356_37f8c5efb46847fc89dca9e8b20b20c6.jpg/'}
        ],
        joinCount: 0,
        isMonthly: false
    },
    created: function () {
        fastclick.init();
        HybridApi.init();
    },
    mounted: function () {
        this.umeng('201905016访问')
        HybridApi.setUserBehavior(`f02##-1|201905016`);
        this.init();
    },
    methods: {
        init(){},
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
            HybridApi.setUserBehavior(`f021##-1|201905016##${idArr.join(',')}`);
        }
    }
});
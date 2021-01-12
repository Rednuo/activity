import "../scss/202011001.scss";
import "../../../../node_modules/swiper/dist/css/swiper.min.css";
require('es6-promise').polyfill();

import Vue from 'vue'
import axios from 'axios'
import { url } from './config'
import * as tools from './utils'
import fastclick from '../../../Common/js/fastclick'
import HybridApi from '../../../Common/js/bridge'
import Toast from '../../../Common/js/component/toast'
import { initExposure } from "../../../Common/js/exposure";

new Vue({
    el: '#J_pageWraper',
    data: {
        token: tools.getQueryParams('token') || '',
        bookList: [],
    },
    created: function() {
        fastclick.init();
        HybridApi.init();
        initExposure();
    },
    mounted: function() {
        this.getBookList();
        this.umeng('202011001访问');
        HybridApi.setUserBehavior(`f02##-1|202011001`);
        HybridApi.setSensorsUserBehavior({
            "event": "ZSPageShow",
            "page_category1": "活动H5",
            "page_category2": "国庆活动预热",
            "page_category3": "活动开始页面-书城"
        });
    },
    methods: {
        umeng: function(action) {
            _czc.push(["_trackEvent", "爆款书籍", "活动H5", action, 1, "active"]);
        },
        callNative: function(data) {
            var self = this;
            if (data.umeng) {
                self.umeng(data.umeng);
            }
            HybridApi.request({
                action: data.action,
                param: data.params
            });
        },
        jumpToBookDetail: function(item) {
            let self = this;
            self.callNative({
                action: 'jump',
                params: {
                    'jumpType': 'native',
                    'pageType': 'bookDetail',
                    'id': item._id,
                    'code': `B1##-1|${item._id}##${item.title}##-1##-1##20201124$__$爆款书籍##-1##-1##-1`,
                    "sensors": {
                        "event": "BookDetailVisit",
                        "book_id": `${item._id}`,
                        "book_name": `${item.title}`,
                        "is_vip_book": item.allowMonthly,
                        "is_finish_book": item.isSerial,
                        "is_freeread_book": item.allowFree,
                        "exposure_category1": "活动h5",
                        "exposure_category2": "赚钱模式宣传页",
                        "exposure_category3": `${location.origin+location.pathname}`,
                        "exposure_category4": null,
                        "exposure_index": "1",
                        "exposure_ismore": null,
                        "booklist_id": null,
                        "booklist_name": null,
                        "read_operation_source": "书籍曝光"
                    }
                }
            })
        },
        jumpToBookShelf: function(){
            let self = this;
            self.callNative({
                action:"openBookshelf",
                callback: function(){

                }
            })
        },
        getBookList() {
            let self = this;
            axios.get(`${url.getBookListNode}${'ff6c17bf9be743a38317f9d8d4773cc3'}`).then((response) => {
                if (response && response.data && response.data.ok) {
                    self.bookList = response.data.data.books;
                }
            });
        },
    }
});
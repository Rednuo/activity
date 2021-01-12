import "../scss/202002007.scss";
require('es6-promise').polyfill();

import Vue from 'vue'
import axios from 'axios'
import { url } from './config'
import * as tools from './utils'
import fastclick from '../../../Common/js/fastclick'
import HybridApi from '../../../Common/js/bridge'
import { initExposure } from "../../../Common/js/exposure";

new Vue({
    el: '#J_pageWraper',
    data: {
        token: tools.getQueryParams('token') || '',
        bookList: [],
        isFetching: true,
        isLogin: false,
        isMonthly: true
    },
    created: function () {
        fastclick.init();
        HybridApi.init();
        initExposure();
    },
    mounted: function () {
        this.umeng('202002007访问')
        HybridApi.setUserBehavior(`f02##-1|202002007`);
        this.init();
    },
    methods: {
        init() {
            // this.getUserInfo();
        },
        umeng: function (action) {
            _czc.push(["_trackEvent", "爆款书籍", "活动H5", action, 1, "active"]);
        },
        callNative: function (data) {
            var self = this;
            if (data.umeng) {
                self.umeng(umeng);
            }
            HybridApi.request({
                action: data.action,
                param: data.params
            });
        },
        setBI: function (data) {
            HybridApi.setUserBehavior(data);
        },
        clickVideo: function () {
            this.umeng('202002007视频播放');
        },
        clickDownload: function () {
            this.umeng('202002007点击下载');
        },
        getUserInfo() {
            let self = this;
            if (self.token) {
                self.isLogin = true;
                this.getUserAccount();
            } else {
                self.isFetching = false;
            }
        },
        getUserAccount() {
            let self = this;
            axios.get(url.getAccount + self.token).then((res) => {
                self.isFetching = false;
                res = res.data;
                if (res && res.ok) {
                    self.isMonthly = res.isMonthly;
                }
            });
        },
    }
});
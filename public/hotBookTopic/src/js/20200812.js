import "../scss/20200806.scss";
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
import Swiper from 'swiper/dist/js/swiper.js'

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
        this.umeng('20200806访问')
        HybridApi.setUserBehavior(`f02##-1|20200806`);
        this.init();
    },
    methods: {
        init() {
            new Swiper('.swiper-container', {
                loop: true,
                autoplay: true,
                pagination: {
                    el: '.swiper-pagination',
                },
            });
            if (!this.token) return;
            this.fetchBookShelf();
        },
        umeng: function (action) {
            _czc.push(["_trackEvent", "爆款书籍", "活动H5", action, 1, "active"]);
        },
        callNative: function (data) {
            var self = this;
            if (data.umeng) {
                self.umeng(data.umeng);
            }
            HybridApi.request({
                action: data.action,
                param: data.params
            });
        },
        setBI: function (data) {
            HybridApi.setUserBehavior(data);
        },
        fetchBookShelf() {
            let self = this;

            axios.get(url.getBookShelf + '?token=' + self.token).then(function (response) {
                let data = response.data;
                if (data.ok) {
                    let bookshelf = [];
                    bookshelf = data.bookshelf.map((item) => {
                        return item._id
                    })
                    self.bookShelf = bookshelf;
                    console.log(bookshelf);
                }
            })
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
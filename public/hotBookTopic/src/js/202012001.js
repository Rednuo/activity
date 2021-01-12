import "../scss/202012001.scss";
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
// import vConsole from 'vconsole'
// new vConsole()

new Vue({
    el: '#J_pageWraper',
    data: {
        token: tools.getQueryParams('token') || '',
        bookList: [],
        dashenDataConfig: [
            {
                id: '5fc8c09e8d93a20001f726fb',
                title: '这6篇爽文，带你体验人生极致！',
                nickname: ' 白小生',
                avatar: 'https://plf-new.zhuishushenqi.com/management/images/20201016/5245114d68f44e85a427fcc4f5d0feb9.png',
                userId: '5631827dcd9487bb3bc43aaa'
            },
            {
                id: '5fc8c3028d93a20001f726fc',
                title: '【女频现言】悲惨女配和她身边的三个渣男的故事',
                nickname: '小姐姐推书',
                avatar: 'https://plf-new.zhuishushenqi.com/management/images/20201203/e0bc4ee6fa644de89845f69d55283e5b.jpg',
                userId: '59dee1e6551042fa35c9638c'
            },
            {
                id: '5fca40cd8d93a20001f7270a',
                title: '鲜橙大大力作《只为那一刻与你相见》——女主为爱成炮灰女配',
                nickname: '木子妍心',
                avatar: 'https://plf-new.zhuishushenqi.com/management/images/20200901/453890a07f384c4eb5b5996b16b15fa8.png',
                userId: '5c1ef6aeb2e4e91000087081'
            }
        ],
        postId: '5fca00ccf42dda2b2812649a',
        comments: [],
        platform: tools.getQueryParams('platform')
    },
    created: function () {
        fastclick.init();
        HybridApi.init();
        initExposure();
    },
    mounted: function () {
        this.getComments();
        // this.getBookList();
        this.umeng('202012001访问');
        HybridApi.setUserBehavior(`f02##-1|202012001`);
        HybridApi.setSensorsUserBehavior({
            "event": "ZSPageShow",
            "page_category1": "活动h5",
            "page_category2": "只为那一刻与你相见",
            "page_category3": null
        });
    },
    methods: {
        getComments() {
            let self = this;
            axios.get('https://api.zhuishushenqi.com/post/' + this.postId + '/comment').then((res) => {
                self.comments = res.data.comments;
            })
        },
        umeng: function (action) {
            _czc.push(["_trackEvent", "爆款书籍", "活动h5", action, 1, "active"]);
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
        jumpToBookDetail: function (id) {
            let self = this;
            // HybridApi.setSensorsUserBehavior({
            //     "event": "ZSBtnClick",
            //     "btn_click_category1": "活动h5",
            //     "btn_click_category2": "只为那一刻与你相见",
            //     "btn_click_category3": "跳转书籍详情",
            //     "btn_click_category4": null,
            //     "btn_click_category5": null
            // })
            // self.callNative({
            //     action: 'jump',
            //     umeng: '202012001点击阅读',
            //     params: {
            //         'jumpType': 'native', 'pageType': 'bookDetail', 'id': id, 'code': 'B1##-1|53568133e066d5b325003ec7##只为那一刻与你相见##-1##-1##202012001$__$爆款书籍##-1##-1##-1' }
            // })
            self.callNative({
                action: 'jump',
                params: {
                    'jumpType': 'native',
                    'pageType': 'bookDetail',
                    'id': '53568133e066d5b325003ec7',
                    'code': `B1##-1|53568133e066d5b325003ec7##只为那一刻与你相见##-1##-1##202012001$__$爆款书籍##-1##-1##-1`,
                    "sensors": {
                        "event": "BookDetailVisit",
                        "book_id": `53568133e066d5b325003ec7`,
                        "book_name": `只为那一刻与你相见`,
                        "is_vip_book": false,
                        "is_finish_book": true,
                        "is_freeread_book": false,
                        "exposure_category1": "活动h5",
                        "exposure_category2": "“傲娇总裁”邵铭哲太上头",
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
        jumpToBookShelf: function () {
            let self = this;
            HybridApi.setSensorsUserBehavior({
                "event": "ZSBtnClick",
                "btn_click_category1": "活动h5",
                "btn_click_category2": "只为那一刻与你相见",
                "btn_click_category3": "跳转书架",
                "btn_click_category4": null,
                "btn_click_category5": null
            })
            self.callNative({
                action: "openBookshelf",
                callback: function () {

                }
            })
        },
        onDashenClick(index) {
            let self = this;
            let item = self.dashenDataConfig[index];
            HybridApi.setSensorsUserBehavior({
                "event": "ZSBtnClick",
                "btn_click_category1": "活动h5",
                "btn_click_category2": "只为那一刻与你相见",
                "btn_click_category3": "跳转大神帖子",
                "btn_click_category4": null,
                "btn_click_category5": null,
                'dashen_id':item.userId,
                'post_id':item.id,
                'dashen_post_type':'图文'
            })
            self.jump({
                "jumpType": "webview",
                "link": `${location.origin}/public/dashen/detail.html?topicId=${item.id}&exposure_index=${index + 1}&dashen_content_source1=只为那一刻与你相见&dashen_content_source2=`,
                "title": item.nickname,
                "pageType": 'topicDetail',
                "icon": item.avatar,
                "topicId": item.id,
                "userId": item.userId
            })
        },
        redirectToPost(postId) {
            let self = this;
            self.umeng("点击帖子");
            HybridApi.setSensorsUserBehavior({
                "event": "ZSBtnClick",
                "btn_click_category1": "活动h5",
                "btn_click_category2": "只为那一刻与你相见",
                "btn_click_category3": "跳转帖子",
                "btn_click_category4": null,
                "btn_click_category5": null,
                'post_id':postId,
            })
            self.callNative({
                action: 'jump',
                params: { "jumpType": "native", "pageType": "post", "id": postId }
            })
        },
        redirectToBookShortage(postId) {
            let self = this;
            self.umeng("点击书荒");
            HybridApi.setSensorsUserBehavior({
                "event": "ZSBtnClick",
                "btn_click_category1": "活动h5",
                "btn_click_category2": "只为那一刻与你相见",
                "btn_click_category3": "跳转书荒帖子",
                "btn_click_category4": null,
                "btn_click_category5": null
            })
            self.callNative({
                action: 'jump',
                params: { "jumpType": "native", "pageType": "bookShortage", "id": postId }
            })
        },
        jump: function (params) {
            if (this.platform) {
                HybridApi.request({
                    action: 'jump',
                    param: params
                });
            } else {
                location.href = params.link;
            }
        },
    }
});
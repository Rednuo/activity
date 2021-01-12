import "../css/index.scss";

import Vue from 'vue'
import axios from 'axios'
import * as tools from './utils'
import { url } from './config'
import fastclick from '../../../../Common/js/fastclick'
import HybridApi from '../../../../Common/js/bridge'
import Umeng from '../../../../Common/js/Umeng'
import { initExposure } from '../../../../Common/js/exposure' //曝光埋点

const umeng = new Umeng('1261312741',function(){
    this.push(['会员免费读', '访问']);
});

new Vue({
    el: '#J_pageDiscountWraper',
    data: {
        posCode: tools.getQueryParams('posCode') || '-1',
        platform: tools.getQueryParams('platform') || 'android',
        token: tools.getQueryParams('token') || '',
        BIrules: '推书活动$_$-1$_$-1$_$-1',
        books: [],
        isMonthly: false,
        showRulesDialog: false
    },
    mounted: function () {
        let self = this;
        this.init();
    },
    methods: {
        init() {
            HybridApi.init();
            fastclick.init();
            this.getBooks();
            this.getUserAccount();
        },
        jump(params){
            HybridApi.request({
                action: 'jump',
                param: params
            });
        },
        getBooks(){
            let self = this;
            axios.get(url.getBooks+'2e03043892c347f4af5ae862138064d0').then(response=>{
                if(response.data.ok){
                    let data = response.data.data;
                    self.books = data.books;
                }
            })
            
        },
        getUserAccount() {
            let self = this;
            if(!self.token) return;
            axios.get(url.getAccount+self.token).then((res) => {
                res = res.data;
                if (res && res.ok) {
                    self.isMonthly = res.isMonthly;
                }
            });
        },
        jumpBookDetail(book,index){
            let self = this;
            HybridApi.request({
                action: 'jump',
                param: {
                    "jumpType": "native",
                    "pageType": "bookDetail",
                    "id": book._id,
                    "code":"-1##"+self.posCode+"|"+book._id+"##"+book.title+"##-1##-1##"+self.BIrules+"##-1##"+(index+1)+"##-1"
                }
            });
        },
        jumpToVip(){
            this.jump({
                jumpType:'native',
                pageType:'monthlyPay'
            })
        },
        // 会员专题
        goVIP() {
            HybridApi.request({
                action: 'jump',
                param: {
                    'link': 'https://h5.zhuishushenqi.com/v2/vip4.html?&posCode=' + this.posCode,
                    'pageType': 'VIP',
                    'jumpType': 'webview',
                    'title': 'VIP'
                }
            });
        },
        jumpToFaq(){
            let node = this.packageName == 'com.ushaqi.zhuishushenqi' ? 'dcdf58af0c034152bf2fed2667a0e92c' : '4c2cd425952b4fa8941e671dfd5d2e63';
            this.jump({
                jumpType:'webview',
                title:'帮助与反馈',
                pageType:'faq',
                link:'https://h5.zhuishushenqi.com/public/faq/index.html?platform=android&plversion=4.3&node='+node
            })
        },
    }
})
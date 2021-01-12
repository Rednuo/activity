import "../scss/202002001.scss";

import Vue from 'vue'
import * as tools from './utils'
import fastclick from '../../../Common/js/fastclick'

new Vue({
    el: '#J_pageWraper',
    data: {
        platform: tools.getQueryParams('platform') || ''
    },
    created: function () {

    },
    mounted: function () {
        this.umeng('202002001访问')
        this.init();
    },
    methods: {
        init(){

        },
        umeng: function(action){
            _czc.push(["_trackEvent", "爆款书籍", "活动H5", action, 1, "active"]);
        },
        redirectToBookDetail( id ){
            this.umeng('202002001-'+id)
            if (this.platform === 'quickApp') {
                system.go(`/Detail?bookId=${id}`)
            } else {
                tt.miniProgram.navigateTo({
                    url: `/pages/bookDetail/index?id=${id}`
                });
            }
        }
    }
});
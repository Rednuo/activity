import "../scss/202002003.scss";

import Vue from 'vue'
import fastclick from '../../../Common/js/fastclick'
import HybridApi from '../../../Common/js/bridge'

new Vue({
    el: '#J_pageWraper',
    data: {
       
    },
    created: function () {

    },
    mounted: function () {
        this.umeng('202002003访问')
        this.init();
    },
    methods: {
        init(){
            HybridApi.init();
        },
        umeng: function(action){
            _czc.push(["_trackEvent", "爆款书籍", "活动H5", action, 1, "active"]);
        },
        redirectToBookDetail( id ){
            this.umeng('202002003-'+id)
            HybridApi.request({
                action: 'jump',
                param:{
                    'jumpType':'native',
                    'pageType':'bookDetail',
                    'id':id,
                    'code':'-1##-1'
                }
            })
        }
    }
});
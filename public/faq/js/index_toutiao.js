//106.75.55.60
//106.75.52.167
//api.zhuishushenqi.com

var baseUrl = location.protocol.split(':')[0]+'://' + 'b.zhuishushenqi.com';

var config = {
    //常见问题
    oftenProblems:baseUrl+'/help/often_problems',
    categoryProblems:baseUrl+'/help/category_list'
}

var getQueryParams = function(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}


var getWindowInnerWidth = function(){
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
};

Vue.use(VueResource);

new Vue({
    el: '#root',
    data: {
       origin: location.origin+'/public/faq',
       isNative: getQueryParams('platform'),
       plVersion: getQueryParams('plversion'),
       token: getQueryParams('token'),
       appNode: '1e634a522a84435b9db796423cdf59d9',
       templateId: getQueryParams('templateId'),
       userId: getQueryParams('userId') || getQueryParams('userid') || '',
       isFetching: true,
       oftenList:[],
       categoryList:[],
       kfUrl:'',
       showKf: false,
       product_line: getQueryParams('product_line') || '1'
    },
    created: function() {
        var self = this;
        self.getOftenProblems();
        self.getCategoryListProblems();
        sensors.registerPage({
            product_line: self.product_line
        });
        sensors.track('ZSPageShow', {
            page_category1: "h5",
            page_category2: "意见反馈",
        })
    },
    mounted: function() {
        var self = this;
        // self.kfUrl = ysf.url().replace(/\&t=.*/g,"")+(self.templateId ? '&templateId='+self.templateId:'');
        // self.configInfo();
        // if(__YSFOPTION__ && __YSFOPTION__.hidden==0){
        //     self.showKf = true;
        // }
        _czc.push(["_trackEvent", "FAQ", "首页", "访问", 1, "active"]);
    },
    methods: {
        jump: function(params,type,title){
            var self = this;
            _czc.push(["_trackEvent", "FAQ", type, title, 1, "active"]);
            location.href = params.link
        },
    	getOftenProblems: function(){
            var self = this;
    		self.$http.get(config.oftenProblems + "?pl=" +self.isNative+(self.plVersion ? '&version='+self.plVersion : '')+'&node='+self.appNode).then(function(data){
                self.isFetching = false;
                var res = data.data;
                self.oftenList = res.data.list;
        	})
        },
    	getCategoryListProblems: function(){
            var self = this;
    		self.$http.get(config.categoryProblems + "?pl=" +self.isNative+(self.plVersion ? '&version='+self.plVersion : '')+'&node='+self.appNode).then(function(data){
                self.isFetching = false;
                var res = data.data;
                self.categoryList = res.data.list;
        	})
        },
        configInfo: function(){
            var self = this;
            var configParams = {
                userId: getQueryParams('userId'),
                isVip: getQueryParams('vip'),
                channel: getQueryParams('channel'),
                deviceModel: getQueryParams('deviceModel'),
                systemVersion: getQueryParams('systemVersion')
            }
            if(configParams.userId == 'null'){
                configParams.userId = 'zssq'+ (new Date().getTime()+'').slice(1);
            }
            ysf.config({
                uid: configParams.userId,
                data:JSON.stringify([
                    {"index":0, "key":"userId", "label":"用户ID", "value":configParams.userId},
                    {"index":1, "key":"vip", "label":"VIP用户", "value":configParams.isVip=='true'?'是':'否'},
                    {"index":2, "key":"userFrom","label":"用户来源","value":"头条小程序"},
                    {"index":3, "key":"channel", "label":"channel", "value":configParams.channel},
                    {"index":4, "key":"deviceModel", "label":"手机型号", "value":configParams.deviceModel},
                    {"index":5, "key":"systemVersion","label":"系统版本","value":configParams.systemVersion}
                ]),
                success: function(){     // 成功回调
                    self.kfUrl = ysf.url().replace(/\&t=.*/g,"")+(self.templateId ? '&templateId='+self.templateId:'');
                },
                error: function(){       // 错误回调
                    // handle error
                    self.kfUrl = ysf.url().replace(/\&t=.*/g,"")+(self.templateId ? '&templateId='+self.templateId:'');
                }
            });
        },
        clickKF() {
            sensors.track('ZSBtnClick', {
                btn_click_category1: "活动h5",
                btn_click_category2: "意见反馈",
                btn_click_category3: "在线客服",
                btn_click_category4: null,
                btn_click_category5: null
            })
            // var path = 'http://h5.zhuishushenqi.com/public/privateDomain/leadCode.html' + location.search
            var path = 'http://h5.zhuishushenqi.com/public/privateDomain/leadCodeForFAQ_sapp.html' + '?userid=' + this.userId + '&fromPage=41'
            location.href = path;
        },
    },
    watch: {
        
    }
});
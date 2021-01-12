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
       /*
            主版本dcdf58af0c034152bf2fed2667a0e92c
            免费版4c2cd425952b4fa8941e671dfd5d2e63
            锦绣书苑ccdf8ab6a39a40318bee8117b9e8d99a
            畅读版593e2079c4234a948bd313ed5aaa4d98
            十元读书7bb08ca69fc44a67ba90c73be0f2b325
             免费简版f644c8bb8cb44a7ab25ccc2bf7e71312
            饭团 d51b5021d9a0473f9dea2365378dd942
             海外版283fc3c65a9542d794c6b91bb9f357de
       */
       appNode: getQueryParams('node') || 'dcdf58af0c034152bf2fed2667a0e92c',
       templateId: getQueryParams('templateId'),
       isFetching: true,
       oftenList:[],
       categoryList:[],
       kfUrl:'',
       showKf: false
    },
    created: function() {
        var self = this;
        HybridApi.init();
        self.setUserConversation();
        self.getOftenProblems();
        self.getCategoryListProblems();
    },
    mounted: function() {
        var self = this;
        self.kfUrl = ysf.url().replace(/\&t=.*/g,"")+(self.templateId ? '&templateId='+self.templateId:'');
        HybridApi.getDeviceInfo(function(deviceInfo){
            if(self.token){
                HybridApi.getUserInfo(function(userInfo){
                    //兼容Android
                    if(userInfo.isMonthOpen=='false'){
                        userInfo.isMonthOpen=false;
                    }
                    if(userInfo.isMonthly=='false'){
                        userInfo.isMonthly=false;
                    }
                    userInfo.isMonthly = userInfo.isMonthOpen || userInfo.isMonthly;
                    self.configInfo(deviceInfo,userInfo);
                })
            }else{
                self.configInfo(deviceInfo,{isMonthly:'unknow'});
            }

        })
        if(__YSFOPTION__ && __YSFOPTION__.hidden==0){
            self.showKf = true;
        }

        _czc.push(["_trackEvent", "FAQ", "首页", "访问", 1, "active"]);
    },
    methods: {
        jump: function(params,type,title){
            var self = this;
            _czc.push(["_trackEvent", "FAQ", type, title, 1, "active"]);
    		if (this.isNative) {
                HybridApi.request({
                    action: 'jump',
                    param: params
                });
            } else {
                if (params.link) {
                    location.href = params.link
                }
            }
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
        setUserConversation: function(){
            var kfChannel = localStorage.getItem('faqConversation');
            if(this.appNode=='dcdf58af0c034152bf2fed2667a0e92c' && !kfChannel){ //主版本
                localStorage.setItem('faqConversation',Math.random()>0.8?'wulai':'qiyu');
            }else if(this.appNode=='4c2cd425952b4fa8941e671dfd5d2e63' && !kfChannel){ //免费版
                localStorage.setItem('faqConversation',Math.random()>0.8?'wulai':'qiyu');
            }else if(this.appNode=='3aee973f8b7b4a359bbaa9f5f8018c71' && !kfChannel){ //免费版
                localStorage.setItem('faqConversation',Math.random()>0.8?'wulai':'qiyu');
            }else if(this.appNode=='593e2079c4234a948bd313ed5aaa4d98' && !kfChannel){ //畅读版
                localStorage.setItem('faqConversation',Math.random()>0.8?'wulai':'qiyu');
            }
        },
        configInfo: function(deviceInfo,userInfo){
            var self = this;
            var projectIds = {
                "dcdf58af0c034152bf2fed2667a0e92c":" 神器主版本",
                "4c2cd425952b4fa8941e671dfd5d2e63":" 神器免费版",
                "3aee973f8b7b4a359bbaa9f5f8018c71":" 神器免费版", //com.ushaqi.zhuishushenqi.newadfree2
                "ccdf8ab6a39a40318bee8117b9e8d99a":"锦绣书苑",
                "593e2079c4234a948bd313ed5aaa4d98":" 神器畅读版",
                "7bb08ca69fc44a67ba90c73be0f2b325":"十元读书",
                "f644c8bb8cb44a7ab25ccc2bf7e71312":" 免费简版",
                "d51b5021d9a0473f9dea2365378dd942":"饭团 ",
                "283fc3c65a9542d794c6b91bb9f357de":" 神器海外版",
                "7063e44461024c9c82510be7da6e1f0c":"iOS畅读版"
            }
            if(deviceInfo.userId == 'null'){
                deviceInfo.userId = 'zssq'+ (new Date().getTime()+'').slice(1);
            }
            if(localStorage.getItem('faqConversation')=='wulai'){
                var json = {
                    'nickname': userInfo.nick,
                    'userId': deviceInfo.userId,
                    'avatar': userInfo.avatar,
                    '105574': deviceInfo.userId,
                    '101723': userInfo.isMonthly=='unknow'?'普通':(userInfo.isMonthly?'VIP':'普通'),
                    '104838': projectIds[self.appNode],
                    '104839': deviceInfo.version,
                    '104840': deviceInfo.versionCode,
                    '104841': deviceInfo.channel,
                    '104842': deviceInfo.deviceModel,
                    '104843': deviceInfo.systemVersion
                }
                var params = Object.keys(json).map(function (key) {
                    return encodeURIComponent(key) + "=" + encodeURIComponent(json[key]);
                }).join("&");
                self.kfUrl = location.origin + '/public/faq/wulai.html?' + params;
            }else{
                ysf.config({
                    uid: deviceInfo.userId,
                    data:JSON.stringify([
                        {"index":0, "key":"userId", "label":"用户ID", "value":deviceInfo.userId},
                        {"index":1, "key":"vip", "label":"VIP用户", "value":userInfo.isMonthly=='unknow'?'未知':(userInfo.isMonthly?'是':'否')},
                        {"index":2, "key":"userFrom","label":"用户来源","value":projectIds[self.appNode]},
                        {"index":3, "key":"version", "label":"app版本", "value":deviceInfo.version},
                        {"index":4, "key":"versionCode","label":"verCode","value":deviceInfo.versionCode},
                        {"index":5, "key":"channel", "label":"channel", "value":deviceInfo.channel},
                        {"index":6, "key":"deviceModel", "label":"手机型号", "value":deviceInfo.deviceModel},
                        {"index":7, "key":"systemVersion","label":"系统版本","value":deviceInfo.systemVersion},
                        {"index":8, "key":"avatar","label":"头像","value":"https://statics.zhuishushenqi.com"+userInfo.avatar}
                    ]),
                    success: function(){     // 成功回调
                        self.kfUrl = ysf.url().replace(/\&t=.*/g,"")+(self.templateId ? '&templateId='+self.templateId:'');
                    },
                    error: function(){       // 错误回调
                        // handle error
                        self.kfUrl = ysf.url().replace(/\&t=.*/g,"")+(self.templateId ? '&templateId='+self.templateId:'');
                    }
                });
            }

        }
    },
    watch: {

    }
});
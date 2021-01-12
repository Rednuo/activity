//106.75.55.60
//106.75.52.167
//api.zhuishushenqi.com

var baseUrl = location.protocol.split(':')[0]+'://' + 'b.zhuishushenqi.com';

var config = {
    //问题列表
    helpList:baseUrl+'/help/help_list'
}

var getQueryParams = function(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

Vue.use(VueResource);

new Vue({
    el: '#root',
    data: {
       origin: location.origin+'/public/faq',
       isNative: getQueryParams('platform'),
       plVersion: getQueryParams('plversion'),
       appNode: getQueryParams('node') || 'dcdf58af0c034152bf2fed2667a0e92c',
       cid: getQueryParams('cid'),
       isFetching: true,
       helpList:[],
       kfUrl:'',
       showKf: false
    },
    created: function() {
        var self = this;
        HybridApi.init();
        self.getOftenProblems(0);
    },
    mounted: function() {
        var self = this;
        _czc.push(["_trackEvent", "FAQ", "列表页", "访问", 1, "active"]);
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
    	getOftenProblems: function(pageIndex){
            var self = this;
    		self.$http.get(config.helpList + "?pl=" +self.isNative+"&cid="+self.cid+"&page="+pageIndex+"&size=20"+(self.plVersion ? '&version='+self.plVersion : '')).then(function(data){
                self.isFetching = false;
                var res = data.data;
                self.helpList = res.data.list;
        	})
        },
        configInfo: function(deviceInfo,userInfo){
            var self = this;
            var projectIds = {
                "dcdf58af0c034152bf2fed2667a0e92c":" 神器主版本",
                "4c2cd425952b4fa8941e671dfd5d2e63":" 神器免费版",
                "ccdf8ab6a39a40318bee8117b9e8d99a":"锦绣书苑",
                "593e2079c4234a948bd313ed5aaa4d98":" 神器畅读版",
                "7bb08ca69fc44a67ba90c73be0f2b325":"十元读书",
                "f644c8bb8cb44a7ab25ccc2bf7e71312":" 免费简版",
                "d51b5021d9a0473f9dea2365378dd942":"饭团 "
            }
            if(deviceInfo.userId == 'null'){
                deviceInfo.userId = 'zssq'+ (new Date().getTime()+'').slice(1);
            }
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
    },
    watch: {

    }
});
//106.75.55.60
//106.75.52.167
//api.zhuishushenqi.com

var baseUrl = location.protocol.split(':')[0]+'://' + 'api.zhuishushenqi.com';

var config = {
    //未登录信息
    noLoginInfo:baseUrl+'/activity/doubleNewYear/no/Token',
    //进入活动
    activityStatus:baseUrl+'/activity/doubleNewYear',
    //参加活动
    enterActivity:baseUrl+'/activity/enter/doubleNewYear'
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
    el: '#J_pageIndexWraper',
    data: {
       cdn: 'https://statics.zhuishushenqi.com',
       origin: location.origin+'/public',
       isFetching: true,
       isNative: getQueryParams('platform'),
       token:getQueryParams('token'),
       showRules: false,
       data:{
            totalVouchers:100000000,
            averageNum:0
       },
       userData:{},
       loopList:[],
       modalMsg: ''
    },
    http: {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    created: function() {
        var self = this;
        HybridApi.init();
        if(!self.token){
            self.getNoLoginPageInfo();
        }else{
            self.getActivityStatus();
        }
        self.getLoopList();
    },
    mounted: function() {
        _czc.push(["_trackEvent", " 双旦活动", "报名页", "访问", 1, "active"]);
    },
    methods: {
    	jump: function(params){
    		var self = this;
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
        getLoopList: function(){
            var startIndex = parseInt(Math.random()*900);
            var list = userList.slice(startIndex,startIndex+100).sort(function(){return Math.random()-Math.random()});
            this.loopList = list.slice(0,20);
        },
        activityTime: function(today,readey){
            var self = this;
            if(today<20181225){
                self.isFetching = false;
                return false;
            }else if(today>=20181225 && today<20190101){
                if(!readey){
                    self.isFetching = false;
                    return false;
                }
                window.location.href = self.origin+'/activities/doubleDan/start.html'+location.search+ (getQueryParams('token') ? '': '&token='+self.token);
            }else{
                window.location.href = self.origin+'/activities/doubleDan/giveOut.html'+location.search+(getQueryParams('token') ? '': '&token='+self.token);
            }
        },
        getNoLoginPageInfo: function(){
            var self = this;
            self.$http({
                method: 'POST',
                url: config.noLoginInfo
            }).then(function(data){
                var res = data.data;
                self.isFetching = false;
                if(res.ok){
                    self.data = res.msg;
        		}else{
        			self.showModal('网络错误');
        		}

        	})
        },
        getActivityStatus: function(){
            var self = this;
            self.$http({
                method: 'POST',
                url: config.activityStatus,
                body: 'token='+self.token
            }).then(function(data){
                var res = data.data;
        		if(res.ok){
                    self.activityTime(res.msg.nowTime,res.msg.data.active);
                    // self.activityTime(getQueryParams('date'),res.msg.data.active);
                    self.data = res.msg;
                    self.userData = res.msg.data;
        		}else{
                    self.isFetching = false;
        			self.showModal('网络错误');
        		}
        	})
        },
        postActivity: function(){
            var self = this;
            if(!self.token){
                self.login();
                return;
            }
            if(self.userData.active) return;
            _czc.push(["_trackEvent", " 双旦活动", "报名页", "参与活动", 1, "active"]);
            self.$http({
                method: 'POST',
                url: config.enterActivity,
                body: 'token='+self.token
            }).then(function(data){
                var res = data.data;
        		if(res.ok){
                    self.activityTime(res.msg.nowTime,res.msg.data.active);
                // self.activityTime(getQueryParams('date'),res.msg.data.active);
                    self.data = res.msg;
                    self.userData = res.msg.data;
        		}else{
        			self.showModal('网络错误');
        		}
        	})
        },
        login: function(){
            var self = this;
            HybridApi.getUserInfo(function(data){
                self.token = data.token;
                self.getActivityStatus();
            })
        },
        showModal:function(msg){
            var self = this;
            self.modalMsg = msg;
            setTimeout(function(){
                self.modalMsg = '';
            },2000);
        }
    }
});
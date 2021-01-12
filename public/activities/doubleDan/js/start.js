//106.75.55.60
//106.75.52.167
//api.zhuishushenqi.com

var baseUrl = location.protocol.split(':')[0]+'://' + 'api.zhuishushenqi.com';

var config = {
    //进入活动
    activityStatus:baseUrl+'/activity/doubleNewYear',
    //参加活动
    enterActivity:baseUrl+'/activity/enter/doubleNewYear',
    //推荐书籍
    books: location.protocol.split(':')[0]+'://api.zhuishushenqi.com/user/personal-recommendation'
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
    el: '#J_pageStartWraper',
    data: {
       cdn: 'https://statics.zhuishushenqi.com',
       origin: location.origin+'/public',
       isNative: getQueryParams('platform'),
       posCode: getQueryParams('posCode'),
       token:getQueryParams('token'),
       showRules: false,
       data:{
            totalVouchers:100000000,
            averageNum:0
       },
       userData:{},
       todayReadDone: false,
       books:null,
       modalMsg: '',

    },
    http: {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    },
    created: function() {
        HybridApi.init();
        tools.initExposure({container:window});
        this.getActivityStatus();
        this.getRecommendBooks();
    },
    mounted: function() {
        _czc.push(["_trackEvent", " 双旦活动", "开始页", "访问", 1, "active"]);
    },
    methods: {
    	jump: function(params,index){
            var self = this;
            _czc.push(['_trackEvent', ' 双旦活动', '开始页', '书籍'+index, 1, 'active']);
            HybridApi.request({
                action: 'jump',
                param: params
            });
        },
        getRecommendBooks: function(){
            var self = this;
            self.$http.get(config.books + "?token=" + self.token).then(function(data){
    			var res = data.data;
        		if(res.ok){
                    self.books = res.booklist.slice(0,6);
                    console.log(res);
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
                console.log(res);
        		if(res.ok){
                    self.data = res.msg;
                    self.userData = res.msg.data;
                    self.todayReadDone = res.msg.data.reachTotal.indexOf(''+res.msg.nowTime)>-1;
                    console.log(self.todayReadDone)
        		}else{
        			self.showModal('网络错误');
        		}
        	})
        },
        postActivity: function(){
            var self = this;
            if(self.userData.active) return;
            self.$http({
                method: 'POST',
                url: config.enterActivity,
                body: 'token='+self.token
            }).then(function(data){
                var res = data.data;
                console.log(res);
        		if(res.ok){
                    self.data = res.msg;
                    self.userData = res.msg.data;
        		}else{
        			self.showModal('网络错误');
        		}
        	})
        },
        jumpToBookShelf: function(){
            _czc.push(['_trackEvent', ' 双旦活动', '开始页', '去阅读', 1, 'active']);
            HybridApi.pop();
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
//106.75.55.60
//106.75.52.167
//api.zhuishushenqi.com

var baseUrl = location.protocol.split(':')[0]+'://' + 'b.zhuishushenqi.com';

var config = {
    //问题列表
    helpList:baseUrl+'/help/help_detail'
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
       helpid: getQueryParams('helpid'),
       isFetching: true,
       info: null
    },
    created: function() {
        var self = this;
        HybridApi.init();
        self.getOftenProblems(0);
    },
    mounted: function() {
        _czc.push(["_trackEvent", "FAQ", "详情页", "访问", 1, "active"]);
    },
    methods: {
    	getOftenProblems: function(pageIndex){
            var self = this;
    		self.$http.get(config.helpList + "?helpid=" +self.helpid).then(function(data){
                self.isFetching = false;
                var res = data.data;
                self.info = res.data.info;
                document.getElementById("content").innerHTML = self.info.content;
        	})
        }
    },
    watch: {
        
    }
});
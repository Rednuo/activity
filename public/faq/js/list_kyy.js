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
       cid: getQueryParams('cid'),
       isFetching: true,
       helpList:[]
    },
    created: function() {
        var self = this;
        HybridApi.init();
        self.getOftenProblems(0);
    },
    mounted: function() {
        _czc.push(["_trackEvent", "FAQ", "列表页", "访问", 1, "active"]);
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
    		self.$http.get(config.helpList + "?pl=android&cid="+self.cid+"&page="+pageIndex+"&size=20"+(self.plVersion ? '&version='+self.plVersion : '')).then(function(data){
                self.isFetching = false;
                var res = data.data;
                self.helpList = res.data.list;
        	})
        }
    },
    watch: {
        
    }
});
//106.75.55.60
//106.75.52.167
//api.zhuishushenqi.com

var baseUrl = location.protocol.split(':')[0] + '://' + 'api.zhuishushenqi.com';

var config = {
    //进入活动
    activityStatus: baseUrl + '/activity/doubleNewYear',
    //参加活动
    enterActivity: baseUrl + '/activity/enter/doubleNewYear',
    //活动奖励
    activityAward: baseUrl + '/activity/doubleNewYear/average',
}

var getQueryParams = function (name, url) {
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
        origin: location.origin + '/public',
        isNative: getQueryParams('platform'),
        token: getQueryParams('token'),
        data: {
            active: false,
            caclAverageNum: 0,
            status: false
        },
    },
    http: {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    },
    created: function () {
        var self = this;
        HybridApi.init();
        self.getActivityAward();
    },
    mounted: function () {
        _czc.push(["_trackEvent", " 双旦活动", "结束页", "访问", 1, "active"]);
    },
    methods: {
        openAccount: function () {
            _czc.push(["_trackEvent", " 双旦活动", "结束页", "查看账户点击", 1, "active"]);
            HybridApi.request({
                action: 'jump',
                param: {
                    "jumpType": "native",
                    "pageType": "account"
                }
            });
        },
        getActivityAward: function () {
            var self = this;
            self.$http.get(config.activityAward + "?token=" + self.token).then(function (data) {
                var res = data.data;
                console.log(res)
                if (res.ok) {
                    self.data = res.data;
                } else {
                    self.showModal('网络错误');
                }
            })
        },
        openPostDetail: function () {
                _czc.push(["_trackEvent", " 双旦活动", "结束页", "社区点击", 1, "active"]);
                HybridApi.request({
                    action: 'jump',
                    param: {
                        'jumpType': 'native',
                        'pageType': 'post',
                        'id': '5c2435bfbce1b6c05f53c191'
                    }
                });
            },
        openBookListDetail: function () {
            _czc.push(["_trackEvent", " 双旦活动", "结束页", "书单点击", 1, "active"]);
            HybridApi.request({
                action: 'jump',
                param: {
                    'link': 'https://h5.zhuishushenqi.com/v2/bookListDetail.html?id=5c1b57f1830dee000162b2b1',
                    'jumpType': 'webview',
                    'title': '新年书单 走心走肾',
                    'pageType': 'bookListDetail'
                }
            });
        },
        showModal: function (msg) {
            var self = this;
            self.modalMsg = msg;
            setTimeout(function () {
                self.modalMsg = '';
            }, 2000);
        }
    }
});
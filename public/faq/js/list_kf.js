//106.75.55.60
//106.75.52.167
//api.zhuishushenqi.com

var baseUrl = location.protocol.split(':')[0] + '://' + 'b.zhuishushenqi.com';

var config = {
    //问题列表
    helpList: baseUrl + '/help/help_list',
    // 上传用户数据
    generateArticleUrl: 'https://marketnew.zhuishushenqi.com/market/siyu/article-url'
}

var appEntranceData = {
    // 安卓免费版
    'com.ushaqi.zhuishushenqi.newadfree2': {
        'personal': 28,
        'reader': 222,
        'bookshelf': 223,
    },
    // 安卓主版本
    'com.ushaqi.zhuishushenqi': {
        'personal': 118,
        'reader': 129,
        'bookshelf': 130,
    },
    // IOS主版本
    'com.ifmoc.ZhuiShuShenQi': {
        'personal': 323,
        'reader': 333,
    },
    // 饭团
    'com.ifmoc.DouKouYueDu2': {
        'personal': 73,
        'reader': 73
    },
    'com.ifmoc.DouKouYueDu': {
        'personal': 73,
        'reader': 73
    },
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
    el: '#root',
    data: {
        origin: location.origin + '/public/faq',
        isNative: getQueryParams('platform'),
        packageName: getQueryParams('packageName') || 'com.ushaqi.zhuishushenqi',
        platform: getQueryParams('platform') || 'android',
        plVersion: getQueryParams('plversion'),
        token: getQueryParams('token'),
        appNode: getQueryParams('node') || 'dcdf58af0c034152bf2fed2667a0e92c',
        cid: getQueryParams('cid'),
        isFetching: true,
        helpList: [],
        kfUrl: '',
        //    showKf: false,
        currentVersion: [0, 0],
        deviceInfo: {},
        limitVersion: {
            // 安卓免费版
            'com.ushaqi.zhuishushenqi.newadfree2': [3, 13, 6],
            // 安卓主版本
            'com.ushaqi.zhuishushenqi': [4, 63, 0],
            // IOS主版本
            'com.ifmoc.ZhuiShuShenQi': [4, 26, 1],
            // 饭团
            'com.ifmoc.DouKouYueDu2': [1, 17, 0],
            'com.ifmoc.DouKouYueDu': [1, 17, 0],
        },
        appEntrance: getQueryParams('appEntrance') || 'personal',
        userid: null,
        containsPackageName: ['com.ifmoc.ZhuiShuShenQi', 'com.ushaqi.zhuishushenqi']
        // getQueryParams('userid') || getQueryParams('userId') || '',
    },
    created: function () {
        var self = this;
        if (self.containsPackageName.indexOf(self.packageName) == -1) {
            location.replace(location.href.replace('list_kf.html', 'list_kf_old.html'));
        }
        HybridApi.init();
        self.getOftenProblems(0);
    },
    computed: {
        // 判断是否可跳转小程序
        canRouteToSApp() {
            var self = this
            return !(self.currentVersion[0] < self.limitVersion[self.packageName][0] || (self.currentVersion[0] == self.limitVersion[self.packageName][0] && self.currentVersion[1] < self.limitVersion[self.packageName][1]) || (self.currentVersion[0] == self.limitVersion[self.packageName][0] && self.currentVersion[1] == self.limitVersion[self.packageName][1] && self.currentVersion[2] < self.limitVersion[self.packageName][2]))
        }
    },
    mounted: function () {
        var self = this;
        _czc.push(["_trackEvent", "FAQ", "列表页", "访问", 1, "active"]);
        // self.kfUrl = ysf.url().replace(/\&t=.*/g,"")+(self.templateId ? '&templateId='+self.templateId:'');
        HybridApi.getDeviceInfo(function (deviceInfo) {
            if (self.token) {
                HybridApi.getUserInfo(function (userInfo) {
                    //兼容Android
                    if (userInfo.isMonthOpen == 'false') {
                        userInfo.isMonthOpen = false;
                    }
                    if (userInfo.isMonthly == 'false') {
                        userInfo.isMonthly = false;
                    }
                    if (deviceInfo.userId && deviceInfo.userId != 'null') {
                        self.userid = deviceInfo.userId
                    }
                    userInfo.isMonthly = userInfo.isMonthOpen || userInfo.isMonthly;
                    self.generateArticleUrl(deviceInfo, userInfo);
                })
            } else {
                self.generateArticleUrl(deviceInfo, { isMonthly: 'unknow' });
            }

        })

        self.deviceInfo = data;
        self.currentVersion = data.version.split('.');
        // if(__YSFOPTION__ && __YSFOPTION__.hidden==0){
        //     self.showKf = true;
        // }
    },
    methods: {
        jump: function (params, type, title) {
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
        getOftenProblems: function (pageIndex) {
            var self = this;
            self.$http.get(config.helpList + "?pl=" + self.isNative + "&cid=" + self.cid + "&page=" + pageIndex + "&size=20" + (self.plVersion ? '&version=' + self.plVersion : '')).then(function (data) {
                self.isFetching = false;
                var res = data.data;
                self.helpList = res.data.list;
            })
        },
        configInfo: function (deviceInfo, userInfo) {
            var self = this;
            var projectIds = {
                "dcdf58af0c034152bf2fed2667a0e92c": " 神器主版本",
                "4c2cd425952b4fa8941e671dfd5d2e63": " 神器免费版",
                "ccdf8ab6a39a40318bee8117b9e8d99a": "锦绣书苑",
                "593e2079c4234a948bd313ed5aaa4d98": " 神器畅读版",
                "7bb08ca69fc44a67ba90c73be0f2b325": "十元读书",
                "f644c8bb8cb44a7ab25ccc2bf7e71312": " 免费简版",
                "d51b5021d9a0473f9dea2365378dd942": "饭团 "
            }
            if (deviceInfo.userId == 'null') {
                deviceInfo.userId = 'zssq' + (new Date().getTime() + '').slice(1);
            }
            ysf.config({
                uid: deviceInfo.userId,
                data: JSON.stringify([
                    { "index": 0, "key": "userId", "label": "用户ID", "value": deviceInfo.userId },
                    { "index": 1, "key": "vip", "label": "VIP用户", "value": userInfo.isMonthly == 'unknow' ? '未知' : (userInfo.isMonthly ? '是' : '否') },
                    { "index": 2, "key": "userFrom", "label": "用户来源", "value": projectIds[self.appNode] },
                    { "index": 3, "key": "version", "label": "app版本", "value": deviceInfo.version },
                    { "index": 4, "key": "versionCode", "label": "verCode", "value": deviceInfo.versionCode },
                    { "index": 5, "key": "channel", "label": "channel", "value": deviceInfo.channel },
                    { "index": 6, "key": "deviceModel", "label": "手机型号", "value": deviceInfo.deviceModel },
                    { "index": 7, "key": "systemVersion", "label": "系统版本", "value": deviceInfo.systemVersion },
                    { "index": 8, "key": "avatar", "label": "头像", "value": "https://statics.zhuishushenqi.com" + userInfo.avatar }
                ]),
                success: function () {     // 成功回调
                    self.kfUrl = ysf.url().replace(/\&t=.*/g, "") + (self.templateId ? '&templateId=' + self.templateId : '');
                },
                error: function () {       // 错误回调
                    // handle error
                    self.kfUrl = ysf.url().replace(/\&t=.*/g, "") + (self.templateId ? '&templateId=' + self.templateId : '');
                }
            });
        },
        clickKF() {
            var self = this;
            HybridApi.setSensorsUserBehavior({
                "event": "ZSBtnClick",
                "btn_click_category1": "活动h5",
                "btn_click_category2": "意见反馈",
                "btn_click_category3": "在线客服",
                "btn_click_category4": null,
                "btn_click_category5": null
            })
            if (self.canRouteToSApp && !!self.userid) {
                var path = "pages/siyu/index?userid=" + self.userid + '&frompage=' + (appEntranceData[self.packageName][self.appEntrance] || '') + '&platform=' + (self.platform == 'android' ? '2' : '1') + '&product_line=' + (self.packageName == 'com.ushaqi.zhuishushenqi.newadfree2' ? '6' : (self.packageName == 'com.ifmoc.DouKouYueDu2' || self.packageName == 'com.ifmoc.DouKouYueDu') ? '10' : '1') + '&entrance=' + self.appEntrance + '&frompath=faq&channel=' + self.packageName + '&token=' + self.token;
                if (self.platform == 'android') {
                    window.ZssqApi && window.ZssqApi.openMiniApp && window.ZssqApi.openMiniApp(path);
                } else {
                    window.webkit.messageHandlers.ZssqApi.postMessage({
                        action: 'openMiniApp',
                        path: path
                    })
                }
            } else {
                var path = 'http://h5.zhuishushenqi.com/public/privateDomain/leadCodeForFAQ.html' + location.search + '&fromPage=' + (appEntranceData[self.packageName][self.appEntrance] || '')
                if (self.isNative) {
                    HybridApi.request({
                        action: 'jump',
                        param: {
                            jumpType: 'webview',
                            title: '帮助与反馈',
                            pageType: '',
                            link: path
                        }
                    });
                } else {
                    location.href = path;
                }
            }
        },
        generateArticleUrl(deviceInfo, userInfo) {
            if (!this.userid) {
                return
            }
            var self = this,
                formdata = {
                    appEntrance: self.appEntrance,
                    appVersion: deviceInfo.version,
                    channel: deviceInfo.channel,
                    isVip: userInfo.isMonthly == 'unknow' ? false : (userInfo.isMonthly ? true : false),
                    phoneModel: deviceInfo.deviceModel,
                    platform: self.platform,
                    systemVersion: deviceInfo.systemVersion,
                    token: self.token,
                    userChannel: self.packageName,
                    verCode: deviceInfo.versionCode || '123'
                }

            self.$http({
                method: 'POST',
                url: config.generateArticleUrl,
                body: JSON.stringify(formdata),
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json;charset=UTF-8"
                }
            }).then((data) => {
            })

        }
    },
    watch: {

    }
});
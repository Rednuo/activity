import "../css/index.scss";

import Vue from 'vue'
import axios from 'axios'
import * as tools from './utils'
import { url } from './config'
import fastclick from '../../../Common/js/fastclick'
import HybridApi from '../../../Common/js/bridge'
import Umeng from '../../../Common/js/Umeng'
import Toast from '../../../Common/js/component/toast'
import VDistpicker from 'v-distpicker'

if (!Object.values) Object.values = function(obj) {
    if (obj !== Object(obj))
        throw new TypeError('Object.values called on a non-object');
    var val=[],key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            val.push(obj[key]);
        }
    }
    return val;
}
const umeng = new Umeng('1261312741', function () {
});

/*
    com.ushaqi.zhuishushenqi        
    com.ifmoc.ZhuiShuShenQi
    com.ushaqi.zhuishushenqi.adfree
    com.ushaqi.zhuishushenqi.newadfree2
*/

new Vue({
    el: '#J_pageWraper',
    data: {
        posCode: tools.getQueryParams('posCode') || '-1',
        platform: tools.getQueryParams('platform') || 'android',
        token: tools.getQueryParams('token') || '',
        packageName: tools.getQueryParams('packageName') || 'com.ushaqi.zhuishushenqi',
        isEdit: true,
        address_name: '',
        address_phone: '',
        addr: ['','','',''],
        city: '',
        nickName: '',
        avatar: require('../img/defaultAvatar.png'),
        isAddrPick: false,
        isSubmit: false
    },
    components: { VDistpicker },
    created: function(){
    },
    mounted: function () {
        this.init();
    },
    methods: {
        init() {
            let self = this;
            HybridApi.init();
            this.setTopBarColor();
            fastclick.init();
            this.getAccount();
            //注册返回webview后方法
            //当前页面返回后，会在上级webview执行JS回调
            setTimeout(function(){
                HybridApi.backEvent({
                    event: 'addressCallback',
                    data: {'success': self.isSubmit}
                })
            },1000)
            this.umeng(['访问']);
        },
        umeng(active) {
            umeng.push(['收货地址', ...active]);
        },
        // 获取用户信息
        getAccount() {
            let self = this;
            if (!self.token) {
                self.login();
                return;
            }
            axios.get(url.account + `?token=${self.token}`).then(response => {
                if( response.data.ok ){
                    self.isSubmit = true;
                    self.address_name = response.data.info.name;
                    self.address_phone = response.data.info.phone;
                    let address = response.data.info.address;
                    address = address.split('#');
                    if (address.length == 4) {
                        self.addr = address;
                    } else {
                        self.addr = ['','','',address[0]];
                    }
                    if (this.addr[0] && this.addr[1] && this.addr[2]) {
                        this.city = this.addr.slice(0,3).join('/');
                    } else {
                        this.city = '';
                    }
                    self.nickName = response.data.info.nickname;
                    self.avatar = 'https://statics.zhuishushenqi.com' + response.data.info.avatar;
                    if (self.address_name) {
                        self.isEdit = false
                    }
                }
            }).catch(error => {
            
            })
        },
        login() {
            let self = this;
            self.umeng(['登录']);
            HybridApi.getUserInfo(function (data) {
                self.token = data.token;
                window.location.href = window.location.href.indexOf('?') > -1 ? (window.location.href + '&token=' + self.token) : (window.location.href + '?token=' + self.token)
            })
        },
        // 提交收货地址
        postAccountInfo() {
            let self = this;
            self.umeng(['提交收货地址', '点击']);

            if (!self.token) {
                self.login();
                return;
            }

            if( !/^\d{11}$/.test(self.address_phone) ){
                Toast.show("请填写正确的手机号码");
                return;
            }
            if (!(self.addr && self.addr[0] && self.addr[1] && self.addr[2] && self.addr[3])) {
                Toast.show("请完善地址");
                return;
            }
            if (self.address_name && self.address_phone) {

                axios.post(url.postAccountInfoNew, {
                    type: 'exchange',
                    phone: self.address_phone,
                    name: self.address_name,
                    address: self.addr.join('#'),
                    token: self.token
                }, {
                }).then((res) => {
                    if (res.data.ok || res.data.ecode===0 ) {
                        self.isEdit = false
                        self.isSubmit = true;
                        Toast.show("提交成功");
                    } else {
                        Toast.show("网络连接失败，请稍后重试");
                    }
                }).catch((err) => {
                    Toast.show("网络连接失败，请稍后重试");
                })
            } else {
                Toast.show("请输入完整的地址信息")
            }
        },
        setTopBarColor() {
            if (this.platform == 'android') {
                HybridApi.request({
                    action: 'setTopBarColor',
                    param: {
                        "color":"#000000",
                        "background":"#FFFFFF",
                        "back":"#000000",
                        "titlePosition":"middle"
                    }
                });
            }
        },
        onSelectAddr(val) {
            this.addr[0] = val.province.value;
            this.addr[1] = val.city.value;
            this.addr[2] = val.area.value;
            if (this.addr[0] && this.addr[1] && this.addr[2]) {
                this.city = this.addr.slice(0,3).join('/');
            } else {
                this.city = '';
            }
            this.isAddrPick = false;
        }
    }
})
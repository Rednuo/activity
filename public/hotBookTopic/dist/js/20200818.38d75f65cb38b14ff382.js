!function(e){function o(o){for(var t,r,a=o[0],c=o[1],u=o[2],l=0,p=[];l<a.length;l++)r=a[l],Object.prototype.hasOwnProperty.call(i,r)&&i[r]&&p.push(i[r][0]),i[r]=0;for(t in c)Object.prototype.hasOwnProperty.call(c,t)&&(e[t]=c[t]);for(d&&d(o);p.length;)p.shift()();return s.push.apply(s,u||[]),n()}function n(){for(var e,o=0;o<s.length;o++){for(var n=s[o],t=!0,a=1;a<n.length;a++){var c=n[a];0!==i[c]&&(t=!1)}t&&(s.splice(o--,1),e=r(r.s=n[0]))}return e}var t={},i={5:0},s=[];function r(o){if(t[o])return t[o].exports;var n=t[o]={i:o,l:!1,exports:{}};return e[o].call(n.exports,n,n.exports,r),n.l=!0,n.exports}r.m=e,r.c=t,r.d=function(e,o,n){r.o(e,o)||Object.defineProperty(e,o,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,o){if(1&o&&(e=r(e)),8&o)return e;if(4&o&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&o&&"string"!=typeof e)for(var t in e)r.d(n,t,function(o){return e[o]}.bind(null,t));return n},r.n=function(e){var o=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(o,"a",o),o},r.o=function(e,o){return Object.prototype.hasOwnProperty.call(e,o)},r.p="./";var a=window.webpackJsonp=window.webpackJsonp||[],c=a.push.bind(a);a.push=o,a=a.slice();for(var u=0;u<a.length;u++)o(a[u]);var d=c;s.push([201,0]),n()}({1:function(e,o,n){"use strict";var t,i=n(4),s=n.n(i),r=(n(17),n(3)),a=n.n(r),c=n(18),u=n.n(c),d=(n(8),n(15)),l=n.n(d),p=n(0),f=n.n(p),w=n(19),m=n.n(w);n(9),n(10);function h(e,o){o||(o=location.href),e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var n=new RegExp("[\\?&]"+e+"=([^&#]*)").exec(o);return null==n?null:n[1]}var g=(t={_bridgePostMsg:function(e){console.log(decodeURIComponent(e));var o=document.createElement("IFRAME");o.setAttribute("src",e),o.setAttribute("style","display:none"),o.setAttribute("height","1px"),o.setAttribute("width","1px"),document.documentElement.appendChild(o),setTimeout((function(){o.parentNode.removeChild(o),o=null}),10)},_getHybridUrl:function(e){var o="",n="jsbridge://";return n+=e.action+"?t="+(new Date).getTime(),e.callback&&(n+="&callback="+e.callback,delete e.callback),e.param&&(o="object"==m()(e.param)?f()(e.param):e.param,n+="&param="+encodeURIComponent(o)),n},_Event:{on:function(e,o){this.handles||l()(this,"handles",{value:{},enumerable:!1,configurable:!0,writable:!0}),this.handles[e]||(this.handles[e]=[]),this.handles[e].push(o)},emit:function(e){if(this.handles[arguments[0]])for(var o=0;o<this.handles[arguments[0]].length;o++)this.handles[arguments[0]][o](arguments[1])},emitTemp:function(e){g._Event.emit(e.event,e.data)}},request:function(e){var o,n="hybrid"+(new Date).getTime();if(e&&e.param&&("native"!==e.param.jumpType&&"webview"!==e.param.jumpType||(window.REDIRECTCLICKCOUNT=window.REDIRECTCLICKCOUNT?window.REDIRECTCLICKCOUNT+1:1)),e&&e.param&&e.param.umeng){var t=e.param.umeng.split("-");window._czc&&window._czc.push(["_trackEvent"].concat(u()(t)))}e.callback&&!e.resume&&(o=e.callback,e.callback="window.HybridCallBack."+n,window.HybridCallBack[n]=function(e){o(e)}),this._bridgePostMsg(this._getHybridUrl(e))},setUserBehavior:function(e){this.request({action:"setUserBehavior",param:f()({code:decodeURIComponent(e)})})},publicUpLoadExposure:function(e){try{var o=function(e){var o=e.split("##"),n={};return n="RESOURCEBIT"===o[0]?{activity_category1:o[1],activity_identifier:o[2],dest_name:o[3],dest_key:o[4],dest_id:o[5],activity_name:o[6]}:{book_id:o[0],book_name:o[1],is_vip_book:"true"===o[2],is_finish_book:"true"===o[3],is_freeread_book:"true"===o[4],exposure_category1:o[5],exposure_category2:o[6],exposure_category3:o[7],exposure_category4:o[8],exposure_index:a()(o[9],10),exposure_ismore:"true"===o[10],booklist_id:o[11],booklist_name:o[12]},f()(n)};if("android"===h("platform")){var n=decodeURIComponent(o(e));e.match("RESOURCEBIT")?(console.log("Android RESOURCEBIT sensors: "+n),window.ZssqApi&&window.ZssqApi.upLoadResourceExposure&&window.ZssqApi.upLoadResourceExposure(n)):(console.log("Android BOOK sensors: "+n),window.ZssqApi&&window.ZssqApi.upLoadBookExposure&&window.ZssqApi.upLoadBookExposure(n))}else if("ios"===h("platform")){var t=decodeURIComponent(o(e));e.match("RESOURCEBIT")?(console.log("iOS RESOURCEBIT sensors"+t),window.webkit&&window.webkit.messageHandlers.ZssqApi.postMessage({action:"upLoadResourceExposure",value:t})):(console.log("iOS BOOK sensors"+t),window.webkit&&window.webkit.messageHandlers.ZssqApi.postMessage({action:"upLoadBookExposure",value:t}))}}catch(e){console.error(e)}},setSensorsUserBehavior:function(e){this.request({action:"setSensorsUserBehavior",param:e})},upLoadResourceExposure:function(e){"android"===h("platform")?(console.log("Android RESOURCEBIT sensors "+e),window.ZssqApi&&window.ZssqApi.upLoadResourceExposure&&window.ZssqApi.upLoadResourceExposure(e)):"ios"===h("platform")&&(console.log("iOS RESOURCEBIT sensors "+e),window.webkit&&window.webkit.messageHandlers.ZssqApi.postMessage({action:"upLoadResourceExposure",value:e}))},getUserInfo:function(e){g.request({action:"getUserInfo",callback:function(o){e&&e(o)}})},getDeviceInfo:function(e){this.request({action:"getDeviceInfo",callback:function(o){e&&e(o)}})},share:function(e){g.request({action:"share",param:f()(e)})},setBurialPoint:function(e){g.request({action:"setBurialPoint",param:f()(e)})},setBounces:function(e){this.request({action:"setBounces",param:f()({enabled:e})})},pop:function(e){g.request({action:"pop",resume:!0,param:e,callback:"HybridApi._Event.emitTemp"})},backEvent:function(e){g.request({action:"backEvent",resume:!0,param:e,callback:"HybridApi._Event.emitTemp"})},releaseSlide:function(e){"android"===h("platform")&&(window.ZssqAndroidApi&&window.ZssqAndroidApi.releaseSlide(e),window.ZssqApi&&window.ZssqApi.releaseSlide(e))},getUserPreference:function(){try{var e={female:[],male:[],picture:[],press:[]};return"android"===h("platform")?window.ZssqAndroidApi&&window.ZssqAndroidApi.getUserPreference&&""!==window.ZssqAndroidApi.getUserPreference()&&"null"!==window.ZssqAndroidApi.getUserPreference()?e=JSON.parse(window.ZssqAndroidApi.getUserPreference()):window.ZssqApi&&window.ZssqApi.getUserPreference&&""!==window.ZssqApi.getUserPreference()&&"null"!==window.ZssqApi.getUserPreference()&&(e=JSON.parse(window.ZssqApi.getUserPreference())):"ios"===h("platform")&&window.ZssqApi&&window.ZssqApi.getUserPreference&&(e=window.ZssqApi.getUserPreference()),""===e&&(e=localStorage.getItem("userPreference")?JSON.parse(localStorage.getItem("userPreference")):e),e=e.female.concat(e.male).concat(e.picture).concat(e.press).join(",")}catch(e){console.log(e)}},updateUserPreference:function(e){this.request({action:"updateUserPreference",param:f()({LikeCate:e})})},login:function(e){this.request({action:"login",callback:function(o){e&&e(o)}})},insertNoInterestBookToAvoidArray:function(e){"android"===h("platform")&&window.ZssqApi&&window.ZssqApi.insertNoInterestBookToAvoidArray&&window.ZssqApi.insertNoInterestBookToAvoidArray(e)},copyBoard:function(e,o){g.request({action:"copyBoard",param:f()({copyStr:e}),callback:function(e){o&&o(e)}})}},s()(t,"releaseSlide",(function(e){"android"===h("platform")&&(window.ZssqAndroidApi&&window.ZssqAndroidApi.releaseSlide(e),window.ZssqApi&&window.ZssqApi.releaseSlide(e))})),s()(t,"onWebviewLoaded",(function(e){this.request({action:"onWebviewLoaded",param:f()(e),callback:function(e){}})})),s()(t,"init",(function(){window.HybridApi=g,window.HybridCallBack=window.HybridCallBack||{}})),t);o.a=g},11:function(e,o,n){"use strict";n.d(o,"a",(function(){return t}));n(9),n(10);var t=function(e,o){o||(o=location.href),e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var n=new RegExp("[\\?&]"+e+"=([^&#]*)").exec(o);return null==n?null:n[1]}},12:function(e,o,n){"use strict";var t=n(14),i=n.n(t),s={init:function(){"addEventListener"in document&&document.addEventListener("DOMContentLoaded",(function(){i.a.attach(document.body)}),!1)}};o.a=s},13:function(e,o,n){"use strict";n.d(o,"a",(function(){return f}));n(17);var t=n(3),i=n.n(t),s=n(0),r=n.n(s),a=(n(8),n(9),n(10),function(e,o){o||(o=location.href),e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var n=new RegExp("[\\?&]"+e+"=([^&#]*)").exec(o);return null==n?null:n[1]}),c=function(e){try{"android"===a("platform")?(e=decodeURIComponent(e),console.log(e),window.ZssqAndroidApi&&window.ZssqAndroidApi.upLoadH5Appevent&&window.ZssqAndroidApi.upLoadH5Appevent(e),window.ZssqApi&&window.ZssqApi.upLoadH5Appevent&&window.ZssqApi.upLoadH5Appevent(e)):"ios"===a("platform")&&(e=decodeURIComponent(e),console.log(e),window.webkit&&window.webkit.messageHandlers.ZssqApi.postMessage({action:"upLoadH5Appevent",value:e}))}catch(e){console.error(e)}},u=function(e){try{if(!e)return!1;var o=(e=JSON.parse(decodeURIComponent(e))).event;delete e.event,sensors.track(o,e)}catch(e){console.error(e)}},d=function(e,o){try{var n=function(e){var n=e.split("##"),t={};if("KeyItemExpousure"===n[0]){var s=JSON.parse(n[1]);return s.is_validate_visit=o,n[0]+"##"+r()(s)}return t="RESOURCEBIT"===n[0]?{activity_category1:n[1],activity_identifier:n[2],dest_name:n[3],dest_key:n[4],dest_id:n[5],activity_name:n[6]}:{book_id:"null"===n[0]?null:n[0],book_name:"null"===n[1]?null:n[1],is_vip_book:"true"===n[2],is_finish_book:"true"===n[3],is_freeread_book:"true"===n[4],exposure_category1:"null"===n[5]?null:n[5],exposure_category2:"null"===n[6]?null:n[6],exposure_category3:"null"===n[7]?null:n[7],exposure_category4:"null"===n[8]?null:n[8],exposure_index:i()(n[9],10),exposure_ismore:"null"===n[10]?null:n[10],booklist_id:"null"===n[11]?null:n[11],booklist_name:"null"===n[12]?null:n[12]},r()(t)};if(!e)return!1;if("android"===a("platform")){var t=decodeURIComponent(n(e));e.match("KeyItemExpousure")?(console.log(t.split("##")[1]),window.ZssqApi&&window.ZssqApi.upLoadKeyItemExpousure&&window.ZssqApi.upLoadKeyItemExpousure(t.split("##")[1])):e.match("RESOURCEBIT")?(console.log("Android RESOURCEBIT sensors: "+t),window.ZssqApi&&window.ZssqApi.upLoadResourceExposure&&window.ZssqApi.upLoadResourceExposure(t)):(console.log("Android BOOK sensors: "+t),window.ZssqApi&&window.ZssqApi.upLoadBookExposure&&window.ZssqApi.upLoadBookExposure(t))}else if("ios"===a("platform")){var s=decodeURIComponent(n(e));e.match("KeyItemExpousure")?(console.log(s.split("##")[1]),window.webkit&&window.webkit.messageHandlers.ZssqApi.postMessage({action:"upLoadKeyItemExpousure",value:s.split("##")[1]})):e.match("RESOURCEBIT")?(console.log("iOS RESOURCEBIT sensors"+s),window.webkit&&window.webkit.messageHandlers.ZssqApi.postMessage({action:"upLoadResourceExposure",value:s})):(console.log("iOS BOOK sensors"+s),window.webkit&&window.webkit.messageHandlers.ZssqApi.postMessage({action:"upLoadBookExposure",value:s}))}}catch(e){console.error(e)}},l=function(e,o,n){var t,i=null;return function(){var s=this,r=arguments,a=+new Date;clearTimeout(i),t||(t=a),a-t>=n?(e.apply(s,r),t=a):i=setTimeout((function(){e.apply(s,r)}),o)}},p=function(e){var o,n,t=[],i=0;if(n=function(e){return e!==window?e.offsetHeight:window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight}(e),t=document.querySelectorAll('[data-exposure-pv="1"]'),o=e===window?document.documentElement.scrollTop||document.body.scrollTop:e.scrollTop,t.length>0)for(var s=0;s<t.length;s++)i=+t[s].getAttribute("data-exposure-fault-tolerant-top")||0,t[s].getBoundingClientRect().width>0&&n-t[s].offsetHeight+i>=t[s].getBoundingClientRect().top&&(t[s].setAttribute("data-exposure-pv","0"),c(t[s].getAttribute("data-exposure-params")),d(t[s].getAttribute("data-exposure-sensors-params"),o>0),u(t[s].getAttribute("data-exposure-h5sensors-params")))},f=function(e){var o,n=requestAnimationFrame||setTimeout;o=e&&e.container?e.container:window,n((function(){p(o),o.onscroll=l((function(){p(o)}),50,100)}),500)}},201:function(e,o,n){"use strict";n.r(o);n(26),n(32);var t=n(2),i=n(7),s=n.n(i),r=n(5),a=n(11),c=n(12),u=n(1),d=n(6),l=n(13),p=n(20),f=n.n(p);n(33).polyfill(),new t.default({el:"#J_pageWraper",data:{token:a.a("token")||"",bookList:[],isFetching:!0,isLogin:!1,isMonthly:!0},created:function(){c.a.init(),u.a.init(),Object(l.a)()},mounted:function(){this.umeng("20200806访问"),u.a.setUserBehavior("f02##-1|20200806"),this.init()},methods:{init:function(){new f.a(".swiper-container",{loop:!0,autoplay:!0,pagination:{el:".swiper-pagination"}}),this.token&&this.fetchBookShelf()},umeng:function(e){_czc.push(["_trackEvent","爆款书籍","活动H5",e,1,"active"])},callNative:function(e){e.umeng&&this.umeng(e.umeng),u.a.request({action:e.action,param:e.params})},setBI:function(e){u.a.setUserBehavior(e)},fetchBookShelf:function(){var e=this;s.a.get(r.a.getBookShelf+"?token="+e.token).then((function(o){var n=o.data;if(n.ok){var t;t=n.bookshelf.map((function(e){return e._id})),e.bookShelf=t,console.log(t)}}))},addBookShelf:function(e,o){this.umeng("20200806加书架"),this.token?this.bookShelf.indexOf(e)>-1?d.a.show("《".concat(o,"》已在书架了")):(u.a.request({action:"handleBookShelf",param:{id:e,type:"add",path:"bookList"},callback:function(){}}),this.bookShelf.push(e),d.a.show("《".concat(o,"》已加入书架"))):u.a.getUserInfo((function(e){window.location.href=window.location.href+"&token="+e.token}))},clickVideo:function(){this.umeng("20200806视频播放")},clickDownload:function(){this.umeng("20200806点击下载")},getUserInfo:function(){this.token?(this.isLogin=!0,this.getUserAccount()):this.isFetching=!1},getUserAccount:function(){var e=this;s.a.get(r.a.getAccount+e.token).then((function(o){e.isFetching=!1,(o=o.data)&&o.ok&&(e.isMonthly=o.isMonthly)}))}}})},23:function(e,o,n){},26:function(e,o,n){},5:function(e,o,n){"use strict";n.d(o,"a",(function(){return s}));n(8);var t=location.protocol.split(":")[0]+"://",i=t+"api.zhuishushenqi.com",s={getBookPriceInfo:i+"/book/",getBookListNode:t+"b.zhuishushenqi.com"+"/category/info?node=",getAccount:i+"/user/account?token=",getBookShelf:i+"/user/bookshelf"}},6:function(e,o,n){"use strict";var t=n(2);n(23);var i={show:function(e,o){var n={duration:"1000"};for(var i in o)n[i]=o[i];if(!document.querySelector(".c-toast")){var s=(new(t.default.extend({template:'<div class="c-toast animated"><span>'.concat(e,"</span></div>")}))).$mount().$el;document.body.appendChild(s),setTimeout((function(){s.classList.add("fadeOut"),setTimeout((function(){document.body.removeChild(s)}),1e3)}),n.duration)}}};o.a=i}});
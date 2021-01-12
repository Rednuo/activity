function getQueryParams( name, url ) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var regexS = "[\\?&]"+name+"=([^&#]*)";
    var regex = new RegExp( regexS );
    var results = regex.exec( url );
    return results == null ? null : results[1];
}
var HybridApi = {
    _bridgePostMsg : function (url) {
        console.log(decodeURIComponent(url))
        if (getQueryParams('platform') && getQueryParams('platform')==='ios') {
            window.location = url;
        } else {
            var iframe = document.createElement("IFRAME");
            iframe.setAttribute("src", url);
            // For some reason we need to set a non-empty size for the iOS6 simulator...
            iframe.setAttribute("height", "1px");
            iframe.setAttribute("width", "1px");
            document.documentElement.appendChild(iframe);
            setTimeout(function(){
                iframe.parentNode.removeChild(iframe);
                iframe = null;
            },10)
        }
    },
    _getHybridUrl : function (params) {
        var k, paramStr = '', url = 'jsbridge://';
        url += params.action + '?t=' + new Date().getTime(); //时间戳，防止url不起效
        if (params.callback) {
            url += '&callback=' + params.callback;
            delete params.callback;
        }
        if (params.param) {
            paramStr = typeof params.param == 'object' ? JSON.stringify(params.param) : params.param;
            url += '&param=' + encodeURIComponent(paramStr);
        }
        return url;
    },
    _Event : {
	    // 通过on接口监听事件eventName
	    // 如果事件eventName被触发，则执行callback回调函数
	    on: function (eventName, callback) {
	        //你的代码
	        if(!this.handles){
	            //this.handles={};
	            Object.defineProperty(this, "handles", {
	                value: {},
	                enumerable: false,
	                configurable: true,
	                writable: true
	            })
	        }
	       
	       if(!this.handles[eventName]){
	            this.handles[eventName]=[];
	       }
	       this.handles[eventName].push(callback);
	    },
	    // 触发事件 eventName
	    emit: function (eventName) {
	        //你的代码
	       if(this.handles[arguments[0]]){
	           for(var i=0;i<this.handles[arguments[0]].length;i++){
	               this.handles[arguments[0]][i](arguments[1]);
	           }
	       }
	    },
	    emitTemp:function( params ){
			HybridApi._Event.emit(params.event,params.data)
	    }
	},
    request : function (params) {
        var self = this;
        //生成唯一执行函数，执行后销毁
        var tt = (new Date().getTime());
        var t = 'hybrid' + tt;
        var tmpFn;

        //友盟埋点
        if(params && params.param && params.param.source){
            _czc.push(["_trackEvent", params.param.source, "点击", params.param.title ]);
        }
        
        //ABTEST
        if(window.adhoc && params && params.param && params.param.ABTEST){
            window.adhoc.increment(params.param.ABTEST, 1)
        }       

        //处理有回调的情况
        if (params.callback&&!params.resume) {
            tmpFn = params.callback;
            params.callback = 'window.HybridCallBack.'+t;
            window.HybridCallBack[t] = function (data) {
                tmpFn(data);
                delete window.HybridCallBack[t];
            }
        }
        self._bridgePostMsg(self._getHybridUrl(params));
    },
    setUserBehavior:function(params){
        var self = this;
        self.request({
            action:'setUserBehavior',
            param:JSON.stringify({"code":params})
        })
    },
    getUserInfo : function( fn ){
        var self = HybridApi;
        self.request({
            action:'getUserInfo',
            callback:function(data){
                fn && fn(data);
            }
        })
    },
    share : function(params){
        var self = HybridApi;
        self.request({
            action:'share',
            param:JSON.stringify(params)
        })
    },
    setBurialPoint : function(params){
        var self = HybridApi;
        self.request({
            action:'setBurialPoint',
            param:JSON.stringify(params)
        })
    },
    setBounces : function( flag ){
        var self = this;
        self.request({
            action:'setBounces',
            param:JSON.stringify({"enabled": flag })
        })
    },
    pop:function(params){
    	HybridApi.request({
	        action: 'pop',
	        resume:true,
	        param:params,
	        callback:'HybridApi._Event.emitTemp'
	    });
    },
    backEvent:function(params){
        HybridApi.request({
	        action: 'backEvent',
	        resume:true,
	        param:params,
	        callback:'HybridApi._Event.emitTemp'
	    });
    },
    copyBoard:function(str,fn){
        var self = HybridApi;
        self.request({
            action: 'copyBoard',
            param: JSON.stringify({"copyStr": str}),
            callback:function(data){
                fn && fn(data);
            }
        })
    },
    init:function(){
        window.HybridApi = HybridApi;
        window.HybridCallBack = window.HybridCallBack || {};
    }
}


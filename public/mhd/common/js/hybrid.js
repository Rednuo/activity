(function () {
  var mhdJSBridge = window.mhdJSBridge;
  var HybridCallBack = {
      name: 'HybridCallBack',
  };
  var HybridUtil = {
      name: 'HybridUtil',
      getQueryParams: function (name, url) {
          if (!url) url = location.href;
          name = name.replace(/[\[]/, '\\\[').replace(/[\]]/, '\\\]');
          var regexS = '[\\?&]' + name + '=([^&#]*)';
          var regex = new RegExp(regexS);
          var results = regex.exec(url);
          return results == null ? null : results[1];
      },
      _bridgePostMsg: function (url) {
          if (HybridUtil.getQueryParams('platform') && HybridUtil.getQueryParams('platform') === 'ios') {
              window.location = url;
          } else {
              var iframe = document.createElement('IFRAME');
              iframe.setAttribute('src', url);
              // For some reason we need to set a non-empty size for the iOS6 simulator...
              iframe.setAttribute('height', '1px');
              iframe.setAttribute('width', '1px');
              document.documentElement.appendChild(iframe);
              setTimeout(function () {
                  iframe.parentNode.removeChild(iframe);
                  iframe = null;
              }, 10);
          }
      },
      _getHybridUrl: function (params) {
          var paramStr = '', url = 'jsbridge://';
          url += params.action + '?t=' + Date.now(); //鏃堕棿鎴筹紝闃叉url涓嶈捣鏁�
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
      _Event: {
          // 閫氳繃on鎺ュ彛鐩戝惉浜嬩欢eventName
          // 濡傛灉浜嬩欢eventName琚Е鍙戯紝鍒欐墽琛宑allback鍥炶皟鍑芥暟
          on: function (eventName, callback) {
              if (!this.handles) {
                  Object.defineProperty(this, 'handles', {
                      value: {},
                      enumerable: false,
                      configurable: true,
                      writable: true
                  });
              }

              this.handles[eventName] = [];
              this.handles[eventName].push(callback);
          },
          // 瑙﹀彂浜嬩欢 eventName
          emit: function (eventName) {
              //浣犵殑浠ｇ爜
              if (this.handles[arguments[0]]) {
                  for (var i = 0; i < this.handles[arguments[0]].length; i++) {
                      this.handles[arguments[0]][i](arguments[1]);
                  }
              }
          },
          emitTemp: function (params) {
              HybridUtil._Event.emit(params.event, params.data);
          }
      },
      request: function (params) {
          //鐢熸垚鍞竴鎵ц鍑芥暟锛屾墽琛屽悗閿€姣�
          var tt = Date.now();
          var t = 'hybrid' + tt;
          var tmpFn;

          //ABTEST
          if (window.adhoc && params && params.param && params.param.ABTEST) {
              window.adhoc.increment(params.param.ABTEST, 1);
          }

          //澶勭悊鏈夊洖璋冪殑鎯呭喌
          if (params.callback && !params.resume) {
              tmpFn = params.callback;
              params.callback = 'window.' + HybridCallBack.name + '.' + t;
              HybridCallBack[t] = function (data) {
                  tmpFn(data);
                  delete HybridCallBack[t];
              };
          }
          HybridUtil._bridgePostMsg(HybridUtil._getHybridUrl(params));
      },
      setUserBehavior: function (params) {
          HybridUtil.request({
              action: 'setUserBehavior',
              param: JSON.stringify({'code': params})
          });
      },
      getUserInfo: function (fn) {
          HybridUtil.request({
              action: 'getUserInfo',
              callback: function (data) {
                  fn && fn(data);
              },
          });
      },
      share: function (params) {
          HybridUtil.request({
              action: 'share',
              param: JSON.stringify(params)
          });
      },
      setBurialPoint: function (params) {
          HybridUtil.request({
              action: 'setBurialPoint',
              param: JSON.stringify(params)
          });
      },
      setBounces: function (flag) {
          HybridUtil.request({
              action: 'setBounces',
              param: JSON.stringify({'enabled': flag})
          });
      },
      pop: function (params) {
          HybridUtil.request({
              action: 'pop',
              param: params,
              resume: true,
              callback: 'window.' + HybridUtil.name + '._Event.emitTemp'
          });
      },
      init: function () {
          window[HybridUtil.name] = HybridUtil;
          window[HybridCallBack.name] = HybridCallBack;
      },
      isNative: function () {
          return !!mhdJSBridge;
      },
      login: function (data) {
          if (!mhdJSBridge) {
              return;
          }
          mhdJSBridge.login(JSON.stringify(data));
      },
      getUserInfo: function () {
          var user = {};
          if (!mhdJSBridge) {
              return user;
          }
          user = JSON.parse(mhdJSBridge.getUserInfo());
          if (!user.userId) {
              user.userId = undefined;
          }
          return user;
      },
      setSensorsUserBehavior: function(params) {
        HybridUtil.request({
            action: 'setSensorsUserBehavior',
            param: params
        })
    },
  };
  if (!window[HybridUtil.name]) {
      HybridUtil.init();
  }
})();
//window.ZssqApi.upLoadH5Appevent
/*window.webkit.messageHandlers.ZssqApi.postMessage({
            action:'upLoadH5Appevent',
            value:'abc'
        })*/

/*let publicUpLoadH5Appevent = function(){};

const getQueryParams = (name, url) => {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

if( getQueryParams('platform')==='android' && window.ZssqApi && window.ZssqApi.upLoadH5Appevent ){
    publicUpLoadH5Appevent = function( value ){
        console.log('android: '+value)
        window.ZssqApi.upLoadH5Appevent(value)  
    } 
}else if( getQueryParams('platform')==='ios' ){
    publicUpLoadH5Appevent = function( value ){
        console.log('ios: '+value)
        window.webkit.messageHandlers.ZssqApi.postMessage({
          action:'upLoadH5Appevent',
          value:value
        })   
    }
}*/

(function() {
    window.tools = {};
    window.upLoadH5AppeventData = [];
    var getQueryParams = function(name, url) {
        if (!url) url = location.href;
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(url);
        return results == null ? null : results[1];
    }

    var publicUpLoadH5Appevent = function(value) {
        if (getQueryParams('platform') === 'android') {
            console.log('Android: ' + value)
            window.ZssqApi && window.ZssqApi.upLoadH5Appevent && window.ZssqApi.upLoadH5Appevent(value)
        } else if (getQueryParams('platform') === 'ios') {
            console.log('Ios: ' + value)
            window.webkit.messageHandlers.ZssqApi.postMessage({
                action: 'upLoadH5Appevent',
                value: value
            })
        }
    }

    var throttle = function(fn, delay, mustRunDelay) {
        var timer = null;
        var t_start;
        return function() {
            var context = this,
                args = arguments,
                t_curr = +new Date();
            clearTimeout(timer);
            if (!t_start) {
                t_start = t_curr;
            }
            if (t_curr - t_start >= mustRunDelay) {
                fn.apply(context, args);
                t_start = t_curr;
            } else {
                timer = setTimeout(function() {
                    fn.apply(context, args);
                }, delay);
            }
        };
    };
   var throttles = function (fn, delay, mustRunDelay) {
       var timer = null;
       var t_start;
       return function () {
           var context = this,
               args = arguments,
               t_curr = +new Date();
           clearTimeout(timer);
           if (!t_start) {
               t_start = t_curr;
           }
           if (t_curr - t_start >= mustRunDelay) {
               fn.apply(context, args);
               t_start = t_curr;
           } else {
               timer = setTimeout(function () {
                   fn.apply(context, args);
               }, delay);
           }
       };
   };
    var getVisualAreaHeight = function(container) {
        return container !== window ? container.offsetHeight : (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)
    }

    var onContainerScroll = function(container) {
        var domElements = [],
            scrollTop = 0,
            visualAreaHeight = 0,
            exposureFaultTolerantTop = 0;
        visualAreaHeight = getVisualAreaHeight(container);
        domElements = document.querySelectorAll('[data-exposure-pv="1"]');
        scrollTop = (container === window) ? (document.documentElement.scrollTop || document.body.scrollTop) : container.scrollTop;
        if (domElements.length > 0) {
            for (var i = 0; i < domElements.length; i++) {
                exposureFaultTolerantTop = +domElements[i].getAttribute('data-exposure-fault-tolerant-top') || 0;
                if (scrollTop + visualAreaHeight - domElements[i].offsetHeight + exposureFaultTolerantTop >= domElements[i].offsetTop) {
                    domElements[i].setAttribute('data-exposure-pv', '0');
                    publicUpLoadH5Appevent(domElements[i].getAttribute('data-exposure-params'));
                }
            }
        }
    }

    window.tools.initExposure = function(params) {
        var container,
            domElements = [],
            scrollTop = 0,
            visualAreaHeight = 0,
            timeout = requestAnimationFrame || setTimeout;
        if (!params || !params.container) {
            container = window;
        } else {
            container = params.container;
        }
        timeout(function() {
            onContainerScroll(container);
            // container.onscroll = throttle(function(){onContainerScroll(container)},50,100);

            container.onscroll = throttle(function() {

                onContainerScroll(container)
            }, 50, 100);
            container.addEventListener('scroll',function(){
            onContainerScroll(container);
            })
        }, 500)
    }

    window.tools.setExposure = function(params) {
        var container,
            domElements = [],
            scrollTop = 0,
            visualAreaHeight = 0,
            timeout = requestAnimationFrame || setTimeout;
        if (!params || !params.container) {
            container = window;
        } else {
            container = params.container;
        }
        throttle(onContainerScroll(container), 50, 100)
    }
})()
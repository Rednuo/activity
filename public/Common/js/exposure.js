const getQueryParams = (name, url) => {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

const publicUpLoadH5Appevent = (value) => {
    if(!value) return;
    try {
        if (getQueryParams('platform') === 'android') {
            value = decodeURIComponent(value);
            console.log( value )
            window.ZssqAndroidApi && window.ZssqAndroidApi.upLoadH5Appevent && window.ZssqAndroidApi.upLoadH5Appevent(value);
            window.ZssqApi && window.ZssqApi.upLoadH5Appevent && window.ZssqApi.upLoadH5Appevent(value);
        } else if (getQueryParams('platform') === 'ios') {
            value = decodeURIComponent(value);
            console.log( value )
            window.webkit && window.webkit.messageHandlers.ZssqApi.postMessage({
                action: 'upLoadH5Appevent',
                value: value
            })
        }
    } catch (error) {
        console.error(error)
    }
}

const publicUpLoadH5SensorsAppevent = (value) => {
    try {
        if( !value ){
            return false;
        }
        value = JSON.parse(decodeURIComponent(value));
        let event = value.event;
        delete value.event
        sensors.track(event, value)
    } catch (error) {
        console.error(error)
    }
}

const publicUpLoadExposure = (value, isValidateVisit) => {
    try {
        if( !value ){
            return false;
        }
        /*
            默认书籍曝光, RESOURCEBIT开头为资源位曝光
        */
        /*
            书籍曝光
            56fdfeba93abbf1f4738fcd4##女总裁的全能兵王##书城##男频精选##畅销精选##-1##5##false##-1##-1
            return {
                "book_id":"${item._id}",
                "book_name":"${item.title}",
                "is_vip_book":false,
                "is_finish_book":false,
                "is_freeread_book":false,
                "exposure_category1":"书城",
                "exposure_category2":"${codeAlias}",
                "exposure_category3":"${data.title}",
                "exposure_category4":"",
                "exposure_index":"${index+1}",
                "exposure_ismore":false,
                "booklist_id":null,
                "booklist_name":null,
                "community_id":null,
                "dashen_post_id":null,
                "shortage_answer_id":null,
                "zs_uid":null,
                "is_shortage_search":null
            }
        */

        /*
            资源位曝光
            RESOURCEBIT##书城可配置跳转的广告位节点##书籍详情##c-bookdetail##5721d80d843a87e12703f469##最强升级系统
            return {
                activity_category1:'书城可配置跳转的广告位节点',
                dest_name:'书籍详情',
                dest_key:'c-bookdetail',
                dest_id:'5721d80d843a87e12703f469',
                activity_name:'最强升级系统'
            }
        */

        /*
            页面item曝光
            KeyItemExpousure##{"event":"ZSKeyItemExpousure","page_item_category1":"社区","page_item_category2":"大神圈","page_item_category3":"大神圈首页","page_item_category4":"帖子item","page_item_category5":null,"is_validate_visit":false,"dashen_id":"5a9752839c10253a185e4491","post_id":"5ef16968f33c00007f004a84","exposure_index":8}
            return anything
        */

        function filterParams(params) {
            let temp = params.split('##'),
                result = {};
            if (temp[0] === 'KeyItemExpousure') {
                console.log(temp[1])
                let KeyItemExpousureParams = JSON.parse(temp[1]);
                KeyItemExpousureParams['is_validate_visit'] = isValidateVisit;
                return temp[0] + '##' + JSON.stringify(KeyItemExpousureParams);
            } else if (temp[0] === 'ZSKeyItemExpousure' || temp[0] === 'DashenItemExposure') {
                let KeyItemExpousureParams = JSON.parse(temp[1]),
                    page_item_category_1_2_key = KeyItemExpousureParams['page_item_category1']+'_$$_'+KeyItemExpousureParams['page_item_category2']+'_$$_'+KeyItemExpousureParams['page_item_category3'];
                KeyItemExpousureParams['is_validate_visit'] = isValidateVisit;
                KeyItemExpousureParams['page_first_visit'] = !localStorage.getItem(page_item_category_1_2_key);
                localStorage.setItem(page_item_category_1_2_key, true);
                return temp[0] + '##' + JSON.stringify(KeyItemExpousureParams);

            } else if (temp[0] === 'RESOURCEBIT') {
                result = {
                    activity_category1: temp[1],
                    activity_identifier: temp[2],
                    dest_name: temp[3],
                    dest_key: temp[4],
                    dest_id: temp[5],
                    activity_name: temp[6]
                }
            } else {
                result = {
                    "book_id": temp[0] === 'null' ? null : temp[0],
                    "book_name": temp[1] === 'null' ? null : temp[1],
                    "is_vip_book": temp[2] === 'true',
                    "is_finish_book": temp[3] === 'true',
                    "is_freeread_book": temp[4] === 'true',
                    "exposure_category1": temp[5] === 'null' ? null : temp[5],
                    "exposure_category2": temp[6] === 'null' ? null : temp[6],
                    "exposure_category3": temp[7] === 'null' ? null : temp[7],
                    "exposure_category4": temp[8] === 'null' ? null : temp[8],
                    "exposure_index": parseInt(temp[9], 10),
                    "exposure_ismore": temp[10] === 'null' ? null : temp[10],
                    "booklist_id": temp[11] === 'null' ? null : temp[11],
                    "booklist_name": temp[12] === 'null' ? null : temp[12],
                    "community_id": temp.length > 13 ? (temp[13] === 'null' ? null : temp[13]) : null,
                    "dashen_post_id": temp.length > 14 ? (temp[14] === 'null' ? null : temp[14]) : null,
                    "shortage_answer_id": temp.length > 15 ? (temp[15] === 'null' ? null : temp[15]) : null,
                    "zs_uid": temp.length > 16 ? (temp[16] === 'null' ? null : temp[16]) : null,
                    "is_shortage_search": temp.length > 17 ? (temp[17] === 'null' ? null : temp[17]) : null,
                }
            }
            return JSON.stringify(result);
        }

        if (getQueryParams('platform') === 'android') {
            let valueStr = decodeURIComponent(filterParams(value));
            if (value.match('ZSKeyItemExpousure|DashenItemExposure')) {
                console.log('Android KeyItem sensors: ' + valueStr);
                window.ZssqApi && window.ZssqApi.upLoadKeyItemExpousure && window.ZssqApi.upLoadKeyItemExpousure(valueStr.split('##')[1]);
            } else if (value.match('RESOURCEBIT')) {
                console.log('Android RESOURCEBIT sensors: ' + valueStr);
                window.ZssqApi && window.ZssqApi.upLoadResourceExposure && window.ZssqApi.upLoadResourceExposure(valueStr);
            } else {
                console.log('Android BOOK sensors: ' + valueStr);
                window.ZssqApi && window.ZssqApi.upLoadBookExposure && window.ZssqApi.upLoadBookExposure(valueStr);
            }
        } else if (getQueryParams('platform') === 'ios') {
            let valueStr = decodeURIComponent(filterParams(value));
            if (value.match('ZSKeyItemExpousure|DashenItemExposure')) {
                console.log(valueStr.split('##')[1]);
                window.webkit && window.webkit.messageHandlers.ZssqApi.postMessage({
                    action: 'upLoadKeyItemExpousure',
                    value: valueStr.split('##')[1]
                })
            }else if (value.match('RESOURCEBIT')) {
                console.log('iOS RESOURCEBIT sensors' + valueStr);
                window.webkit && window.webkit.messageHandlers.ZssqApi.postMessage({
                    action: 'upLoadResourceExposure',
                    value: valueStr
                })
            } else {
                console.log('iOS BOOK sensors' + valueStr);
                window.webkit && window.webkit.messageHandlers.ZssqApi.postMessage({
                    action: 'upLoadBookExposure',
                    value: valueStr
                })
            }
        }
    } catch (error) {
        console.error(error)
    }
}

const throttle = (fn, delay, mustRunDelay) => {
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

const getVisualAreaHeight = (container) => {
    return container !== window ? container.offsetHeight : (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight)
}

const onContainerScroll = (container) => {
    let domElements = [],
        scrollTop = 0,
        visualAreaHeight = 0,
        exposureFaultTolerantTop = 0;
    visualAreaHeight = getVisualAreaHeight(container);
    domElements = document.querySelectorAll('[data-exposure-pv="1"]');
    scrollTop = (container === window) ? (document.documentElement.scrollTop || document.body.scrollTop) : container.scrollTop;
    if (domElements.length > 0) {
        for (var i = 0; i < domElements.length; i++) {
            exposureFaultTolerantTop = +domElements[i].getAttribute('data-exposure-fault-tolerant-top') || 0;
            if ( domElements[i].getBoundingClientRect().width>0 && (visualAreaHeight - domElements[i].offsetHeight + exposureFaultTolerantTop >= domElements[i].getBoundingClientRect()['top'])) {
                domElements[i].setAttribute('data-exposure-pv', '0');
                publicUpLoadH5Appevent(domElements[i].getAttribute('data-exposure-params'));
                publicUpLoadExposure(domElements[i].getAttribute('data-exposure-sensors-params'), scrollTop > 0);
                publicUpLoadH5SensorsAppevent(domElements[i].getAttribute('data-exposure-h5sensors-params'));
            }
        }
    }
}

const onContainerHorizontalScroll = (container) => {
    let domElements = [],
        scrollLeft = 0,
        visualAreaWidth = container.offsetWidth,
        exposureFaultTolerantLeft = 0;

    domElements = container.querySelectorAll('[data-exposure-pv-horizontal="1"]');
    scrollLeft = container.scrollLeft;

    if (domElements.length > 0) {
        for (var i = 0; i < domElements.length; i++) {
            exposureFaultTolerantLeft = +domElements[i].getAttribute('data-exposure-fault-tolerant-left') || 0;
            if (visualAreaWidth - domElements[i].offsetWidth + exposureFaultTolerantLeft >= domElements[i].getBoundingClientRect()['left']) {
                domElements[i].setAttribute('data-exposure-pv-horizontal', '0');
                publicUpLoadH5Appevent(domElements[i].getAttribute('data-exposure-params'));
                publicUpLoadExposure(domElements[i].getAttribute('data-exposure-sensors-params'), scrollLeft > 0);
                publicUpLoadH5SensorsAppevent(domElements[i].getAttribute('data-exposure-h5sensors-params'));
            }
        }
    }
}

export const initExposure = (params) => {
    let container,
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
        container.onscroll = throttle(function() {
            onContainerScroll(container)
            params && params.callback && params.callback();
        }, 50, 100);
    }, 500)
}

export const setExposure = (params) => {
    let container,
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


export const setHorizontalExposure = (params) => {
    let timeout = requestAnimationFrame || setTimeout;
    throttle(onContainerHorizontalScroll(params.container), 50, 100)
}

export const initHorizontalExposure = (params) => {
    let timeout = requestAnimationFrame || setTimeout;
    timeout(function() {
        onContainerHorizontalScroll(params.container);
        params.container.onscroll = throttle(function() {
            onContainerHorizontalScroll(params.container)
        }, 50, 100);
    }, 500)
}

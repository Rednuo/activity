export const getQueryParams = (name, url) => {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
};

function tow(n) {
    return n >= 0 && n < 10 ? '0' + n : '' + n;
};

export const parseTime = (dateNow, dateEnd) => {
    var hours = "00";
    var minutes = "00";
    var seconds = Math.floor((dateEnd - dateNow) / 1000);
    if (seconds > 0) {
        hours = Math.floor(seconds / 3600);
        seconds = seconds % 3600;
        minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
    }
    return {
        hours: tow(hours),
        minutes: tow(minutes),
        seconds: tow(seconds)
    }
};

export const throttle = (fn, delay, mustRunDelay) => {
    var timer = null;
    var t_start;
    return function () {
        var context = this, args = arguments, t_curr = +new Date();
        clearTimeout(timer);
        if (!t_start) {
            t_start = t_curr;
        }
        if (t_curr - t_start >= mustRunDelay) {
            fn.apply(context, args);
            t_start = t_curr;
        }
        else {
            timer = setTimeout(function () {
                fn.apply(context, args);
            }, delay);
        }
    };
};


export const formatDate = (time) => {
    var date = new Date(time);
    var seperator1 = ".";
    var seperator2 = ".";
    var month = getNewDate(date.getMonth() + 1);
    var day = getNewDate(date.getDate());
    var hours = getNewDate(date.getHours());
    var minutes = getNewDate(date.getMinutes());
    var seconds = getNewDate(date.getSeconds());
    //统一格式为两位数
    function getNewDate(date) {
        if (date <= 9) {
            date = "0" + date;
        }
        return date;
    }

    var currentDate = date.getFullYear() + seperator1 + month + seperator1 + day;
        // " " + hours + seperator2 + minutes + seperator2 + seconds;
    return currentDate;
}

export const formatDateTime = (time) => {
    var date = new Date(time);
    var seperator1 = ".";
    var seperator2 = ":";
    var month = getNewDate(date.getMonth() + 1);
    var day = getNewDate(date.getDate());
    var hours = getNewDate(date.getHours());
    var minutes = getNewDate(date.getMinutes());
    var seconds = getNewDate(date.getSeconds());
    //统一格式为两位数
    function getNewDate(date) {
        if (date <= 9) {
            date = "0" + date;
        }
        return date;
    }

    var currentDate = date.getFullYear() + seperator1 + month + seperator1 + day +
        " " + hours + seperator2 + minutes;
    return currentDate;
}
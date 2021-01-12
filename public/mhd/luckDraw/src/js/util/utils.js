export const getQueryParams = (name, url) => {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
};

export const getDate = (dateTimeStamp = new Date()) => {
    let day = dateTimeStamp.getDate() < 10 ? '0' + dateTimeStamp.getDate() : dateTimeStamp.getDate(),
        month = dateTimeStamp.getMonth() + 1 < 10 ? '0' + (dateTimeStamp.getMonth() + 1) : dateTimeStamp.getMonth() + 1,
        year = dateTimeStamp.getFullYear(),
        result = year + '-' + month + '-' + day;
    return result;
}
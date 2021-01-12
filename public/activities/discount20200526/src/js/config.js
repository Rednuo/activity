let ENV = "pro",
    protocol = location.protocol.split(':')[0] + '://';

let baseUrl = (ENV === "pro") ? protocol + "api.zhuishushenqi.com" :
    (ENV === "test") ? protocol + "api.zhuishushenqi.com" : protocol + "localhost:3000";

let baseUrlNew = (ENV === "pro") ? protocol + "b.zhuishushenqi.com" :
    (ENV === "test") ? protocol + "b.zhuishushenqi.com" : protocol + "localhost:3000";

let baseUrlLql = (ENV === "pro") ? protocol + "api.zhuishushenqi.com" :
    (ENV === "test") ? protocol + "lql-api.testing.zhuishushenqi.com" : protocol + "localhost:3000";

let goldcoinUrl = (ENV === "pro") ? protocol + "goldcoin.zhuishushenqi.com" :
    (ENV === "test") ? protocol + "lf-api.testing.zhuishushenqi.com" : protocol + "localhost:3000";

export const url = {
    getBooks: baseUrlNew + '/category/info?node=',
    getAccount: baseUrl + '/user/account?token='
}


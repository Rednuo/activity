let ENV = "pro",
    protocol = location.protocol.split(':')[0] + '://';

let baseUrl = (ENV === "pro") ? protocol + "api.zhuishushenqi.com" :
    (ENV === "test") ? protocol + "lf-api.testing.zhuishushenqi.com" : protocol + "localhost:3000";

let baseUrlNew = (ENV === "pro") ? protocol + "b.zhuishushenqi.com" :
    (ENV === "test") ? protocol + "test.b.zhuishushenqi.com" : protocol + "localhost:3000";

let goldcoinUrl = (ENV === "pro") ? protocol + "goldcoin.zhuishushenqi.com" :
    (ENV === "test") ? protocol + "lf-goldcoin.testing.zhuishushenqi.com" : protocol + "localhost:3000";

export const url = {
    getBookPriceInfo: baseUrl + '/book/',
    getBookListNode: baseUrlNew + '/category/info?node=',
    getAccount: baseUrl + '/user/account?token=',
    getBookShelf: baseUrl + '/user/bookshelf',
}
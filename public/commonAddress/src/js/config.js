let ENV = "pro",
    protocol = location.protocol.split(':')[0] + '://';

let goldUrl = (ENV === "pro") ? protocol + "goldcoin.zhuishushenqi.com" :
    (ENV === "test") ? protocol + "dongfei-gold-api.testing.zhuishushenqi.com" : protocol + "localhost:3000";

let goldcoinUrlNew = (ENV === "pro") ? protocol + "activitynew.zhuishushenqi.com" :
    (ENV === "test") ? protocol + "zhq-go-gold.testing.zhuishushenqi.com" : protocol + "localhost:3000";

export const url = {
    account: goldUrl+ '/account',
    postAccountInfo: goldUrl + '/account/info',
    postAccountInfoNew: goldcoinUrlNew + '/gold/activity/christmas/recipient'

}
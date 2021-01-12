var baseUrl = location.protocol.split(':')[0] + '://' + 'mhdpay.1391.com';
// var baseUrl = location.protocol.split(':')[0] + '://' + '192.168.21.154:3280';
// var baseUrl = location.protocol.split(':')[0] + '://' + '192.168.21.154';
var payUrl = location.protocol.split(':')[0] + '://' + 'pay.manhuadao.cn';
// var payUrl = location.protocol.split(':')[0] + '://' + '106.75.50.192';
// var payUrl = location.protocol.split(':')[0] + '://' + '192.168.21.154';
let mhdParam='?apptype=8&realapptype=13&appversion=1&channel=web-app';
let yqParam='?apptype=8&realapptype=13&appversion=1&channel=web-app';
export const config = {
  //   获取用户账户信息
  account: baseUrl + '/UserAccount/GetUserAccountInfo'+mhdParam,
  //获取用户账户信息(元气 大全)
  GetUserAccountAdInfo: payUrl + '/UserAccount/GetUserAccountAdInfo'+yqParam,

  //获取票券数量
  ticketAmount: baseUrl +'/userticket/GetTicketAmount',
  //所有中奖记录
  lucklyAllRecord: baseUrl + '/ActivityDraw/GetPrizeLog',
  //我的中奖记录
  lucklyMyRecord: baseUrl + '/ActivityDraw/GetUserPrize',
  // 抽奖信息
  getActivityInfo:baseUrl+'/ActivityDraw/CheckDrawStatus',
  //抽奖
  lucklyGift: baseUrl + '/ActivityDraw/StartRotate',
  //免费抽奖
  freeLucklyGift: baseUrl + '/ActivityDraw/StartFreeRotate',
  //分享成功回调
  sharePrize: baseUrl + '/ActivityDraw/SharePrize',
  //判断第一次抽奖
  isFirst:baseUrl + '/ActivityDraw/IsFirstLuckDraw',
 //每日签到获取欧气信息
  getOuqiInfo: payUrl + '/ActivityDrawOuqi/GetUserOuqiSign?apptype=8&realapptype=13&appversion=1&channel=web-app',
  //用户元气糖兑换欧气
  exchangeOuqi: payUrl + '/ActivityDrawOuqi/ExchangeOuqi?apptype=8&realapptype=13&appversion=1&channel=web-app',
  //用户欧气许愿瓶抽奖
  startRotate: payUrl + '/ActivityDrawOuqi/StartRotate?apptype=8&realapptype=13&appversion=1&channel=web-app',

};
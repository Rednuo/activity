<script language=javascript>
var mebtnopenurl = 'http://game2.id87.com/';
window.shareData = {
    "imgUrl": "./icon.png",
    "timeLineLink": "http://game2.id87.com/xiaoniaofeifei/",
    "tTitle": "小鸟飞飞飞-微资源娱乐小游戏",
    "tContent": "从前有一只鸟，飞着飞着就死了。"
};
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {

  WeixinJSBridge.on('menu:share:appmessage', function(argv) {
      WeixinJSBridge.invoke('sendAppMessage', {
          "img_url": window.shareData.imgUrl,
          "link": window.shareData.timeLineLink,
          "desc": window.shareData.tContent,
          "title": window.shareData.tTitle
      }, function(res) {
        document.location.href = mebtnopenurl;
      })
  });

  WeixinJSBridge.on('menu:share:timeline', function(argv) {
      WeixinJSBridge.invoke('shareTimeline', {
          "img_url": window.shareData.imgUrl,
          "img_width": "640",
          "img_height": "640",
          "link": window.shareData.timeLineLink,
          "desc": window.shareData.tContent,
          "title": window.shareData.tTitle
      }, function(res) {
        document.location.href = mebtnopenurl;
      });
  });
}, false);
function dp_submitScore(a,b){
  if(a&&b>=a&&b>10){
    //alert("新纪录哦！你过了"+b+"关!")
    dp_share(b)
  }
}
function dp_Ranking(){
    document.location.href = mebtnopenurl;
}
function dp_share(t){
  document.title = "我玩小鸟飞飞飞过了"+t+"关！你能超过洒家我吗？";
  document.getElementById("share").style.display="";
  window.shareData.tTitle = document.title;
}
</script>
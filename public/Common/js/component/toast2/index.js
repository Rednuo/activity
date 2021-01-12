require('./index.scss');
import Vue from 'vue'

let Toast = {};

Toast.show = function (toast, params) {
    let option = {
        duration: "1000",
    }
    // 使用params的配置
    for (let i in params) {
        option[i] = params[i]
    }
    // 如果页面有toast则不继续执行
    if (document.querySelector('.c-toast')) return;
    // 1、创建构造器，定义好提示信息的模板
    let toastTip = Vue.extend({
        template: `<div class="c-toast animated"><span>${toast}</span></div>`
    });
    // 2、创建实例，挂载到文档以后的地方
    let tpl = new toastTip().$mount().$el;
    // 3、把创建的实例添加到body中
    document.body.appendChild(tpl);
    // 4.设定秒后移除
    setTimeout(() => {
        tpl.classList.add('fadeOut')
        setTimeout(()=>{
            document.body.removeChild(tpl);
        },1000)
    }, option.duration);

};

export default Toast;
require('./index.scss');
import Vue from 'vue'

let Loader = {};

Loader.show = function ( params ) {
    let option = {
        position:'fixed',
        background:'transparent',
        zIndex: 9999
    }
    for (let i in params) {
        option[i] = params[i]
    }
    if (document.querySelector('.c-loader-wraper')) return;
    let toastTip = Vue.extend({
        data:function(){
            return {
                option:option
            }
        },
        template:   `<div class="c-loader-wraper" :style="{position:option['position'],background:option['background'],zIndex:option['zIndex']}">
                        <div class="loader-inner">
                            <div class="c-loader"></div>
                        </div>
                    </div>`
    });
    let tpl = new toastTip().$mount().$el;
    document.body.appendChild(tpl);
};

Loader.hide = function () {
    let loaderEle = document.querySelector('.c-loader-wraper');
    if( !loaderEle ){
        return;  
    } 
    document.body.removeChild(loaderEle);
};


export default Loader;
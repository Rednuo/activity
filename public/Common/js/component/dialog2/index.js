require('./index.scss');
import Vue from 'vue'

let Dialog = {};

/*
DEMO:
Dialog.alert('下架后该书籍将不会为您做保留确认下架所选中的书籍吗？',function(){
    alert('你点击了确定按钮');
})
*/
Dialog.alert = function (message, callback) {
    let tpl,
        option = {
            message:message||'',
            callback : callback || function(){}
        }

    if (document.querySelector('.c-dialog-wraper')) return;

    let alertDialog = Vue.extend({
        methods:{
            onButtonClick:function(){
                document.body.removeChild(tpl);
                option.callback();
            }
        },
        template:  `<div class="c-dialog-wraper">
                        <div class="c-dialog-inner animated bounceIn">
                            <div class="content">
                                <p class="message">${option.message}</p>
                            </div>
                            <div class="bottom">
                                <span @click="onButtonClick()">确定</span>
                            </div>
                        </div>
                    </div>`
    });
    tpl = new alertDialog().$mount().$el;
    document.body.appendChild(tpl);
};

/*
DEMO:
Dialog.confim('下架后该书籍将不会为您做保留确认下架所选中的书籍吗？',function(){
    alert('你点击了确定按钮');
},function(){
    alert('你点击了取消按钮');
})
*/
Dialog.confim = function (message, onSureCallback, onCancelCallback,sureBtnText,cancelBtnText) {
    let tpl,
        option = {
            message:message||'',
            onSureCallback: onSureCallback || function(){},
            onCancelCallback: onCancelCallback || function(){}
        }

    if (document.querySelector('.c-dialog-wraper')) return;

    let confimDialog = Vue.extend({
        methods:{
            onSureButtonClick:function(){
                document.body.removeChild(tpl);
                option.onSureCallback();
            },
            onCancelButtonClick:function(){
                document.body.removeChild(tpl);
                option.onCancelCallback();
            }
        },
        template:  `<div class="c-dialog-wraper">
                        <div class="c-dialog-inner animated bounceIn">
                            <div class="content">
                                <p class="message">${option.message}</p>
                            </div>
                            <div class="bottom confim">
                                <span @click="onCancelButtonClick()">${cancelBtnText||'取消'}</span>
                                <span @click="onSureButtonClick()">${sureBtnText||'确定'}</span>
                            </div>
                        </div>
                    </div>`
    });
    tpl = new confimDialog().$mount().$el;
    document.body.appendChild(tpl);
};

/*
DEMO:
Dialog.edit('编辑推荐语',{
    value:'',
    success:function( value ){
        
    }
})*/
Dialog.edit = function (title, params) {
    let tpl,
        option = {
            title:title || '',
            value:params.value || '',
            max:params.max || 30,
            onSureCallback: params.success || function(){},
            onCancelCallback: params.cancel || function(){}
        }

    if (document.querySelector('.c-dialog-wraper')) return;

    let editDialog = Vue.extend({
        data:function(){
            return {
                value:option.value
            }
        },
        methods:{
            onSureButtonClick:function(){
                let value = this.value;
                document.body.removeChild(tpl);
                if( option.value !== this.value ){
                    option.onSureCallback( value );
                }
            },
            onCancelButtonClick:function(){
                document.body.removeChild(tpl);
                option.onCancelCallback();
            }
        },
        template:  `<div class="c-dialog-wraper">
                        <div class="c-dialog-inner edit-dialog-height animated bounceIn">
                            <div class="edit">
                                <h4 class="title">${option.title}</h4>
                                <div class="textarea">
                                    <textarea :placeholder="value||'请输入推荐语'" v-model="value" maxlength="${option.max}"></textarea>
                                </div>
                            </div>
                            <div class="bottom confim">
                                <span @click="onCancelButtonClick()">取消</span>
                                <span @click="onSureButtonClick()">确定</span>
                            </div>
                        </div>
                    </div>`
    });
    tpl = new editDialog().$mount().$el;
    document.body.appendChild(tpl);
};

/*
DEMO:
Dialog.fullAlert('提示','下架后该书籍将不会为您做保留确认下架所选中的书籍吗？','确定',function(){
   
},function(){
    
})
*/
Dialog.fullAlert = function (title, message, btnText, onSureCallback, onCancelCallback) {
    let tpl,
        option = {
            title:title||'提示',
            message:message||'',
            btnText:btnText||'确定',
            onSureCallback : onSureCallback || function(){},
            onCancelCallback : onCancelCallback || function(){},
        }

    if (document.querySelector('.c-dialog-wraper-v2')) return;

    let fullAlertDialog = Vue.extend({
        methods:{
            onButtonClick:function(){
                document.body.removeChild(tpl);
                option.onSureCallback();
            },
            onCancelClick:function(){
                document.body.removeChild(tpl);
                option.onCancelCallback();
            },
        },
        template:  `<div class="c-dialog-wraper-v2" @click.self="onCancelClick()">
                        <div class="c-dialog-inner animated bounceIn">
                            <h4 class="title">${option.title}</h4>
                            <div class="content">
                                <p class="message">${option.message}</p>
                            </div>
                            <div class="bottom">
                                <span @click="onButtonClick()">${option.btnText}</span>
                            </div>
                        </div>
                    </div>`
    });
    tpl = new fullAlertDialog().$mount().$el;
    document.body.appendChild(tpl);
};
export default Dialog;
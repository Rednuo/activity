require('./index.scss');
import Vue from 'vue'


const cover = {
    install: function (Vue) {
        Vue.component('Cover', {
            props: ['width','height','url','contentType','allowMonthly','allowFree','superscript','isSerial','onlyShowFreeIcon','position'],
            computed:{
                leftTopClassName:function(){
                    if( this.allowMonthly && !this.onlyShowFreeIcon ){
                        return 'vip';
                    }else if( this.allowFree ){
                        return 'free';
                    }
                },
                leftBottomClassName: function(){
                    if(this.contentType === 'picture'){
                        return 'picture';
                    }
                },
                positionStyle: function(){
                    return this.position==='absolute' ? {'position':'absolute', 'top':'0', 'left':'0'} : {};
                },
                rightTopClassName: function(){
                    if( this.superscript === 'exclusive' ){
                        return 'exclusive';   
                    }else if( this.superscript === 'firstlaunch' ){
                        return 'firstlaunch';   
                    }else if( this.isSerial === false ){
                        return 'complete';   
                    }
                }
            },
            template: `
                <div class="c-cover" v-bind:style="positionStyle">
                    <img :src="url+'?imageMogr2/thumbnail/'+width+'x'+height"/>
                    <span v-show="leftTopClassName" :class="'left-top-icon '+leftTopClassName"></span>
                    <span v-show="leftBottomClassName" :class="'left-top-icon '+leftBottomClassName"></span>
                    <span :class="'right-top-icon '+rightTopClassName"></span>
                </div>
            `
        })
    }
}


export default cover;
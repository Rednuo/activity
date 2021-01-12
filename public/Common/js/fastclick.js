import FastClick from 'fastclick'


const fastclick = {
    init : function(){
        if ('addEventListener' in document) {
            document.addEventListener('DOMContentLoaded', function() {
                FastClick.attach(document.body);
            }, false);
        }
    }
}

export default fastclick;
import "../css/index.scss";
require('es6-promise').polyfill();

import Vue from 'vue'
import HybridApi from '../../../common/js/hybrid';

new Vue({
  el: '#J_pageCCGWraper',
  data: {},
  methods: {
    openComicDetail(id) {
      console.log(id);
      HybridUtil.request({
        action: 'comicDetail',
        param: {
          storeBookId: id,
        }
      });
    }
  }
})
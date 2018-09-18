// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import validator from 'vue-validator'
import infiniteScroll from 'vue-infinite-scroll'
import 'element-ui/lib/theme-chalk/index.css';
import vueXlsxTable from 'vue-xlsx-table'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import App from './App'
import router from './router'
import store from './store'
// import axios from './config/axios'
Vue.use(validator);
Vue.use(infiniteScroll);
Vue.use(ElementUI);
Vue.use(VueI18n);
Vue.use(vueXlsxTable, {rABS: false}) //HTML5 FileReader API 有两个方法可以读取本地文件 readAsBinaryString 和 readAsArrayBuffer, 默认rABS为true，也就是使用readAsBinaryString

const i18n = new VueI18n({
  locale: 'CN',    // 语言标识
  messages: {
    'CN': require('./lang/zh'),   // 中文语言包
    'EN': require('./lang/en'),    // 英文语言包
  },
});

// Vue.http = Vue.prototype.$http = axios;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  i18n,
  store,
  router,
  components: { App },
  template: '<App/>'
}).$mount('#app')

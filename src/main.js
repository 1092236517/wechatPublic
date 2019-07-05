// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './vuex/store'
import MintUI from 'mint-ui'
import CommonJs from './util/common'
import 'mint-ui/lib/style.css'
import '../src/assets/less/flexible.less'
//import VConsole from 'vconsole' //import vconsole



import 'babel-polyfill' 
import Es6Promise from 'es6-promise' 
require('es6-promise').polyfill() 
Es6Promise.polyfill()
//let vConsole = new VConsole() // 初始化

Vue.use(MintUI)
// Vue.use(CommonJs)
CommonJs.install(Vue)

//const host = process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : "http://hsapi.zhuniu.com" 

// http://api.jp.test.zhuniu.com
// 根据 process.env.NODE_ENV 的值判断当前是什么环境

const instance = axios.create({
    baseURL: "http://hsapi.zhuniu.com/",
})
Vue.prototype.$http = instance

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
});


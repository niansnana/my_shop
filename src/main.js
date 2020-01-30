import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'

import axios from 'axios'
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/' // 配置请求的根路径
axios.interceptors.request.use(config => {
  // console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // 在最后必须renturn config
  return config;
})
Vue.prototype.$http = axios

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)
// 导入全局css样式
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// 全局引入elementUI
import elementUI from 'element-ui'
// 引入css
import 'element-ui/lib/theme-chalk/index.css'

// 重置样式
import './assets//css/reset.css'

// 使用插件
Vue.use(elementUI);

// 原型挂载一个imgurl的地址
Vue.prototype.$imgUrl = 'http://localhost:3000'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

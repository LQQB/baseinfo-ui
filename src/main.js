import Vue from 'vue'
import App from './App'
import api from './http'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import i18n from './i18n'
import 'element-ui/lib/theme-chalk/index.css'
import global from '@/utils/global'
Vue.use(ElementUI)
Vue.use(api)

Vue.prototype.global = global
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
});

import App from './App'
import uviewPlus from '@/uni_modules/uview-plus'
import './api/mock.js'
import pinia from './store'; // 导入Pinia实例
import './permission' // permission
import { setupI18n } from './i18n'
// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  app.use(uviewPlus)
  app.use(pinia)
  setupI18n(app)
  return {
    app
  }
}
// #endif
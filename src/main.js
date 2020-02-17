import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store/CentralStore'
import vuetify from './plugins/vuetify'
import VueAxios from 'vue-axios'
import { securedAxiosInstance, plainAxiosInstance } from './backend/axios'

Vue.config.productionTip = false

Vue.use(VueAxios, {
  secured: securedAxiosInstance,
  plain: plainAxiosInstance
})
Vue.config.productionTip = false

new Vue({
  router,
  store,
  securedAxiosInstance,
  plainAxiosInstance,
  vuetify,
  render: h => h(App)
}).$mount('#app')

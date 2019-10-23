// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueAxios from 'vue-axios'
import { securedAxiosInstance, plainAxiosInstance } from './backend/axios'
import Vuetify from 'vuetify'
import VueAnalytics from 'vue-analytics'

import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader
import './assets/styles/main.less'
import './stylus/main.styl'

Vue.use(VueAnalytics, {
  id: 'UA-146054838-1',
  router,
  ignoreRoutes: ['admin', 'signin']
})
Vue.use(Vuetify, {
  theme: {
    main: '#45aaf2',
    button: '#45aaf2',
    accent: '#45aaf2',
    buttontext: '#FFFFFF',
    titlebartext: '#FFFFFF',
    error: '#fc5c65'
  }
})
Vue.config.productionTip = false
Vue.use(VueAxios, {
  secured: securedAxiosInstance,
  plain: plainAxiosInstance
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  securedAxiosInstance,
  plainAxiosInstance,
  components: { App },
  template: '<v-app><App/></v-app>'
})

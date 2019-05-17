import Vue from 'vue'
import Vuex from 'vuex'
import { securedAxiosInstance, plainAxiosInstance } from './backend/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    secured: securedAxiosInstance,
    plain: plainAxiosInstance
  },
  mutations: {
    signedIn () {
      return localStorage.signedIn
    },
    updateLinks (state, link) {
      this.state.links.push(link)
    }
  },
  actions: {

  }
})

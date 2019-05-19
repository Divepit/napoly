import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    globalTypes: [],
    dispError: ''
  },
  mutations: {
    signedIn () {
      return localStorage.signedIn
    },
    updateLinks (state, link) {
      state.links.push(link)
    }
  },
  actions: {

  }
})

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    globalTypes: [],
    dispError: '',
    semester: '1',
    field: '',
    year: ''
  },
  mutations: {
    signedIn () {
      return localStorage.signedIn
    }
  },
  actions: {

  }
})

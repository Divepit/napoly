import Vue from 'vue'
import Vuex from 'vuex'
import napolyApiModule from './modules/napolyApi'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    napolyApiModule
  },
  state: {
    loading: false,
    noresult: false,
    signedIn: localStorage.signedIn,
    showToolbar: true,
    message: {
      active: false,
      timeout: 4000,
      text: 'Empty',
      color: 'warning'
    }
  },
  mutations: {
  }
})

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
    messageSetter (value) {
      this.state.message.active = value
    },
    setMessage (text, color) {
      this.state.message.text = text
      this.state.message.color = color
      this.state.message.active = true
    }
  }
})

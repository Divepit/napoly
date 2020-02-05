import Vue from 'vue'
import Vuex from 'vuex'
import napolyApiModule from './modules/napolyApi'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    napolyApiModule
  }
})

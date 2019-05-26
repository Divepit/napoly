import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    globalTypes: [],
    dispError: '',
    semester: localStorage.semester,
    field: '',
    year: ''
  },
  mutations: {
    signedIn () {
      return localStorage.signedIn
    },
    updateSemester (state, semester) {
      state.semester = semester
    }
  },
  actions: {

  }
})

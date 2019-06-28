import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    globalTypes: [],
    dispError: '',
    semester: localStorage.semester,
    field: localStorage.field,
    year: localStorage.year,
    signer: localStorage.signedIn,
    subjects: []
  },
  mutations: {
    updateSemester (state, semester) {
      state.semester = semester
    },
    updateField (state, field) {
      state.field = field
    }
  },
  actions: {

  }
})

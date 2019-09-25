import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    globalTypes: [],
    dispError: '',
    semester: localStorage.semester ? parseInt(localStorage.semester, 10) : 1,
    field: localStorage.field ? parseInt(localStorage.field, 10) : 1,
    year: localStorage.year ? parseInt(localStorage.year, 10) : 1,
    signer: localStorage.signedIn,
    admin: parseInt(localStorage.admin, 10),
    subjects: [],
    dark: false,
    userField: parseInt(localStorage.userField, 10),
    loadingSubjects: false
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

import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    globalTypes: [],
    dispError: '',
    semester: localStorage.semester ? localStorage.semester : 1,
    field: localStorage.field ? localStorage.field : 1,
    year: localStorage.year ? localStorage.year : 1,
    signer: localStorage.signedIn,
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

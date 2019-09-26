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
    loadingSubjects: false,
    color: localStorage.color ? parseInt(localStorage.color, 10) : 5,
    colors: ['#fc5c65', '#fd9644', '#fed330', '#26de81', '#2bcbba', '#45aaf2', '#4b7bec', '#a55eea', '#d1d8e0', '#778ca3', '#4b6584', '#3d3d3d']

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

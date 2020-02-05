import Vue from 'vue'
import Vuex from 'vuex'
import { securedAxiosInstance } from '../backend/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    semesters: [],
    currentSemesterId: localStorage.currentSemesterId,
    subjects: [],
    fields: [],
    currentFieldId: localStorage.currentFieldId,
    currentYear: localStorage.currentYear
  },
  mutations: {
  },
  actions: {
    setCurrentSemester ({ dispatch, commit }, payload) {
      localStorage.currentSemesterId = payload
      this.state.currentSemesterId = payload
      dispatch('getSubjects')
    },
    setCurrentYear ({ dispatch, commit }, payload) {
      localStorage.currentYear = payload
      this.state.currentYear = payload
      dispatch('getSubjects')
    },
    setCurrentField ({ dispatch, commit }, payload) {
      localStorage.currentFieldId = payload
      this.state.currentFieldId = payload
      dispatch('getSubjects')
    },
    getSemesters () {
      securedAxiosInstance.get('https://api.napoly.ch/api/v1/semesters').then(response => {
        this.state.semesters = response
      })
    },
    getFields () {
      securedAxiosInstance.get('https://api.napoly.ch/api/v1/fields').then(response => {
        this.state.fields = response
      })
    },
    getSubjects () {
      this.state.subjects = []
      securedAxiosInstance.get('https://api.napoly.ch/api/v1/subjects')
        .then(response => {
          response.data.forEach((subject) => {
            let sem = subject.semester_id.toString() === this.state.currentSemesterId.toString()
            let field = subject.field_id.toString() === this.state.currentFieldId.toString()
            let year = subject.year.toString() === this.state.currentYear.toString()
            if (sem && field && year) {
              this.state.subjects.push(subject)
            }
          })
        })
    }
  },
  modules: {
  }
})

import { securedAxiosInstance } from '../../backend/axios'

const napolyApiModule = {
  namespaced: true,
  state: {
    semesters: [],
    currentSemesterId: parseInt(localStorage.currentSemesterId, 10),
    currentSemesterName: '',
    subjects: [],
    fields: [],
    currentFieldId: localStorage.currentFieldId,
    currentFieldName: '',
    currentYear: localStorage.currentYear,
    changingYear: false,
    changingField: false,
    changingSemester: false
  },
  mutations: {
    changeSemesterName () {
      var sem = napolyApiModule.state.currentSemesterId - 1
      var year = napolyApiModule.state.semesters.data[sem].semesterYear
      sem = napolyApiModule.state.semesters.data[sem].semesterHalf === 1 ? 'FS ' : 'HS '
      napolyApiModule.state.currentSemesterName = sem + year
    }
  },
  actions: {
    setCurrentSemester ({ dispatch, commit }, payload) {
      localStorage.currentSemesterId = payload
      napolyApiModule.state.currentSemesterId = payload
      dispatch('getSubjects')
      commit('changeSemesterName')
      napolyApiModule.state.changingSemester = false
    },
    setCurrentYear ({ dispatch, commit }, payload) {
      localStorage.currentYear = payload
      napolyApiModule.state.currentYear = payload
      dispatch('getSubjects')
      napolyApiModule.state.changingYear = false
    },
    setCurrentField ({ dispatch, commit }, payload) {
      localStorage.currentFieldId = payload
      napolyApiModule.state.currentFieldId = payload
      dispatch('getSubjects')
      napolyApiModule.state.currentFieldName = napolyApiModule.state.fields.data[napolyApiModule.state.currentFieldId - 1].fieldName
      napolyApiModule.state.changingField = false
    },
    getSemesters ({ commit }) {
      securedAxiosInstance.get('https://api.napoly.ch/api/v1/semesters').then(response => {
        napolyApiModule.state.semesters = response
        commit('changeSemesterName')
      })
    },
    getFields () {
      securedAxiosInstance.get('https://api.napoly.ch/api/v1/fields').then(response => {
        napolyApiModule.state.fields = response
        napolyApiModule.state.currentFieldName = response.data[napolyApiModule.state.currentFieldId].fieldName
      })
    },
    getSubjects () {
      napolyApiModule.state.subjects = []
      securedAxiosInstance.get('https://api.napoly.ch/api/v1/subjects')
        .then(response => {
          response.data.forEach((subject) => {
            let sem = subject.semester_id.toString() === napolyApiModule.state.currentSemesterId.toString()
            let field = subject.field_id.toString() === napolyApiModule.state.currentFieldId.toString()
            let year = subject.year.toString() === napolyApiModule.state.currentYear.toString()
            if (sem && field && year) {
              napolyApiModule.state.subjects.push(subject)
            }
          })
        })
    }
  }
}

export default napolyApiModule

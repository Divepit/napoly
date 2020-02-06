import { plainAxiosInstance } from '../../backend/axios'

const napolyApiModule = {
  namespaced: true,
  state: {
    // Current Values
    currentSemesterId: parseInt(localStorage.currentSemesterId, 10),
    currentFieldId: localStorage.currentFieldId,
    currentYear: localStorage.currentYear,
    currentSemesterName: '',
    currentFieldName: '',
    // Arrays
    subjects: [],
    fields: [],
    semesters: [],
    types: [],
    // Action Variables
    changingYear: false,
    changingField: false,
    changingSemester: false
  },
  mutations: {
    // This mutation changes the currentSemesterName variable to FS/HS + year of the currently selected semester ID
    changeSemesterName () {
      var sem = napolyApiModule.state.currentSemesterId - 1 // Note that our API for some reason starts arrays ar 1...
      var year = napolyApiModule.state.semesters.data[sem].semesterYear
      sem = napolyApiModule.state.semesters.data[sem].semesterHalf === 1 ? 'FS ' : 'HS '
      napolyApiModule.state.currentSemesterName = sem + year
    }
  },
  actions: {
    // This action sets the currentSemesterId variable to the currently selected semester
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
      plainAxiosInstance.get('https://api.napoly.ch/api/v1/semesters').then(response => {
        napolyApiModule.state.semesters = response
        commit('changeSemesterName')
      })
    },
    getFields () {
      plainAxiosInstance.get('https://api.napoly.ch/api/v1/fields').then(response => {
        napolyApiModule.state.fields = response
        napolyApiModule.state.currentFieldName = response.data[napolyApiModule.state.currentFieldId - 1].fieldName
      })
    },
    getTypes () {
      plainAxiosInstance.get('https://api.napoly.ch/api/v1/types').then(response => {
        response.data.forEach(type => {
          napolyApiModule.state.types.push(type.typeName)
        })
      })
    },
    getSubjects () {
      napolyApiModule.state.subjects = []
      this.state.loading = true
      this.state.noresult = false
      plainAxiosInstance.get('https://api.napoly.ch/api/v1/subjects')
        .then(response => {
          response.data.forEach((subject) => {
            let sem = subject.semester_id.toString() === napolyApiModule.state.currentSemesterId.toString()
            let field = subject.field_id.toString() === napolyApiModule.state.currentFieldId.toString()
            let year = subject.year.toString() === napolyApiModule.state.currentYear.toString()
            if (sem && field && year) {
              napolyApiModule.state.subjects.push(subject)
            }
          })
          this.state.loading = false
          if (napolyApiModule.state.subjects.length === 0) {
            this.state.noresult = true
          }
        })
    }
  }
}

export default napolyApiModule

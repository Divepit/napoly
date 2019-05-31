<template lang="html">
  <div class="">
    <v-container fluid>

    <v-radio-group v-model="semester" class="mt">
      <v-radio v-for="s in semesters" :key="s.id" :label="'Semester' + s.id" :value="s.id" ></v-radio>
    </v-radio-group>
    <v-radio-group v-model="field">
      <v-radio v-for="f in fields" :key="f.id" :label="'Field' + f.id" :value="f.id"></v-radio >
    </v-radio-group>
    <v-radio-group v-model="year">
      <v-radio v-for="y in years" :key="y" :label="'Year' + y" :value="y"></v-radio >
    </v-radio-group>
    <h3>Year {{year}}, {{fieldName}}, {{printSemester}}</h3>
    <SubjectList v-bind:year="this.$store.state.year" v-bind:semester="this.$store.state.semester" v-bind:field="this.$store.state.field"></SubjectList>

  </v-container>

    </div>
</template>

<script>
import SubjectList from '@/components/SubjectList'
import {mapState} from 'vuex'
export default {
  components: {
    SubjectList
  },
  data () {
    return {
      semesters: [],
      fields: [],
      rawSemester: '',
      rawField: '',
      fieldName: '',
      printSemester: '',
      newSemesterHalf: '',
      newSemesterYear: '',
      addingSemester: false,
      years: [1, 2, 3],
      year: ''
    }
  },
  created () {
    this.getSemesters()
    this.getSemesterName()
    this.getFields()
    this.getFieldName()
    this.year = this.$store.state.year
  },
  computed: {
    ...mapState([
    ]),
    semester: {
      get () {
        return this.$store.state.semester
      },
      set (value) {
        this.$store.commit('updateSemester', value)
      }
    },
    field: {
      get () {
        return this.$store.state.field
      },
      set (value) {
        this.$store.commit('updateField', value)
      }
    }
  },
  methods: {

    getSemesterName () {
      this.$http.secured.get('/api/v1/semesters/' + this.semester)
        .then(response => {
          this.rawSemester = response.data
          this.convertRawSemester()
        })
    },
    getFieldName () {
      this.$http.secured.get('/api/v1/fields/' + this.field)
        .then(response => {
          this.rawField = response.data
          this.fieldName = response.data.fieldName
        })
    },
    getSemesters () {
      this.$http.secured.get('/api/v1/semesters/')
        .then(response => {
          this.semesters = response.data
        })
    },
    getFields () {
      this.$http.secured.get('/api/v1/fields/')
        .then(response => {
          this.fields = response.data
        })
    },
    exitAdding () {
      this.addingSemester = false
      this.newSemesterHalf = ''
      this.newSemesterYear = ''
    },
    addSemester () {
      if (!this.newSemesterHalf || !this.newSemesterYear) {
        this.exitAdding()
        console.log('Not enough info given')
        return
      }
      this.$http.secured.post('/api/v1/semesters/', {
        semester: {
          semesterHalf: this.newSemesterHalf,
          semesterYear: this.newSemesterYear
        }
      })

        .then(response => {
          this.semesters.push(response.data)
          this.exitAdding()
        })

        .catch(error => this.setError(error, 'Cannot create Semester'))
    },
    convertRawSemester () {
      var prefix
      if (this.rawSemester.semesterHalf === 1) {
        prefix = 'FS'
      } else if (this.rawSemester.semesterHalf === 2) {
        prefix = 'HS'
      } else {
        console.log('Semester error')
      }
      this.printSemester = prefix + ' ' + this.rawSemester.semesterYear
    },
    putYear () {
      this.$store.state.year = this.year
    }
  },
  watch: {
    semester: function (val) {
      this.getSemesterName()
      localStorage.semester = this.semester
    },
    field: function (val) {
      this.getFieldName()
      localStorage.field = this.field
    },
    year: function (val) {
      this.putYear()
      localStorage.year = this.year
    }
  }
}
</script>
<style media="screen">
  .mt {
    margin-top: 50px;
  }
</style>

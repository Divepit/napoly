<template lang="html">
    <v-container >
      <v-layout align-top>
        <v-flex xs2>
          <v-radio-group v-model="semester" class="mt">
            <v-radio v-for="s in semesters" :key="s.id" :label="'Semester' + s.id" :value="s.id" ></v-radio>
          </v-radio-group>
        </v-flex>
        <v-flex xs2>
          <v-radio-group v-model="field" class="mt">
            <v-radio v-for="f in fields" :key="f.id" :label="'Field' + f.id" :value="f.id"></v-radio >
          </v-radio-group>
        </v-flex>
        <v-flex xs2>
          <v-radio-group v-model="year" class="mt">
            <v-radio v-for="y in years" :key="y" :label="'Year' + y" :value="y"></v-radio >
          </v-radio-group>
        </v-flex>
    </v-layout>
    <hr>
    <br>
    <h3>Year {{year}}, {{fieldName}}, {{printSemester}}</h3>
    <br>
    <SubjectList v-bind:year="this.$store.state.year" v-bind:semester="this.$store.state.semester" v-bind:field="this.$store.state.field"></SubjectList>

  </v-container>
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

/*RADIOS*/
  .inputGroup {
  background-color: #fff;
  display: block;
  margin: 10px 0;
  position: relative;
}
.inputGroup label {
  padding: 12px 30px;
  width: 100%;
  display: block;
  text-align: left;
  color: #3C454C;
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition: color 200ms ease-in;
  overflow: hidden;
}
.inputGroup label:before {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  content: '';
  background-color: #5562eb;
  position: absolute;
  left: 50%;
  top: 50%;
  -webkit-transform: translate(-50%, -50%) scale3d(1, 1, 1);
          transform: translate(-50%, -50%) scale3d(1, 1, 1);
  transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  z-index: -1;
}
.inputGroup label:after {
  width: 32px;
  height: 32px;
  content: '';
  border: 2px solid #D1D7DC;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3Csvg width='32' height='32' viewBox='0 0 32 32' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M5.414 11L4 12.414l5.414 5.414L20.828 6.414 19.414 5l-10 10z' fill='%23fff' fill-rule='nonzero'/%3E%3C/svg%3E ");
  background-repeat: no-repeat;
  background-position: 2px 3px;
  border-radius: 50%;
  z-index: 2;
  position: absolute;
  right: 30px;
  top: 50%;
  -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
  cursor: pointer;
  transition: all 200ms ease-in;
}
.inputGroup input:checked ~ label {
  color: #fff;
}
.inputGroup input:checked ~ label:before {
  -webkit-transform: translate(-50%, -50%) scale3d(56, 56, 1);
          transform: translate(-50%, -50%) scale3d(56, 56, 1);
  opacity: 1;
}
.inputGroup input:checked ~ label:after {
  background-color: #54E0C7;
  border-color: #54E0C7;
}
.inputGroup input {
  width: 32px;
  height: 32px;
  order: 1;
  z-index: 2;
  position: absolute;
  right: 30px;
  top: 50%;
  -webkit-transform: translateY(-50%);
          transform: translateY(-50%);
  cursor: pointer;
  visibility: hidden;
}

.form {
  padding: 0 16px;
  max-width: 550px;
  margin: 50px auto;
  font-size: 18px;
  font-weight: 600;
  line-height: 36px;
}

body {
  background-color: #D1D7DC;
  font-family: 'Fira Sans', sans-serif;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

html {
  box-sizing: border-box;
}

code {
  background-color: #9AA3AC;
  padding: 0 8px;
}

</style>

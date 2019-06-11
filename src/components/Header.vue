<template>
  <div class="">
    <Toolbar :drawer.sync="drawer"/>
    <v-layout
      wrap
      style="height: 200px;"
    >

      <v-navigation-drawer
        v-model="drawer"
        absolute
        dark
        temporary
      >
        <v-list class="pa-1">

          <v-list-tile avatar tag="div">
            <v-list-tile-avatar>
              <img src="https://api.adorable.io/avatars/85/emavt@adorable.io.png">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Marco Trentini</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-divider light></v-divider>
        <v-list class="pt-0" >
          <br>
            <v-radio-group v-model="year" class="mt0">
              <v-radio v-for="y in years" :key="y" :label="y + '. Studienjahr'" :value="y"></v-radio >
            </v-radio-group>

              <v-radio-group v-model="semester" class="mt0">
                <v-radio v-for="s in semesters" :key="s.id" :label="convertRawSemester(s)" :value="s.id"></v-radio>
              </v-radio-group>

            <v-radio-group v-model="field" class="mt0">
              <v-radio v-for="f in fields" :key="f.id" :label="f.fieldName" :value="f.id"></v-radio >
            </v-radio-group>

        </v-list>
      </v-navigation-drawer>
    </v-layout>
  </div>

</template>

<script>
import Toolbar from '@/components/Toolbar'
import {mapState} from 'vuex'

export default {
  name: 'Header',
  created () {
    this.getSemesters()
    this.getSemesterName()
    this.getFields()
    this.getFieldName()
    this.year = this.$store.state.year
  },
  components: {
    Toolbar
  },
  data () {
    return {
      items: [
        { title: 'Home', icon: 'dashboard' },
        { title: 'About', icon: 'question_answer' }
      ],
      mini: false,
      right: null,
      drawer: null,
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
          return this.convertRawSemester(false)
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
    convertRawSemester (s) {
      var prefix
      var printSemester
      if (s) {
        if (s.semesterHalf === 1) {
          prefix = 'FS'
        } else if (s.semesterHalf === 2) {
          prefix = 'HS'
        } else {
          console.log('Semester error')
        }
        printSemester = prefix + ' ' + s.semesterYear
        return printSemester
      } else {
        if (this.rawSemester.semesterHalf === 1) {
          prefix = 'FS'
        } else if (this.rawSemester.semesterHalf === 2) {
          prefix = 'HS'
        } else {
          console.log('Semester error')
        }
        printSemester = prefix + ' ' + this.rawSemester.semesterYear
        this.printSemester = printSemester
      }
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
  .mt0 {
    margin-top: -10px;
    margin-bottom: 0px;
    margin-left: 15px;
  }
</style>

<template lang="html">
  <div class="">
    <v-list dense>
      <v-list-tile subheader>
        <v-subheader>Studienjahr</v-subheader>
      </v-list-tile>
    </v-list>
    <v-divider></v-divider>
    <v-list dense>
        <v-list-tile v-bind:class="[year == y ? 'selected' : '']" v-for="y in years" :key="y.id" @click="year = y">
          <v-list-tile-action>
            <v-icon>calendar_today</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Studienjahr {{y}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
      <hr>
      <v-list dense>
        <v-list-tile subheader>
          <v-subheader>Semester</v-subheader>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>
      <v-list dense>
          <v-list-tile v-bind:class="[semester == s.id ? 'selected' : '']" v-for="s in semesters" :key="s.id" @click="semester = s.id">
            <v-list-tile-action>
              <v-icon>date_range</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{convertRawSemester(s)}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <hr>
        <v-list dense>
          <v-list-tile subheader>
            <v-subheader>Departement</v-subheader>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-tile v-bind:class="[field == f.id ? 'selected' : '']" v-for="f in fields" :key="f.id" @click="field = f.id">
            <v-list-tile-action>
              <v-icon>school</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>{{f.fieldName}}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <hr>
        <v-list dense>
          <v-list-tile subheader>
            <v-subheader>Fächer</v-subheader>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list dense>
            <v-list-tile v-for="s in subjects" :key="s.id" :href="'#'+s.subjectName">
              <v-list-tile-action>
                <v-icon>attach_file</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>{{s.subjectName}}</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
  </div>

</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'SidebarContent',
  created () {
    this.getSemesters()
    this.getSemesterName()
    this.getFields()
    this.getFieldName()
    this.year = this.$store.state.year
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
  computed: {
    ...mapState([
      'subjects'
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
      let rawSem = this.semesters.filter(obj => {
        return obj.id === this.semester
      })
      this.rawSemester = rawSem
      this.convertRawSemester()
    },
    getFieldName () {
      let field = this.semesters.filter(obj => {
        return obj.id === this.field
      })
      this.rawField = field
      this.fieldName = field.fieldName
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
          return
        }
        printSemester = prefix + ' ' + s.semesterYear
        return printSemester
      } else {
        if (this.rawSemester.semesterHalf === 1) {
          prefix = 'FS'
        } else if (this.rawSemester.semesterHalf === 2) {
          prefix = 'HS'
        } else {
          return
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

<style>
  .selected {
    background: rgba(160, 160, 160, 0.2);
  }
</style>

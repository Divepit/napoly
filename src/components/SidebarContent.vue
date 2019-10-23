<template lang="html">
  <div>
    <v-list dense>
      <v-list-tile >
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
      <v-divider></v-divider>
      <v-list dense>
        <v-list-tile >
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
        <v-divider></v-divider>
        <v-list dense>
          <v-list-tile >
            <v-subheader>Departement</v-subheader>
          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-tile v-bind:class="[field == f.id ? 'selected' : '']" v-for="f in fields" :key="f.id" @click="setField(f.id);">
            <v-list-tile-action>
              <v-icon>school</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-if="(f.id != editId)">{{f.fieldName}}</v-list-tile-title>
              <v-text-field v-if="(f.id == editId)" v-model="editedField" v-on:keyup.enter="updateField()"/>
            </v-list-tile-content>
            <v-spacer/>
            <v-icon color="grey lighten-1" v-if="authorize()" @click=" editId = f.id; editingField = true; editedField = f.fieldName">edit</v-icon>
            <v-icon color="grey lighten-1" v-if="editId == f.id" @click="editId = ''; editingField = false; editedField = ''">cancel</v-icon>
          </v-list-tile>
          <v-list-tile v-if="authorize()" class="grey lighten-4">
            <v-list-tile-action>
              <v-icon color="grey">add</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-if="!addingField" class="grey--text pointer" @click="addingField = true" >ADD FIELD</v-list-tile-title>
              <v-text-field v-if="addingField" :rules="[rules.min]" v-on:keyup.enter="confirmFieldAdd = true" v-model="newField"></v-text-field>
            </v-list-tile-content>
            <v-icon color="grey lighten-1" v-if="addingField" @click="addingField = false">cancel</v-icon>

          </v-list-tile>
        </v-list>
        <v-divider></v-divider>
        <v-list dense>
          <v-list-tile subheader>
            <v-subheader>Fächer</v-subheader>
            <v-spacer/>
            <v-progress-circular v-if="subjects.length == 0" indeterminate color="grey" :size="15" width="2" ></v-progress-circular>

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
          <v-dialog v-model="confirmFieldAdd" persistent max-width="550">
            <v-card>
              <v-card-title class="headline error--text"> Are you sure? </v-card-title>
              <v-card-text class="subheading">
                You are about to add the field
                <strong class="info--text">{{newField}}</strong>.
                This cannot be undone.
              </v-card-text>
              <v-card-actions>
                <v-spacer/>
                <v-btn color="error"  @click="confirmFieldAdd=false">No</v-btn>
                <v-btn color="success"   @click="addField(); confirmFieldAdd=false">Yes</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
      year: '',
      newField: 'D-',
      addingField: false,
      rules: {
        min: v => v.length >= 1 || 'Cannot be empty'
      },
      editId: '',
      editingField: false,
      confirmFieldAdd: false
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
    fieldSwitch (e) {
      this.$ga.event({
        eventCategory: this.fieldName,
        eventAction: 'Select',
        eventValue: 1,
        eventLabel: 'Switch to ' + this.fieldName

      })
    },
    fieldLoad () {
      this.$ga.event({
        eventCategory: this.fieldName,
        eventAction: 'Load',
        eventValue: 1,
        eventLabel: 'Loaded ' + this.fieldName
      })
    },
    setField (id) {
      // eslint-disable-next-line
      if (this.editId == '') {
        this.field = id
        this.getFieldName()
        this.fieldSwitch()
      }
    },
    authorize () {
      // eslint-disable-next-line
      if (this.$store.state.signer && localStorage.admin == 1) { return true }
      return false
    },
    getSemesterName () {
      let rawSem = this.semesters.filter(obj => {
        return obj.id === this.semester
      })
      this.rawSemester = rawSem
      this.convertRawSemester()
    },
    getFieldName () {
      let field = this.fields.filter((obj) => obj.id === this.field)
      // this.rawField = field[0]
      if (field[0]) {
        this.fieldName = field[0].fieldName
      }
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
          this.getFieldName()
          this.fieldLoad()
        })
    },
    exitAdding () {
      this.addingSemester = false
      this.newSemesterHalf = ''
      this.newSemesterYear = ''
    },
    addField () {
      if (this.newField.length < 1) {
        return 0
      }
      this.$http.secured.post('/api/v1/fields/', {
        field: {
          fieldName: this.newField
        }
      })
        .then(response => {
          this.fields.push(response.data)
          this.newField = ''
          this.addingField = false
        })
    },
    updateField () {
      if (this.editedField.length < 1) {
        return 0
      }
      this.$http.secured.patch(`/api/v1/fields/` + this.editId, {
        fieldName: this.editedField
      })
        .then(response => {
          this.fieldName = this.editedField
          this.editingField = false
          this.editedField = ''
          this.editId = ''
          this.getFields()
        })
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

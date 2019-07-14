<template lang="html">
  <div>
    <Hero/>
    <v-container grid-list-md text-xs-center>
      <v-layout row wrap>
        <v-flex xs12 sm12 md12>
          <!-- <v-btn flat color="#6772e5" :href="'#'+subject.subjectName" v-for="subject in subjects">{{subject.subjectName}}</v-btn> -->
          <SubjectTable  v-for="subject in subjects" :key="subject.id" :id="subject.subjectName" v-bind:subject="subject.id" v-bind:weekCount="subject.weekCount"></SubjectTable>
          <v-btn depressed color="primary" v-if="!adding && signer && authorize()" @click="adding = !adding; newSubjectName = ''">Add Subject</v-btn>
          <v-text-field  placeholder="Subject Name" v-if="adding && signer && authorize()" type="text" name="" value="" v-model="newSubjectName" v-on:keyup.enter="addSubject()"></v-text-field>
          <v-btn depressed color="primary" v-if="adding && signer && authorize()" @click="addSubject()">Add Subject</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import SubjectTable from '@/components/SubjectTable'
import Hero from '@/components/Hero'
export default {
  components: {
    SubjectTable,
    Hero
  },
  created () {
    this.getSubject()
    this.$store.state.dark = false
  },
  data () {
    return {
      subjects: [],
      error: '',
      adding: false,
      newSubjectName: ''
    }
  },
  computed: {
    ...mapState([
      'semester',
      'field',
      'year',
      'signer',
      'userField',
      'admin'
    ])
  },
  methods: {
    signedIn () {
      return localStorage.signedIn
    },
    updateSubjects () {
      this.$store.state.subjects = this.subjects
    },
    addSubject () {
      if (!this.newSubjectName) {
        console.log('No Semester given')
        this.adding = false
        return
      }
      this.$http.secured.post('/api/v1/subjects/', {
        subject: {
          subjectName: this.newSubjectName,
          semester_id: this.$store.state.semester,
          field_id: this.$store.state.field,
          year: this.$store.state.year
        }
      })

        .then(response => {
          this.subjects.push(response.data)
          this.adding = false
          this.updateSubjects()
        })

        .catch(error => this.setError(error, 'Cannot create link'))
    },
    getSubject () {
      this.subjects = []
      this.$http.secured.get('/api/v1/subjects/?semester_id=' + this.semester + '&field_id=' + this.field + '&year=' + this.year)
        .then(response => {
          this.subjects = response.data
          this.updateSubjects()
        })
    },
    authorize () {
      if (this.signer && (localStorage.admin === '1' || this.userField === `${this.field}`)) { return true }
      return false
    }
  },
  watch: {
    semester: function (val) {
      this.getSubject()
    },
    field: function (val) {
      this.getSubject()
    },
    year: function (val) {
      this.getSubject()
    }
  }
}
</script>

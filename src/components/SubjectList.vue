<template lang="html">
  <div>
    <Hero/>
    <v-container>
      <v-layout>
        <v-flex>
          <Subject  v-for="subject in subjects" :key="subject.id" :id="subject.subjectName" v-bind:subject="subject.id" v-bind:allTypes="types"></Subject>
          <v-btn flat color="primary" v-if="!adding && signer && authorize()" @click="adding = !adding; newSubjectName = ''">+ Add Subject</v-btn>
          <v-text-field  placeholder="Subject Name" v-if="adding && signer && authorize()" type="text" name="" value="" v-model="newSubjectName" v-on:keyup.enter="addSubject()"></v-text-field>
          <v-btn depressed color="primary" v-if="adding && signer && authorize()" @click="addSubject()">Add Subject</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import Subject from '@/components/Subject'
import Hero from '@/components/Hero'
export default {
  components: {
    Subject,
    Hero
  },
  created () {
    this.getTypes()
    this.getSubjects()
    this.$store.state.dark = false
  },
  data () {
    return {
      types: [],
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
      } else {
        this.$http.secured.post('/api/v1/subjects/', {
          subject: {
            subjectName: this.newSubjectName,
            startWeek: 1,
            semester_id: this.$store.state.semester,
            field_id: this.$store.state.field,
            year: this.$store.state.year
          }
        }).then(response => {
          this.subjects.push(response.data)
          this.updateSubjects()
        })
      }
      this.adding = false
    },
    getSubjects () {
      this.subjects = []
      this.$http.secured.get('/api/v1/subjects/?semester_id=' + this.semester + '&field_id=' + this.field + '&year=' + this.year)
        .then(response => {
          this.subjects = response.data
          this.updateSubjects()
        })
    },
    getTypes () {
      this.$http.secured.get('/api/v1/types')
        .then(response => {
          this.types = response.data
        })
    },
    authorize () {
      if (this.signer && (localStorage.admin === 1 || this.userField === this.field)) { return true }
      return false
    }
  },
  watch: {
    semester: function () {
      this.getSubjects()
    },
    field: function () {
      this.getSubjects()
    },
    year: function () {
      this.getSubjects()
    }
  }
}
</script>

<template lang="html">
  <div class="">
      <!-- <v-btn flat color="#6772e5" :href="'#'+subject.subjectName" v-for="subject in subjects">{{subject.subjectName}}</v-btn> -->
      <Links  v-for="subject in subjects" :key="subject.id" v-bind:subject="subject.id" v-bind:weekCount="subject.weekCount"></Links>
      <v-btn depressed color="primary" v-if="!adding && signedIn()" @click="adding = !adding; newSubjectName = ''">Add Subject</v-btn>
      <v-text-field  placeholder="Subject Name" v-if="adding && signedIn()" type="text" name="" value="" v-model="newSubjectName" v-on:keyup.enter="addSubject()"></v-text-field>
      <v-btn depressed color="primary" v-if="adding && signedIn()" @click="addSubject()">Add Subject</v-btn>
  </div>

</template>

<script>
import {mapState} from 'vuex'
import Links from '@/components/Links'
export default {
  components: {
    Links
  },
  created () {
    this.getSubject()
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
      'year'
    ])
  },
  methods: {
    signedIn () {
      return localStorage.signedIn
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
        })

        .catch(error => this.setError(error, 'Cannot create link'))
    },
    getSubject () {
      this.subjects = []
      this.$http.secured.get('/api/v1/subjects/?semester_id=' + this.semester + '&field_id=' + this.field + '&year=' + this.year)
        .then(response => { this.subjects = response.data })
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

<style lang="css" scoped>

</style>

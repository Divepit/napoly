<template lang="html">
  <div class="medium">
      <Links  v-for="(subject, index) in subjects" :key="index" v-bind:subject="subject.id" v-bind:semester="semester" v-bind:field="field" v-bind:weekCount="subject.weekCount"></Links>
      <v-btn v-if="!adding && signedIn()" type="button" name="button" @click="adding = !adding">Add Subject</v-btn>
      <input v-if="adding && signedIn()" type="text" name="" value="" v-model="subjectName">
      <v-btn v-if="adding && signedIn()" type="button" name="button" @click="addSubject()">Add Subject</v-btn>
  </div>

</template>

<script>
import Links from '@/components/Links'
export default {
  components: {
    Links
  },
  props: ['semester', 'field', 'year'],
  created () {
    this.getSubject()
  },
  data () {
    return {
      subjects: [],
      error: '',
      adding: false,
      subjectName: ''
    }
  },
  methods: {
    signedIn () {
      return localStorage.signedIn
    },
    addSubject () {
      if (!this.subjectName) {
        console.log('No Semester given')
        this.adding = false
        return
      }
      this.$http.secured.post('/api/v1/subjects/', {
        subject: {
          subjectName: this.subjectName,
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

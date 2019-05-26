<template lang="html">
  <div class="medium">
      <Links v-for="(subject, index) in subjects" :key="index" v-bind:subject="subject.id" v-bind:semester="semester" v-bind:weekCount="subject.weekCount"></Links>
      <button v-if="!adding" type="button" name="button" @click="adding = !adding">Add Subject</button>
      <input v-if="adding" type="text" name="" value="" v-model="subjectName">
      <button v-if="adding" type="button" name="button" @click="addSubject()">Add Subject</button>
  </div>

</template>

<script>
import Links from '@/components/Links'
export default {
  components: {
    Links
  },
  created () {
    this.subjects = []
    this.$http.secured.get('/api/v1/subjects/?semester_id=' + this.semester)
      .then(response => { this.subjects = response.data })
  },
  props: ['semester'],
  data () {
    return {
      subjects: [],
      error: '',
      adding: false,
      subjectName: ''
    }
  },
  methods: {
    addSubject () {
      if (!this.subjectName) {
        console.log('No Semester given')
        this.adding = false
        return
      }
      this.$http.secured.post('/api/v1/subjects/', {
        subject: {
          subjectName: this.subjectName,
          semester_id: this.$store.state.semester
        }
      })

        .then(response => {
          this.subjects.push(response.data)
          this.adding = false
        })

        .catch(error => this.setError(error, 'Cannot create link'))
    }
  },
  watch: {
    semester: function (val) {
      this.subjects = []
      this.$http.secured.get('/api/v1/subjects/?semester_id=' + this.semester)
        .then(response => { this.subjects = response.data })
    }
  }
}
</script>

<style lang="css" scoped>
  .medium {
    width: 2000px;
    padding-left: 20%;
  }
  button {
  }
</style>

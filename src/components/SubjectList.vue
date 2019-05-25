<template lang="html">
  <div class="">
      <Links  v-for="(subject, index) in subjects" :key="index" v-bind:subject="subject.id" v-bind:semester="semester" v-bind:weekCount="subject.weekCount"></Links>
  </div>

</template>

<script>
import Links from '@/components/Links'
export default {
  components: {
    Links
  },
  created () {
    this.checkSubjects()
  },
  props: ['semester'],
  data () {
    return {
      subjects: [],
      error: ''
    }
  },
  methods: {
    checkSubjects () {
      this.$http.secured.get('/api/v1/subjects/?semester_id=' + this.semester)
        .then(response => { this.subjects = response.data })
    }
  }
}
</script>

<style lang="css" scoped>
</style>

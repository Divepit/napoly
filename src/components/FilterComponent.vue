<template lang="html">
  <div class="">
    <v-radio-group v-model="semester" :mandatory="true">
      <v-radio v-for="(s, index) in semesters" :key="index" :label="'Semester' + s" :value="s" @click="setSemester(s)"></v-radio >
    </v-radio-group>
    <h3>{{printSemester}}</h3>
    <SubjectList v-bind:semester="this.$store.state.semester"></SubjectList>
  </div>
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
      semesters: [1, 2, 3, 4],
      rawSemester: '',
      printSemester: ''
    }
  },
  created () {
    this.getSemesterName()
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
    }
  },
  methods: {
    setSemester (s) {
      this.$store.semester = s
    },
    getSemesterName () {
      this.$http.secured.get('/api/v1/semesters/' + this.semester)
        .then(response => {
          this.rawSemester = response.data
          this.convertRawSemester()
        })
    },
    convertRawSemester () {
      var prefix
      if (this.rawSemester.semesterHalf == 1) {
        prefix = 'FS'
      } else if (this.rawSemester.semesterHalf == 2) {
        prefix = 'HS'
      } else {
        console.log('Semester error')
      }
      this.printSemester = prefix + ' ' + this.rawSemester.semesterYear
    }
  },
  watch: {
    semester: function (val) {
      this.getSemesterName()
      localStorage.semester = this.semester
    }
  }
}
</script>

<style lang="css" scoped>
</style>

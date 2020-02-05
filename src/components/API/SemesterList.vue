<template>
<v-list>
  <v-subheader>Semester {{currentSemesterId}}</v-subheader>
  <v-list-item-group>
    <v-list-item v-for="semester in semesters.data" :key="semester.id" @click="setCurrentSemester(semester.id)">{{semester.semesterHalf === 1 ? 'FS ' : 'HS '}}{{semester.semesterYear}}</v-list-item>
  </v-list-item-group>
</v-list>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'SemesterList',
  created () {
    this.getSemesters()
  },
  computed: {
    ...mapState(['semesters', 'currentSemesterId'])
  },
  methods: {
    ...mapActions(['getSemesters', 'setCurrentSemester'])
  }
}
</script>

<style scoped>

</style>

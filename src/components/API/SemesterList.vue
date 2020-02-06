<template>
<v-list>
  <v-subheader @click="changeSemester" style="cursor: pointer">{{currentSemesterName}}
    <v-spacer/>
    <v-icon @click="changeSemester" small>mdi-pencil</v-icon>
  </v-subheader>
  <v-list-item-group v-if="changingSemester">
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
    ...mapState('napolyApiModule', ['semesters', 'currentSemesterId', 'currentSemesterName', 'changingSemester'])
  },
  methods: {
    ...mapActions('napolyApiModule', ['getSemesters', 'setCurrentSemester']),
    changeSemester () {
      this.$store.state.napolyApiModule.changingSemester = !this.changingSemester
    }
  }
}
</script>

<style scoped>

</style>

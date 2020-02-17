<!-- Lists the semesters present on the API to display in the sidebar -->
<template>
  <v-list>
    <v-subheader @click="changeSemester" style="cursor: pointer">{{currentSemesterName}}
      <v-spacer/>
      <v-icon @click="changeSemester" small>{{changingSemester ? 'mdi-chevron-up':'mdi-chevron-down'}}</v-icon>
    </v-subheader>
    <v-list-item-group v-if="changingSemester">
      <v-list-item v-for="semester in semesters.data" :key="semester.id" @click="setCurrentSemester(semester.id)">
        {{semester.semesterHalf === 1 ? 'FS ' : 'HS '}}{{semester.semesterYear}}
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
// For the functionality of mapState, mapActions and mapMutations please refer to the vuex documentation
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SemesterList',
  created () {
    this.getSemesters()
  },
  computed: {
    // Note that all the API States are defined a separate vuex module at src/store/modules/napolyApi.js
    ...mapState('napolyApiModule', ['semesters', 'currentSemesterId', 'currentSemesterName', 'changingSemester'])
  },
  methods: {
    // Note that all the API Actions are defined a separate vuex module at src/store/modules/napolyApi.js
    ...mapActions('napolyApiModule', ['getSemesters', 'setCurrentSemester']),
    changeSemester () {
      this.$store.state.napolyApiModule.changingSemester = !this.changingSemester
    }
  }
}
</script>

<style scoped>

</style>

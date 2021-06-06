<!-- Generates a list of subjects for the sidebar with the current selection of year, semester and field -->
<template>
  <v-list v-if="subjects.length">
    <v-subheader class="font-weight-light">Subjects</v-subheader>
    <v-list-item-group>
      <v-list-item v-for="subject in subjects" :key="subject.id" :href="'#'+subject.subjectName" class="font-weight-light white--text">
        {{subject.subjectName}}
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SubjectList',
  created () {
    this.getSubjects()
  },
  computed: {
    // Note that all the API States are defined a separate vuex module at src/store/modules/napolyApi.js
    ...mapState('napolyApiModule', ['subjects', 'currentSubjectId', 'currentSemesterId'])
  },
  methods: {
    // Note that all the API Actions are defined a separate vuex module at src/store/modules/napolyApi.js
    ...mapActions('napolyApiModule', ['getSubjects'])
  }
}
</script>

<style scoped>

</style>

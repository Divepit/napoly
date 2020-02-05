<template>
<v-list>
  <v-subheader>Subjects</v-subheader>
  <v-list-item-group>
    <v-list-item v-for="subject in subjects" :key="subject.id">{{subject.subjectName}}</v-list-item>
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
    ...mapState('napolyApiModule', ['subjects', 'currentSubjectId', 'currentSemesterId'])
  },
  methods: {
    ...mapActions('napolyApiModule', ['getSubjects'])
  }
}
</script>

<style scoped>

</style>

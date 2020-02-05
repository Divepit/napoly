<template>
<v-list>
  <v-subheader>Subject {{currentSubjectId}}</v-subheader>
  <v-list-item-group>
    <v-list-item v-for="subject in subjects" :key="subject.id">{{subject.subjectName}}</v-list-item>
  </v-list-item-group>
</v-list>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'SubjectList',
  computed: {
    ...mapState(['subjects', 'currentSubjectId', 'currentSemesterId'])
  },
  methods: {
    ...mapActions(['getSubjects'])
  }
}
</script>

<style scoped>

</style>

<template lang="html">
  <div class="">
    <v-radio-group v-model="semester" :mandatory="false">
      <v-radio v-for="(s, index) in semesters" :key="index" :label="'Semester' + s" :value="s" @click="setSemester(s)"></v-radio >
    </v-radio-group>
    <SubjectList v-bind:semester="semester"></SubjectList>
  </div>
</template>

<script>
import SubjectList from '@/components/SubjectList'
export default {
  components: {
    SubjectList
  },
  data () {
    return {
      semesters: [1, 2, 3, 4],
      semester: '1'
    }
  },
  methods: {
    setSemester (s) {
      this.$store.semester = s
    }
  }
}
</script>

<style lang="css" scoped>
</style>

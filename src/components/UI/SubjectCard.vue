<template>
  <div>
    <v-card class="mt-12 grey--text" flat v-if="noresult">
      <v-card-title>
        <v-spacer/>
        In diesem Semester existieren noch keine Links!
        <v-spacer/>
      </v-card-title>
    </v-card>
    <div v-if="loading">
      <v-card :key="x" class="my-2" v-for="x in 4">
        <v-skeleton-loader class="mx-auto my-5" max-width="300" type="card"/>
      </v-card>
    </div>
    <v-card :key="subject.id" class="ma-5" v-else v-for="subject in subjects">
      <v-card-title>{{subject.subjectName}}
        <v-spacer/>
        <SubjectButtons :subject="subject"/>
      </v-card-title>
      <v-container fluid>
        <LinkTable :subject="subject"/>
      </v-container>
    </v-card>
  </div>
</template>

<script>
import LinkTable from '../API/LinkTable'
import { mapState } from 'vuex'
import SubjectButtons from '../API/SubjectButtons'

export default {
  name: 'SubjectCard',
  components: { SubjectButtons, LinkTable },
  props: {
    subjectId: null
  },
  computed: {
    ...mapState('napolyApiModule', ['subjects']),
    ...mapState(['loading', 'noresult'])
  }
}
</script>

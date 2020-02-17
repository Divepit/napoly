<template>
  <v-container>
    <v-card class="mt-12 grey--text" flat v-if="noresult">
      <v-card-title>
        <v-spacer/>
        In diesem Semester existieren noch keine Links!
        <v-spacer/>
      </v-card-title>
     <v-card-actions><v-spacer/><v-btn>Wie kann ich das ändern?</v-btn><v-spacer/></v-card-actions>
    </v-card>
    <div v-if="loading">
      <v-card :key="x" class="my-2" v-for="x in 4">
        <v-skeleton-loader class="mx-auto my-5" max-width="300" type="card"/>
      </v-card>
    </div>
    <v-container :key="subject.id" v-else v-for="subject in subjects" class="pt-8" :id="subject.subjectName">
      <v-card>
        <v-card-title class="primary--text">
          {{subject.subjectName}}
          <v-btn v-if="signedIn && editMode !== subject.id" @click="editMode = subject.id" class="ml-4" tile outlined color="info"> <v-icon left small>mdi-pencil</v-icon> Edit</v-btn>
          <v-btn v-if="signedIn && editMode === subject.id" @click="editMode = null" class="ml-4" tile outlined color="error" > <v-icon left small>mdi-cancel</v-icon> Stop Editing</v-btn>
          <v-spacer/>
          <SubjectButtons :subject="subject" :editMode="editMode"/>
        </v-card-title>
        <v-container fluid>
          <LinkTable :subject="subject" :editMode="editMode"/>
        </v-container>
        <SubjectInfos :subject="subject" :editMode="editMode"/>
      </v-card>
    </v-container>
  </v-container>
</template>

<script>
import LinkTable from '../API/LinkTable'
import { mapState } from 'vuex'
import SubjectButtons from '../API/SubjectButtons'
import SubjectInfos from '../API/SubjectInfos'

export default {
  name: 'SubjectCard',
  data () {
    return {
      editMode: null
    }
  },
  components: { SubjectInfos, SubjectButtons, LinkTable },
  props: {
    subjectId: null
  },
  computed: {
    ...mapState('napolyApiModule', ['subjects']),
    ...mapState(['loading', 'noresult', 'signedIn'])
  }
}
</script>

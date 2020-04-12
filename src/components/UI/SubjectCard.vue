<template>
  <v-container>
    <div v-if="!(currentFieldId && currentSemesterId && currentYear)">
      <v-card class="mt-12 grey--text">
        <v-card-title>
          <v-spacer/>
          Bitte wähle dein Semester
          <v-spacer/>
        </v-card-title>
        <year-list/>
        <field-list/>
        <semester-list/>
      </v-card>
    </div>
    <div v-else>
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
            <v-btn v-if="authenticate(subject) && editMode !== subject.id" @click="editMode = subject.id" class="ml-4" tile outlined color="info"> <v-icon left small>mdi-pencil</v-icon> Edit</v-btn>
            <v-btn v-if="authenticate(subject) && editMode === subject.id" @click="editMode = null" class="ml-4" tile outlined color="error" > <v-icon left small>mdi-cancel</v-icon> Stop Editing</v-btn>
            <v-spacer/>
            <SubjectButtons :subject="subject" :editMode="editMode"/>
          </v-card-title>
          <v-container fluid>
            <LinkTable :subject="subject" :editMode="editMode"/>
          </v-container>
          <SubjectInfos :subject="subject" :editMode="editMode"/>
          <v-card-subtitle v-if="signedIn && userRole == 1" style="cursor: pointer"><span class="error--text" @click="confirmDelete = subject.id">Delete Subject</span></v-card-subtitle>
        </v-card>
        <v-snackbar color="primary" v-model="confirmDelete" v-if="confirmDelete === subject.id">
          Do you really want to delete "{{subject.subjectName}}" ?
          <v-btn color="success" @click="deleteSubject(subject.id, subject.subjectName)">Yes</v-btn>
          <v-btn color="error" @click="confirmDelete = null">No</v-btn>
        </v-snackbar>
      </v-container>
      <v-container v-if="signedIn">
        <v-card outlined style="cursor: pointer" @click="newSubject = { subjectName: '' }">
          <v-card-title class="primary--text"><v-icon class="mr-6" color="primary">mdi-plus</v-icon>New Subject</v-card-title>
        </v-card>
      </v-container>
    </div>
    <ObjectEditor :objectToEdit="newSubject" :active="newSubject" :forbidden-attributes="['']" @updateObject="addSubject($event)" @cancel="newSubject = null"/>
  </v-container>
</template>

<script>
import LinkTable from '../API/LinkTable'
import { mapState, mapActions } from 'vuex'
import SubjectButtons from '../API/SubjectButtons'
import SubjectInfos from '../API/SubjectInfos'
import FieldList from '../API/FieldList'
import YearList from '../API/YearList'
import SemesterList from '../API/SemesterList'
import ObjectEditor from './ObjectEditor'
import { securedAxiosInstance } from '../../backend/axios'

export default {
  name: 'SubjectCard',
  created () {
    this.userRole = localStorage.userRole
    this.userField = localStorage.userField
  },
  data () {
    return {
      confirmDelete: null,
      editMode: null,
      firstTimeUse: false,
      newSubject: null,
      userField: null
    }
  },
  components: { ObjectEditor, SemesterList, YearList, FieldList, SubjectInfos, SubjectButtons, LinkTable },
  props: {
    subjectId: null
  },
  computed: {
    ...mapState('napolyApiModule', ['subjects', 'currentFieldId', 'currentSemesterId', 'currentYear']),
    ...mapState(['loading', 'noresult', 'signedIn', 'message'])
  },
  methods: {
    ...mapActions('napolyApiModule', ['getSubjects']),
    addSubject (subject) {
      this.newSubject = null
      var subjectToSubmit = { subjectName: subject.objectValues[0], semester_id: this.currentSemesterId, field_id: this.currentFieldId, year: this.currentYear }
      securedAxiosInstance.post('/api/v1/subjects', subjectToSubmit)
        .then(
          this.getSubjects,
          this.message.text = `Subject "${subject.objectValues[0]}" has been created`,
          this.message.color = 'success',
          this.message.active = true
        )
        .catch(error => {
          this.message.text = error
          this.message.color = 'error'
          this.message.active = true
        })
    },
    deleteSubject (id, name) {
      this.confirmDelete = false
      securedAxiosInstance.delete('/api/v1/subjects/' + id)
        .then(
          this.getSubjects,
          this.message.text = `Subject "${name}" has been deleted`,
          this.message.color = 'warning',
          this.message.active = true
        )
    },
    authenticate (subject) {
      return this.signedIn && (subject.field_id.toString() === this.userField || this.userRole === '1')
    }
  }
}
</script>

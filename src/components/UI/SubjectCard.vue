<template>
  <v-container>
    <div v-if="!(currentFieldId && currentSemesterId && currentYear)">
      <v-container style="height: 30vh; width: 100vw" class="fill-height">
        <v-row>
          <v-col cols="12" class="text-center font-weight-light primary--text pb-0" style="font-size: 3rem">
            napoly.ch
          </v-col>
          <v-col cols="12" class="text-center font-weight-light primary--text pt-0" style="font-size: 1.25rem; font-family: Open Sans">
            Student Document Repository
          </v-col>
        </v-row>
      </v-container>
      <v-card class="grey--text" flat>
<!--        <v-card-title>-->
<!--          <v-spacer/>-->
<!--          Bitte wähle dein Semester-->
<!--          <v-spacer/>-->
<!--        </v-card-title>-->
        <year-list/>
        <field-list/>
        <semester-list/>
      </v-card>
    </div>
    <div v-else>
      <v-card class="mt-12 grey--text" flat v-if="noresult">
        <v-card-title style="font-family: Open Sans">
          <v-spacer/>
          In diesem Semester existieren noch keine Links!
          <v-spacer/>
        </v-card-title>
        <v-card-actions><v-spacer/><v-btn outlined color="primary" class="mx-2" href="mailto:marcotr@ethz.ch">Schreib uns eine Mail</v-btn> falls du die Unterlagen dieses Semesters verwalten willst!<v-spacer/></v-card-actions>
      </v-card>
      <v-container style="height: 90vh; width: 110vw" class="fill-height">
        <v-row>
          <v-col class="font-weight-light primary--text pb-0 text-center" cols="12" style="font-size: 2.75rem">
            napoly.ch
          </v-col>
          <v-col class="font-weight-thin primary--text pt-0 text-center" cols="12" style="font-size: 1.25rem; font-family: Open Sans">
            Student Document Repository
          </v-col>
        </v-row>
      </v-container>
      <div v-if="loading">
        <v-card :key="x" class="my-2" v-for="x in 4">
          <v-skeleton-loader class="mx-auto my-5" max-width="300" type="card"/>
        </v-card>
      </div>
      <v-container :key="subject.id" v-else v-for="subject in subjects" class="pt-12" :id="subject.subjectName">
        <v-card elevation="2">
          <v-card-title class="primary--text font-weight-light" style="font-size: 1.75rem; font-family: 'Open Sans'">
            <v-btn v-if="authenticate(subject) && editMode !== subject.id" @click="editMode = subject.id" class="mr-4"
                   tile outlined color="info" small>
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
            <v-btn v-if="authenticate(subject) && editMode === subject.id" @click="editMode = null" class="mr-4" tile
                   outlined color="error" small>
              <v-icon small>mdi-pencil-off</v-icon>
            </v-btn>
            {{subject.subjectName}}
            <!--            <v-divider vertical class="mx-4 hidden-sm-and-down"></v-divider>-->
            <v-spacer/>
            <SubjectButtons class="hidden-sm-and-down" :subject="subject" :editMode="editMode"/>
          </v-card-title>
          <v-card-subtitle class="ml-2 mt-0 font-weight-light">Verantwortlich: <span v-for="(r,index) in responsible" :key="index"><span v-if="r.subject == subject.id">{{r.creators.slice(0, 3).join(', ')}}</span></span></v-card-subtitle>
          <SubjectButtons class="hidden-md-and-up mx-4" :subject="subject" :editMode="editMode"/>

          <v-container fluid>
            <LinkTable :subject="subject" :editMode="editMode" @linksLoaded="responsible.push($event)"/>
          </v-container>
          <SubjectInfos :subject="subject" :editMode="editMode"/>
          <v-card-subtitle v-if="signedIn && userRole == 1 && editMode === subject.id" style="cursor: pointer"><span class="error--text" @click="confirmDelete = subject.id">Delete Subject</span></v-card-subtitle>
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
import { mapActions, mapState } from 'vuex'
import SubjectButtons from '../API/SubjectButtons'
import SubjectInfos from '../API/SubjectInfos'
import FieldList from '../API/FieldList'
import YearList from '../API/YearList'
import SemesterList from '../API/SemesterList'
import ObjectEditor from './ObjectEditor'
import { securedAxiosInstance } from '../../backend/axios'

export default {
  name: 'SubjectCard',
  components: {
    ObjectEditor,
    SemesterList,
    YearList,
    FieldList,
    SubjectInfos,
    SubjectButtons,
    LinkTable
  },
  created () {
    this.userRole = localStorage.userRole
    this.userField = localStorage.userField
  },
  props: {
    subjectId: null
  },
  data () {
    return {
      confirmDelete: null,
      editMode: null,
      firstTimeUse: false,
      newSubject: null,
      userField: null,
      responsible: []
    }
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

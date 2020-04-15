<!-- Generates the infos in each subject, pulled from the API -->
<template>
  <v-container fluid>
    <div v-for="info in infos"  :key="info.id">
      <v-card :outlined="editMode === subject.id" elevation="0" class="mx-4 mb-10">
        <v-card-title style="font-family: Open Sans; word-break: keep-all" :class="editMode === subject.id ? 'pt-4 primary--text font-weight-light pb-0' : 'pt-1 primary--text font-weight-light px-0 pb-0'" >
          <v-btn v-if="editMode === subject.id" x-small outlined tile color="primary" class="mr-2" @click="editInfo(info, info.id)"><v-icon small>mdi-pencil</v-icon></v-btn>
          {{info.infoTitle}}
          <v-divider class="mx-6 hidden-sm-and-down"/>

          <!-- All we need to add in editMode is an edit icon -->
        </v-card-title>
        <v-card-title :class="editMode === subject.id ? 'body-2 grey--text font-weight-light pt-0 pb-4' : 'body-2 grey--text font-weight-light pa-0 pb-4 px-0'" style="font-family: Open Sans;">Editiert am {{convertDate(info.updated_at.substring(0,10))}}</v-card-title>

        <v-card-text :class="editMode === subject.id ? 'pb-0 pb-4' : 'pb-0 px-0'">
          <vue-markdown>{{info.infoText}}</vue-markdown>
        </v-card-text>
      </v-card>
    </div>
    <v-card v-if="editMode === subject.id" style="cursor: pointer" outlined class="mx-4 my-2 text-center"
            @click="editInfo({infoTitle: '', infoText: '', subject_id: subject.id})">
      <v-card-text>
        <v-icon>mdi-plus</v-icon>
      </v-card-text>
    </v-card>
    <ObjectEditor :objectToEdit="editedInfo" :active="editingInfo" :forbidden-attributes="forbiddenAttributes"
                  @updateObject="updateInfo($event)" @cancel="editingInfo = false" @delete="removeInfo(editedInfo)"/>
  </v-container>
</template>

<script>
// plainAxiosInstance and securedAxiosInstance are defined in the axios wrapper and is used to access API values which do not require authentication
import { plainAxiosInstance, securedAxiosInstance } from '../../backend/axios'
import ObjectEditor from '../UI/ObjectEditor'
// For the functionality of mapState, mapActions and mapMutations please refer to the vuex documentation
import { mapState } from 'vuex'
import VueMarkdown from 'vue-markdown'

export default {
  name: 'SubjectInfos',
  components: { ObjectEditor, VueMarkdown },
  data () {
    return {
      infos: [],
      editingInfo: false,
      editedInfo: {},
      newInfo: {},
      // Refer to the ObjectEditor component for an explanation of the forbiddenAttributes prop
      forbiddenAttributes: ['id', 'created_at', 'updated_at', 'creator', 'editor', 'linkWeek', 'subject_id', 'type_id']

    }
  },
  created () {
    this.getInfos()
  },
  props: {
    subject: null,
    // Note that editMode is NOT used as a boolean but actually as an integer which is set to the currently edited subject's ID
    editMode: null
  },
  computed: {
    ...mapState(['message'])
  },
  methods: {
    getInfos () {
      this.infos = []
      plainAxiosInstance.get(`/api/v1/infos?subject_id=${this.subject.id}`).then(response => {
        this.infos = response.data
      })
    },
    editInfo (info, id) {
      this.newInfo.id = id
      this.newInfo.subject_id = this.subject.id
      if (this.editMode === this.subject.id) {
        this.editingInfo = true
        this.editedInfo = info
      }
    },
    // updateInfo() will also serve as createInfo() in case the info object passed has an undefined id
    updateInfo (info) {
      this.editingInfo = false
      for (var i in info.objectKeys) {
        this.newInfo[info.objectKeys[i]] = info.objectValues[i]
      }
      if (this.newInfo.infoTitle.length !== 0 && this.newInfo.infoText.length !== 0 && this.newInfo.id === undefined) {
        securedAxiosInstance.post('/api/v1/infos', this.newInfo)
          .then(response => {
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = `Info ${response.data.id} added`
            this.message.color = 'info'
            this.message.active = true
            this.getInfos()
          })
          .catch(error => {
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = error
            this.message.color = 'error'
            this.message.active = true
          })
      } else if (this.newInfo.infoTitle.length !== 0 && this.newInfo.infoText.length !== 0 && this.newInfo.id !== undefined) {
        securedAxiosInstance.patch(`/api/v1/infos/${this.newInfo.id}`, this.newInfo)
          .then(response => {
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = `Info ${response.data.id} updated`
            this.message.color = 'info'
            this.message.active = true
            this.getInfos()
          })
          .catch(error => {
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = error
            this.message.color = 'error'
            this.message.active = true
          })
      } else {
        // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
        this.message.text = `Invalid Info`
        this.message.color = 'error'
        this.message.active = true
      }
    },
    removeInfo (info) {
      securedAxiosInstance.delete(`/api/v1/infos/${info.id}`)
        .then(
          this.editingInfo = false,
          this.infos.splice(this.infos.indexOf(info), 1),
          // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
          this.message.text = `Info ${info.id} removed`,
          this.message.color = 'warning',
          this.message.active = true
        )
    },
    convertDate (date) {
      var year = date.substring(0, 4)
      var month = date.substring(5, 7)
      var day = date.substring(8, 10)
      return day + '.' + month + '.' + year
    }
  }
}
</script>

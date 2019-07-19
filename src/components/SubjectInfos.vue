<template>
  <div class="">
    <v-layout v-for="info in infos" :key="info.id">
      <v-flex xs12 sm12>
        <v-card class="infocard" @click="editInfo(info); infoId = info.id">
          <v-card-title class="m0">
            <div style="width: 100%">
              <h3 class="leftabsolute infotitle">{{info.infoTitle}}</h3>
              <!-- <h3 class="rightalign infotitle date">Erstellt am: {{info.created_at}}</h3> -->
            </div>
            <hr class="divider">
            <vue-markdown class="leftalign not-underlined"> {{info.infoText}} </vue-markdown>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
    <v-icon class="unselectable" v-if="editorMode && signedIn()" color="" @click="dialog = !dialog; editing = false; clear()">add_circle</v-icon>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card class="card">
          <v-card-title>
            <span v-if="editing" class="headline">Edit Info</span>
            <span v-else class="headline">Add Info</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12>
                  <v-text-field label="Info Title" v-model="infoTitle" required></v-text-field>
                </v-flex>
                <v-flex xs12>
                  <v-textarea label="Info Text" v-model="infoText" required></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn v-if="editing" color="error" flat @click="dialog = false; removeInfo(infoId)">Delete Info</v-btn>

            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
            <v-btn v-if="editing" color="blue darken-1" flat @click="dialog = false; updateInfo()">Confirm</v-btn>
            <v-btn v-else color="blue darken-1" flat @click="dialog = false; addInfo()">Add</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </div>

</template>

<script>
import VueMarkdown from 'vue-markdown'
export default {
  name: 'SubjectInfos',
  props: ['subject', 'editorMode'],
  created () {
    this.getInfos()
  },
  data () {
    return {
      infos: [],
      infoId: null,
      infoText: '',
      infoTitle: '',
      editing: false,
      dialog: false
    }
  },
  components: {
    VueMarkdown
  },
  methods: {
    // Returns true if localStorage.signedIn is true
    signedIn () {
      return localStorage.signedIn
    },
    // Gets all infos from API with the current subject
    getInfos () {
      this.infos = []
      this.$http.secured.get('/api/v1/infos?subject_id=' + this.subject)
        .then(response => {
          this.infos = response.data
        })
        .catch(error => this.setError(error, 'Something went wrong with Infos'))
    },
    // Adds info via API if newInfo is filled
    addInfo () {
      if (!this.infoText || !this.infoTitle) {
        return
      }
      this.$http.secured.post('/api/v1/infos/', {
        info: {
          infoText: this.infoText,
          infoTitle: this.infoTitle,
          subject_id: this.subject
        }
      })

        .then(response => {
          this.infos.push(response.data)
        })
        .catch(error => this.setError(error, 'Cannot create link'))
    },
    editInfo (info) {
      if (!this.editorMode) {
        return
      }
      this.editing = true
      this.infoText = info.infoText
      this.infoTitle = info.infoTitle
      this.dialog = true
    },
    updateInfo () {
      if (!this.infoText || !this.infoTitle) {
        this.removeInfo(this.infoId)
      } else {
        this.$http.secured.patch(`/api/v1/infos/${this.infoId}`, {
          info: {
            infoText: this.infoText,
            infoTitle: this.infoTitle,
            subject_id: this.subject
          }
        })
          .then(
            this.getInfos(),
            info.infoText = 'this.infoText',
            info.infoTitle = 'this.infoTitle'
          )
          .catch(error => this.setError(error, 'Cannot update info'))
      }
    },
    // Deletes given info via API
    removeInfo (info) {
      this.$http.secured.delete(`/api/v1/infos/${info}`)
        .then(response => {
          this.infos.splice(this.infos.indexOf(info), 1)
        })
        .catch(error => this.setError(error, 'Cannot delete link'))
    },
    clear () {
      this.infoId = null
      this.infoText = ''
      this.infoTitle = ''
    }
  }
}
</script>

<style lang="css" scoped>
  .infotitle {
    top: 5px;
    position: absolute;
    font-weight: 300;
    font-size: 18px;
  }
  .rightalign {
    text-align: right !important;
    right: 20px;
  }
  .leftabsolute {
    text-align: left !important;
    left: 20px;
  }
  .infocard {
    border-radius: 10px;
    border: solid 2px;
    border-bottom: 0px;
    border-left: 0px;
    border-right: 0px;
    border-color: #FC8668;
    padding-top: 0px !important;
    box-shadow: 0 0px 1px rgba(0, 0, 0, .05), 0 1px 2px rgba(0, 0, 0, .06);
    margin-bottom: 20px;
    margin-top: 20px;
  }

  .date {
    color: gray;
    font-weight: 300;
  }
  .m0 {
    padding-top: 10px;
  }
  .leftalign{
    text-align: left;
    font-size: 17px;
    font-weight: 200;
    margin-left: 5px;
  }
  hr{
  width: 100%;
  margin-top: 30px;
  margin-bottom: 7px;
  height: 1px;
  color: #c1c1c1;
  background-color: #c1c1c1;
  border: none;
  }
</style>

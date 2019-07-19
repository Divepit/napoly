<template>
  <div class="">

    <v-layout v-for="info in infos" :key="info.id">
      <v-flex xs12 sm12>
        <v-card class="infocard" @click="editInfo(info)">
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
    <v-icon class="unselectable" v-if="editorMode && signedIn()" color="" @click="dialog = !dialog; editing = false; stopEditing()">add_circle</v-icon>
    <v-layout row justify-center>
        <v-flex xs12 sm12>
        <v-dialog v-model="dialog" persistent >
          <v-card class="card">
            <v-card-title>
              <span v-if="editing" class="headline">Edit Info</span>
              <span v-else class="headline">Add Info</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-xl class="full-w">
                <v-layout wrap class="full-w">
                  <v-flex xs12 md12>
                    <v-text-field label="Info Title" v-model="newInfoTitle" required></v-text-field>
                  </v-flex>
                  <v-flex sm12 md6>
                    <v-textarea label="Info Text" v-model="newInfoText" auto-grow required @input="update"></v-textarea>
                  </v-flex>
                  <v-flex sm12 md6>
                    <vue-markdown class="leftalign bordered" :source="preview"> </vue-markdown>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-btn v-if="editing" color="error" flat @click="dialog = false; removeInfo(infoId)">Delete Info</v-btn>

              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false; stopEditing()">Close</v-btn>
              <v-btn v-if="editing" color="blue darken-1" flat @click="dialog = false; updateInfo()">Confirm</v-btn>
              <v-btn v-else color="blue darken-1" flat @click="dialog = false; addInfo()">Add</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
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
      newInfoText: '',
      newInfoTitle: '',
      editing: false,
      dialog: false,
      preview: ''
    }
  },
  components: {
    VueMarkdown
  },
  methods: {
    update () {
      this.preview = this.newInfoText
    },
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
      if (!this.newInfoText || !this.newInfoTitle) {
        return
      }
      this.$http.secured.post('/api/v1/infos/', {
        info: {
          infoText: this.newInfoText,
          infoTitle: this.newInfoTitle,
          subject_id: this.subject
        }
      })
        .then(response => {
          this.infos.push(response.data)
        })
    },
    editInfo (info) {
      if (!this.editorMode) {
        return
      }
      this.infoId = info.id
      this.editing = true
      this.dialog = true
      this.newInfoText = info.infoText
      this.newInfoTitle = info.infoTitle
      this.preview = this.newInfoText
    },
    updateInfo () {
      if (!this.newInfoText || !this.newInfoTitle) {
        this.removeInfo(this.infoId)
      } else {
        this.$http.secured.patch(`/api/v1/infos/${this.infoId}`, {
          info: {
            infoText: this.newInfoText,
            infoTitle: this.newInfoTitle,
            subject_id: this.subject
          }
        })
          .then(response => {
            this.getInfos()
            this.stopEditing()
          }
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
    stopEditing () {
      this.infoId = null
      this.editing = false
      this.newInfoText = ''
      this.newInfoTitle = ''
    }
  }
}
</script>

<style lang="css" scoped>
  .card {
    padding: 5px;
    word-break: break-all;
    overflow: hidden;
  }
  .full-h {
    height: 100%
  }
  .full-w {
    width: 100% !important;
    padding: 0px;
    margin: 0px;
    max-width: 100vw;
  }
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
  .bordered {
    border: solid 1px lightgray;
    padding: 20px;
    /* border-radius: 15px; */
  }
  .infocard {
    border-radius: 10px;
    border: solid 2px;
    border-bottom: 0px;
    border-left: 0px;
    border-right: 0px;
    border-color: #FC8668 !important;
    padding-top: 0px !important;
    box-shadow: 0 0px 1px rgba(0, 0, 0, .05), 0 1px 2px rgba(0, 0, 0, .06);
    margin-bottom: 20px;
    margin-top: 20px;
    word-break: break-all;
    overflow: hidden;
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

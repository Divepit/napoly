<template>

    <v-layout>
      <v-flex xs12 sm12>
        <v-card elevation="3" class="info-card" v-for="info in infos" :key="info.id" @click="startEdit(info)">
          <v-card-title  class="grey--text text--darken-2 subheading pb-0 pt-2">{{info.infoTitle}}</v-card-title>
          <hr class="mt-2">
          <v-card-text >
          <vue-markdown class="grey--text text--darken-1 text-xs-left font-weight-light subheading "> {{info.infoText}} </vue-markdown>
          </v-card-text>
        </v-card>
        <v-icon class="unselectable" v-if="showEditCtrls" @click="addingInfo=showInfoDialog=true">add_circle</v-icon>

        <v-dialog v-model="showInfoDialog" persistent>
          <v-card>
            <v-card-title >
              {{addingInfo?'Add':'Edit'}} Info
            </v-card-title>
            <v-card-text>
              <v-container grid-list-xl py-0 px-0>
                <v-layout wrap>
                  <v-flex xs12 md12>
                    <v-text-field  label="Info Title" v-model="activeInfo.infoTitle" required></v-text-field>
                  </v-flex>
                  <v-flex sm12 md6>
                    <v-textarea label="Info Text" v-model="activeInfo.infoText" auto-grow required></v-textarea>
                  </v-flex>
                  <v-flex sm12 md6 class="bordered">
                    <vue-markdown class="text-sm-left font-weight-light " :source="activeInfo.infoText"> </vue-markdown>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn v-if="!addingInfo" color="error" flat @click="removeInfo(activeInfo.id)">Remove</v-btn>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="cancelEdit()">Cancel</v-btn>
              <v-btn color="blue darken-1" flat @click="saveInfo()">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-flex>
    </v-layout>

</template>

<script>
import VueMarkdown from 'vue-markdown'
export default {
  name: 'SubjectInfos',
  props: ['subject', 'showEditCtrls'],
  created () {
    this.getInfos()
  },
  data () {
    return {
      infos: [],
      activeInfo: [],
      originalInfo: [],
      addingInfo: false,
      showInfoDialog: false
    }
  },
  components: {
    VueMarkdown
  },
  methods: {
    // Gets all infos from API with the current subject
    getInfos () {
      this.infos = []
      this.$http.secured.get('/api/v1/infos?subject_id=' + this.subject)
        .then(response => {
          this.infos = response.data
        })
    },
    saveInfo () {
      if (this.addingInfo) this.addInfo()
      else this.updateInfo()
    },
    // Adds info via API if newInfo is filled
    addInfo () {
      if (this.activeInfo.infoText && this.activeInfo.infoTitle) {
        this.$http.secured.post('/api/v1/infos/', {
          info: {
            infoText: this.activeInfo.infoText,
            infoTitle: this.activeInfo.infoTitle,
            subject_id: this.subject
          }
        }).then(response => {
          this.endEdit()
          this.infos.push(response.data)
        })
      }
    },
    startEdit (info) {
      if (!this.showEditCtrls) return
      this.addingInfo = false
      this.activeInfo = info
      this.originalInfo = {...info}
      this.showInfoDialog = true
    },
    endEdit () {
      this.showInfoDialog = false
      this.activeInfo = []
    },
    cancelEdit () {
      this.infos[this.infos.indexOf(this.activeInfo)] = this.originalInfo
      this.endEdit()
    },
    updateInfo () {
      if (!this.activeInfo.infoText || !this.activeInfo.infoTitle) {
        this.removeInfo(this.activeInfo.id)
      } else {
        this.$http.secured.patch(`/api/v1/infos/${this.activeInfo.id}`, {
          info: {
            infoText: this.activeInfo.infoText,
            infoTitle: this.activeInfo.infoTitle,
            subject_id: this.subject
          }
        }).then(response => this.endEdit())
      }
    },
    // Deletes given info via API
    removeInfo (info) {
      this.$http.secured.delete(`/api/v1/infos/${info}`)
        .then(response => {
          this.endEdit()
          this.infos.splice(this.infos.indexOf(info), 1)
        })
    }
  }
}
</script>

<style media="screen" lang="less" rel="stylesheet/less" scoped>

  @import url("../assets/styles/main");

  .info-card {
    border-radius: 10px;
    border-top: solid 3px;
    border-color: @accent !important;
    margin-top: 20px;
    margin-bottom: 20px;
  }

  hr{
  width: 100%;
  height: 1px;
  background-color: #c1c1c1;
  border: none;
  }

  @media (max-width: 767px) {
    .info-card {
      word-break: keep-all;
    }
  }
</style>

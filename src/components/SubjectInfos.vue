<template>

    <v-layout align-center justify-center>
      <v-flex xs12 sm12>
        <v-card class="info-card" v-for="info in infos" :key="info.id" @click="startEdit(info)">
          <v-card-title class="m0">
            <div style="width: 100%">
              <h3 class="leftabsolute infotitle">{{info.infoTitle}}</h3>
              <!-- <h3 class="rightalign infotitle date">Erstellt am: {{info.created_at}}</h3> -->
            </div>
            <hr class="divider">
            <vue-markdown class="leftalign not-underlined"> {{info.infoText}} </vue-markdown>
          </v-card-title>
        </v-card>
        <v-icon class="unselectable" v-if="showEditCtrls" @click="addingInfo=showInfoDialog=true">add_circle</v-icon>

        <v-dialog v-model="showInfoDialog" persistent max-width="1200px">
          <v-card class="dialog-card">
            <v-card-title>
              <span class="headline">{{addingInfo?'Add':'Edit'}} Info</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-xl class="full-w">
                <v-layout wrap class="full-w">
                  <v-flex xs12 md12>
                    <v-text-field label="Info Title" v-model="activeInfo.infoTitle" required></v-text-field>
                  </v-flex>
                  <v-flex sm12 md6>
                    <v-textarea label="Info Text" v-model="activeInfo.infoText" auto-grow required></v-textarea>
                  </v-flex>
                  <v-flex sm12 md6>
                    <vue-markdown class="leftalign bordered" :source="activeInfo.infoText"> </vue-markdown>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn v-if="!addingInfo" color="error" flat @click="removeInfo(activeInfo.id)">Remove Info</v-btn>
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

<style lang="css" scoped>

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
  .info-card {
    border-radius: 10px;
    border: solid 2px;
    border-bottom: 0;
    border-left: 0;
    border-right: 0;
    border-color: #FC8668 !important;
    padding-top: 0 !important;
    box-shadow: 0 0 1px rgba(0, 0, 0, .05), 0 1px 2px rgba(0, 0, 0, .06);
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

  @media (max-width: 767px) {
    .info-card {
      word-break: break-all;
      overflow: hidden;
    }
    /*.card {*/
    /*  padding: 5px;*/
    /*  word-break: break-all;*/
    /*  overflow: hidden;*/
    /*}*/
  }
</style>


<template>
  <div class="">
    <v-layout v-for="info in infos" :key="info.id">
      <v-flex xs12 sm12>
        <v-card class="infocard">
          <v-card-title class="m0">
            <div style="width: 100%">
              <h3 class="leftabsolute infotitle">{{info.infoTitle}}</h3>
              <h3 class="rightalign infotitle date">Erstellt am: {{info.created_at}}</h3>
            </div>
            <hr class="divider">
            <div class="leftalign"> {{info.infoText}} </div>
          </v-card-title>
        </v-card>
      </v-flex>
    </v-layout>
  </div>

</template>

<script>
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
      infoUrl: '',
      infoLabel: '',
      editing: false,
      dialog: false
    }
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
      if (!this.infoUrl || !this.infoLabel) {
        return
      }
      this.$http.secured.post('/api/v1/infos/', {
        info: {
          infoUrl: this.infoUrl,
          infoLabel: this.infoLabel,
          subject_id: this.subject
        }
      })

        .then(response => {
          this.infos.push(response.data)
        })
        .catch(error => this.setError(error, 'Cannot create link'))
    },
    editInfo (info) {
      this.editing = true
      this.infoUrl = info.infoUrl
      this.infoLabel = info.infoLabel
      this.dialog = true
    },
    updateInfo () {
      if (!this.infoUrl || !this.infoLabel) {
        this.removeInfo(this.infoId)
      } else {
        this.$http.secured.patch(`/api/v1/infos/${this.infoId}`, {
          info: {
            infoUrl: this.infoUrl,
            infoLabel: this.infoLabel,
            subject_id: this.subject
          }
        })
          .then(this.getInfos())
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
      this.infoUrl = ''
      this.infoLabel = ''
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
    border-color: #6772e5;
    padding-top: 0px !important;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .05), 0 4px 8px rgba(0, 0, 0, .06);
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

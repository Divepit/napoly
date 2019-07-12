<template>
    <v-container fluid :id="subjectName" class="hundred">
      <v-layout align-center justify-center>
        <v-flex xs12 sm12 md12>
          <v-card class="card">
            <div style="color: red;" v-if="error">{{ error }}</div>
            <div style="color: red;" v-if="info">{{ info }}</div>
            <h3 class="cardHeader">
              {{subjectName}}
              <SubjectButtons class="cardButton" v-bind:subject="subject" v-bind:editorMode="editorMode"/>
            </h3>

            <v-switch v-if="signer" color="success" v-model="editorMode" label="Edit Mode"></v-switch>
            <br>
            <br>
            <div>

              <div v-bind:class="[showEditCtrls ? 'scroller' : '', 'table-wrapper']">
                <table class="fl-table">
                  <thead>
                  <tr class="bordered">
                    <th class="bordered fonted">Week
                      <v-icon class="unselectable" v-if="showEditCtrls" @click="addWeek()">add_circle</v-icon>
                      <v-icon class="unselectable" v-if="showEditCtrls" @click="removeWeek()">remove_circle</v-icon>
                    </th>
                    <th class="bordered fonted" v-for="type in types" :key="type.id"> {{type.typeName}} </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(week,index) in weekCount" :key="index" v-if="weeks.includes(week) || showEditCtrls">
                    <td class="fonted">{{index + 1}}</td>
                    <td class="fonted hide-overflow" v-if="showEditCtrls" v-for="type in types" :key="type.id"
                        @click.stop="startEdit(week,type)">{{ displayUrl(week, type) }}</td>
                    <td class="fonted" v-if="!showEditCtrls" v-for="type in types" :key="type.id">
                      <a style="color: #0E9CE4; text-decoration: none;" v-if="displayUrl(week,type)" target="_blank"
                         :href="displayUrl(week,type)">{{type.typeName}} {{week}}</a>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>

              <div v-if="showEditCtrls">
                <v-btn class="fatfonted" v-if="allTypes" depressed color="success" @click="getTypes()">Hide Types</v-btn>
                <v-btn class="fatfonted" v-else depressed color="success" @click="seeAllTypes()">See All Types</v-btn>
                <v-btn class="fatfonted" depressed color="error" dark @click.stop="showDeleteDialog=true">Delete Subject</v-btn>
              </div>

            </div>

            <v-dialog v-model="showEditDialog" persistent max-width="600px">
              <v-card class="card">
                <v-card-title>
                  <span class="headline">{{adding?'Add':'Edit'}} Link</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-text-field placeholder="Link URL" v-on:keyup.enter="saveLink()" required v-model="(adding?newLink:editedLink).linkUrl"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-btn v-if="!adding" color="error" flat  @click="removeLink()">Remove Link</v-btn>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="cancelEdit()">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat  @click="saveLink()">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="showDeleteDialog" persistent max-width="290">
              <v-card class="card">
                <v-card-title class="headline fonted" style="color: red; text-align: left; font-size: 20px !important;">Delete {{subjectName}}?</v-card-title>
                <v-card-text class="fonted" style="text-align: left; font-size: 18px; width: 100%;">This will delete all links, buttons and infos and <strong>cannot</strong> be undone.</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn depressed @click="showDeleteDialog=false">Cancel</v-btn>
                  <v-btn color="error" depressed @click="removeSubject();showDeleteDialog=false">Delete</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <SubjectInfos v-bind:subject="subject" v-bind:editorMode="editorMode"/>

          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
import SubjectButtons from '@/components/SubjectButtons'
import SubjectInfos from '@/components/SubjectInfos'
import {mapState} from 'vuex'

export default {
  name: 'SubjectTable',
  props: ['subject'],
  components: {
    SubjectButtons,
    SubjectInfos
  },
  data () {
    return {
      // subject: 2,
      links: [],
      newLink: [],
      editedLink: [],
      originalLink: '',
      newButton: [],
      error: '',
      types: [],
      info: '',
      subjectName: '',
      showDeleteDialog: false,
      showEditDialog: false,
      editorMode: false,
      weekCount: null,
      allTypes: false,
      adding: false,
      weeks: []
    }
  },
  created () {
    this.getLinks()
    this.getSubjectName()
  },
  computed: {
    ...mapState([
      'signer'
    ]),
    showEditCtrls: function () {
      return this.signer && this.editorMode
    }
  },
  methods: {
    getWeeks () {
      var i
      for (i = 0; i < this.links.length; i++) {
        if (!this.weeks.includes(this.links[i].linkWeek)) {
          this.weeks.push(this.links[i].linkWeek)
        }
      }
    },
    // Sets error variable to the given error or if no error is present text
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    // Sets adding false and resets newLink
    exitAdding () {
      this.adding = false
      this.newLink = []
    },
    // Sets subjectName to the subjectName of the current subject
    getSubjectName () {
      this.$http.secured.get(`/api/v1/subjects/${this.subject}`)
        .then(response => {
          this.subjectName = response.data.subjectName
          this.weekCount = response.data.weekCount
        })
    },
    // Sends delete commant to API for current subject
    removeSubject () {
      this.$http.secured.delete(`/api/v1/subjects/${this.subject}`)
        .then(this.info = 'Subject will be removed on reload')
        .catch(error => this.setError(error, 'Cannot delete Subject'))
    },
    // Gets all types available in API and calls reduceTypes
    getTypes () {
      this.types = []
      this.allTypes = false
      this.$http.secured.get('/api/v1/types')
        .then(response => {
          this.types = response.data
          this.reduceTypes()
        })
        .catch(error => this.setError(error, 'Something went wrong with Types'))
    },
    // Gets all types available in API (and does not call reduceTypes)
    seeAllTypes () {
      this.allTypes = true
      this.$http.secured.get('/api/v1/types')
        .then(response => {
          this.types = response.data
        })
        .catch(error => this.setError(error, 'Something went wrong with Types'))
    },
    // Removes all types from types[] for which there is no Link in current links[]
    reduceTypes () {
      var reducedTypes = []
      var i
      for (i = 0; i < this.links.length; i++) {
        if (!reducedTypes.includes(this.links[i].type_id)) {
          reducedTypes.push(this.links[i].type_id)
        }
      }
      var finalTypes = []
      for (i = 0; i < this.types.length; i++) {
        if (reducedTypes.includes(this.types[i].id)) {
          finalTypes.push(this.types[i])
        }
      }
      this.types = finalTypes
    },
    // Increments weekCount for current subject
    addWeek () {
      this.weekCount += 1
      this.$http.secured.patch('/api/v1/subjects/' + this.subject, {
        subject: {
          weekCount: this.weekCount
        }
      })
    },
    // Decrements weekCount for current subject
    removeWeek () {
      if (this.weekCount > 0) {
        this.weekCount -= 1
      }
      this.$http.secured.patch('/api/v1/subjects/' + this.subject, {
        subject: {
          weekCount: this.weekCount
        }
      })
    },
    // Gets all links from API with the current subject and then calls getTypes()
    getLinks () {
      this.$http.secured.get('/api/v1/links?subject_id=' + this.subject)
        .then(response => {
          this.links = response.data
          this.getTypes()
          if (this.links.length === 0) {
            this.links.push(1)
          }
          this.getWeeks()
        })
        .catch(error => this.setError(error, 'Something went wrong with Links'))
    },
    saveLink (link) {
      this.showEditDialog = false
      if (this.adding) this.addLink()
      else this.updateLink()
    },
    // Adds link via API if newLink is filled
    addLink () {
      if (!this.newLink.linkUrl) {
        this.exitAdding()
        console.log('No Link given')
        return
      }
      this.$http.secured.post('/api/v1/links/', {
        link: {
          linkUrl: this.newLink.linkUrl,
          subject_id: this.newLink.subject_id,
          linkWeek: this.newLink.linkWeek,
          type_id: this.newLink.type_id
        }
      })

        .then(response => {
          this.links.push(response.data)
          this.exitAdding()
        })

        .catch(error => this.setError(error, 'Cannot create link'))
    },
    // Checks if a link for the given week and type is present. If there is,
    // editedLink is set to said link. If there is no link yet, it sets adding
    // to true and fills newLink.
    startEdit (week, type) {
      var answer = this.$data.links.find((link) => link.linkWeek === week && link.type_id === type.id)
      if (!answer) {
        this.adding = true
        this.editedLink = []
        this.newLink.subject_id = this.subject
        this.newLink.linkWeek = week
        this.newLink.type_id = type.id
      } else {
        this.adding = false
        this.editedLink = answer
        this.originalLink = answer.linkUrl
      }
      this.showEditDialog = true
    },
    cancelEdit () {
      this.showEditDialog = false
      if (!this.adding) this.$data.links.find((link) => link.linkWeek === this.editedLink.linkWeek && link.type_id === this.editedLink.type_id).linkUrl = this.originalLink
    },
    // If link has a linkUrl (is not empty) the link is patched with the given
    // object. If link has no linkUrl (is empty) removeLink(link) is called.
    updateLink () {
      if (!this.editedLink.linkUrl) {
        this.removeLink()
      } else {
        this.$http.secured.patch(`/api/v1/links/${this.editedLink.id}`, {
          link: {
            linkUrl: this.editedLink.linkUrl,
            subject_id: this.editedLink.subject_id,
            linkWeek: this.editedLink.linkWeek,
            type_id: this.editedLink.type_id
          }
        }).catch(error => this.setError(error, 'Cannot update link'))
      }
    },
    // Deletes given link via API
    removeLink () {
      this.showEditDialog = false
      this.$http.secured.delete(`/api/v1/links/${this.editedLink.id}`)
        .then(response => {
          this.links.splice(this.links.indexOf(this.editedLink), 1)
        })
        .catch(error => this.setError(error, 'Cannot delete link'))
    },
    // Returns linkUrl of link with given week and type in links[]
    displayUrl (week, type) {
      var answer = this.$data.links.find(function (link) {
        var speclink = (link.linkWeek === week && link.type_id === type.id)
        return speclink
      })
      if (answer) {
        return answer.linkUrl
      } else {
      }
    }
  }
}
</script>
<style media="screen">

  .hundred {
    margin: 0px;
  }
  .scroller{
    overflow: scroll;
    height: 50vh;
  }

  .unselectable {
   -moz-user-select: -moz-none;
   -khtml-user-select: none;
   -webkit-user-select: none;

   /*
     Introduced in IE 10.
     See http://ie.microsoft.com/testdrive/HTML5/msUserSelect/
   */
   -ms-user-select: none;
   user-select: none;
}

  .fonted {
    font-family: Roboto,sans-serif !important;
    font-weight: 300;
  }
  .fatfonted {
    font-family: Roboto,sans-serif !important;
    font-weight: 400;
  }
  .hide-overflow {
    overflow: hidden;
    max-width: 10px;
  }

  .bordered {
    background: transparent !important;
    background-color: inherit;
  }

  /* Card Styles */
  .card {
    border-radius: 20px !important;
    background: #fcfcfc;
    /* box-shadow: 0 2px 10px rgba(0, 0, 0, .08), 0 0 6px rgba(0, 0, 0, .05); */
    transition: .3s transform cubic-bezier(.155, 1.105, .295, 1.12), .3s box-shadow, .3s -webkit-transform cubic-bezier(.155, 1.105, .295, 1.12);
    padding: 14px 80px 18px 36px;
    cursor: pointer;
  }

  .card:hover {
    transform: scale(1.001);
    box-shadow: 0 10px 20px rgba(0, 0, 0, .12), 0 4px 8px rgba(0, 0, 0, .06);
  }

  .card h3 {
    font-weight: 200;
    font-size: 40px;
    color: #0E9CE4;
    text-align: left;
  }

  @media(max-width: 990px) {
    .card {
      margin: 20px;
    }
  }

  /* Table Styles , https://codepen.io/florantara/pen/dROvdb*/

  .table-wrapper {
    margin: 10px 70px 20px;
    border-radius: 20px !important;
    border: solid;
    border-bottom: 0px;
    border-left: 0px;
    border-right: 0px;
    border-color: #FC8668;
    background: white !important;
    box-shadow: 0 0px 1px rgba(0, 0, 0, .05), 0 1px 3px rgba(0, 0, 0, .06);
  }

  .fl-table {
    border-radius: 20px !important;
    font-size: 17px;
    font-weight: normal;
    border: none;
    border-collapse: collapse;
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    white-space: nowrap;
  }

  .fl-table td,
  .fl-table th {
    text-align: center;

    padding: 8px;
  }

  .fl-table td {
    border-right: 1px solid #f8f8f8;
    font-size: 15px;
  }

  .fl-table thead th {
    border-bottom: 1px solid #f8f8f8;
  }

  /* .fl-table thead th:nth-child(odd) {
} */

  .fl-table tr:nth-child(even) {
    background: #F8F8F8;
  }

  /* Responsive */
  .cardHeader {
    display: flex;
    justify-content: space-between;
  }

  @media (max-width: 767px) {
    .cardHeader {
      align-self: center;
      display: inline;
      font-size: 3rem !important;
    }

    .cardButton {
      display: grid;
      margin-top: 15px;
    }

    .card {
      padding: 3.5px 10px 5px 10px;
      cursor: pointer;
      margin-left: 0px;
      margin-right: 0px;
    }
    .container {
      padding: 5px;
    }

    .fl-table {
      display: block;
      width: 100%;
      margin-bottom: 20px;
    }

    .table-wrapper {
      margin: 0px 0px 0px;
      width: auto;
      display: block;
      text-align: left;
      font-size: 15px;
      background: white;
      padding: 0 0 0px;
    }

    .fl-table thead,
    .fl-table tbody,
    .fl-table thead th {
      display: block;
    }

    .fl-table thead th:last-child {
      border-bottom: none;
    }

    .fl-table thead {
      float: left;
    }

    .fl-table tbody {
      width: auto;
      position: relative;
      overflow-x: auto;
    }

    .fl-table td,
    .fl-table th {
      padding: 20px .625em .625em .625em;
      height: 60px;
      vertical-align: middle;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;
      width: 120px;
      font-size: 15px;
      text-overflow: ellipsis;
    }

    .fl-table thead th {
      text-align: left;
      border-bottom: 1px solid #f7f7f9;
      max-width: 75px;
    }

    .fl-table tbody tr {
      display: table-cell;
    }

    .fl-table tbody tr:nth-child(odd) {
      background: none;
    }

    .fl-table tr:nth-child(even) {
      background: white;
    }

    .fl-table tr td:nth-child(odd) {
      background: #F8F8F8;
      border-right: 1px solid #E6E4E4;
    }

    .fl-table tr td:nth-child(even) {
      border-right: 1px solid #E6E4E4;
    }

    .fl-table tbody td {
      display: block;
      text-align: center;
    }
  }
</style>

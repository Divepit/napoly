<template>
    <v-container fluid :id="subjectName" class="hundred">
      <v-layout align-center justify-center>
        <v-flex xs12 sm12 md12>
          <v-card class="card">
            <div style="color: red;" v-if="error">{{ error }}</div>
            <div style="color: red;" v-if="info">{{ info }}</div>
            <div class="card-header">
              <h3>{{subjectName}}</h3>
              <SubjectButtons class="card-button" v-bind:subject="subject" v-bind:editorMode="editorMode"/>
            </div>

            <div class="card-controls">
              <v-switch v-if="authorize()" color="success" v-model="editorMode" label="Edit Mode" class="control-switch"></v-switch>
              <v-btn  v-if="showEditCtrls" class="fatfonted delete-subject" color="error" dark @click.stop="showDeleteDialog=true">Delete Subject</v-btn>
            </div>

            <div v-bind:class="[showEditCtrls ? 'edit-mode' : 'view-mode', 'card-table']">
              <table class="fl-table">
                <thead>
                <tr class="bordered">
                  <th class="bordered fonted">Week</th>
                  <th class="bordered fonted" v-for="type in typesUsed" :key="type" @click="editType(type)">
                    {{getTypeName(type)}} <v-icon v-if="showEditCtrls" small class="unselectable edit-type">edit</v-icon>
                  </th>
                  <th v-if="showAddType"><v-icon class="unselectable" @click="addType()">add_circle</v-icon></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="week in weekCount" :key="week" v-if="weeks.includes(week) || showEditCtrls">
                  <td class="fonted">{{week}}</td>
                  <td class="fonted hide-overflow" v-if="showEditCtrls" v-for="type in typesUsed" :key="type"
                      @click.stop="startEdit(week,type)">{{ displayUrl(week,type) }}</td>
                  <td class="fonted" v-if="!showEditCtrls" v-for="type in typesUsed" :key="type">
                    <a style="color: #0E9CE4; text-decoration: none;" v-if="displayUrl(week,type)" target="_blank"
                       :href="displayUrl(week,type)">{{getTypeName(type)}} {{week}}</a>
                  </td>
                  <td v-if="showAddType"></td>
                </tr>
                <tr v-if="showEditCtrls && weekCount<20">
                  <td><v-icon class="unselectable" v-if="showEditCtrls" @click="weekCount += 1">add_circle</v-icon></td>
                  <td v-for="type in typesUsed" :key="type"></td>
                  <td v-if="showAddType"></td>
                </tr>
                </tbody>
              </table>
            </div>

            <v-dialog v-model="showLinkDialog" persistent max-width="600px">
              <v-card class="card">
                <v-card-title style="display: inline-block; width: 100%">
                  <span style="float: left" class="headline">{{addingLink?'Add':'Edit'}} Link</span>
                  <span style="float: right">{{getTypeName(activeLink.type_id)}} | Week {{activeLink.linkWeek}}</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-text-field placeholder="Link URL" v-on:keyup.enter="saveLink()" required v-model="activeLink.linkUrl"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-btn v-if="!addingLink" color="error" flat  @click="removeLink()">Remove Link</v-btn>
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

            <v-dialog v-model="showTypeDialog" persistent max-width="290">
              <v-card class="card">
                <v-card-title>
                  <span class="headline">{{initialType?'Edit':'Add'}} Type</span>
                </v-card-title>
                <v-card-text>
                  <v-container grid-list-md>
                    <v-layout wrap>
                      <v-flex xs12>
                        <v-select v-on:enter="saveType()" required v-model="newType" :items="typesAvailable" item-text="typeName" item-value="id"></v-select>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="showTypeDialog=false">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat  @click="saveType()">Save</v-btn>
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
import { mapState } from 'vuex'

export default {
  name: 'SubjectTable',
  props: ['subject', 'allTypes'],
  components: {
    SubjectButtons,
    SubjectInfos
  },
  data () {
    return {
      links: [],
      weekCount: 0,
      activeLink: [],
      originalLink: '',
      newButton: [],
      typesUsed: [],
      typesAvailable: [],
      newType: 0,
      error: '',
      info: '',
      subjectName: '',
      showDeleteDialog: false,
      showLinkDialog: false,
      showTypeDialog: false,
      editorMode: false,
      addingLink: false,
      initialType: false
    }
  },
  created () {
    this.getData()
  },
  computed: {
    ...mapState([
      'signer',
      'field',
      'userField',
      'admin'
    ]),
    showEditCtrls: function () {
      return this.signer && this.editorMode
    },
    showAddType: function () {
      return this.typesUsed.length < 4 && this.showEditCtrls
    },
    weeks: function () {
      return this.$data.links.map(function (link, index) { return link.linkWeek })
    }
  },
  methods: {
    // Sets error variable to the given error or if no error is present text
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    // Sets subjectName to the subjectName of the current subject
    getData () {
      this.$http.secured.get('/api/v1/subjects/' + this.subject)
        .then(response => {
          this.subjectName = response.data.subjectName
        })
      this.$http.secured.get('/api/v1/links?subject_id=' + this.subject)
        .then(response => {
          if (response.data.length) {
            this.links = response.data
            this.weekCount = Math.max(...this.weeks)
            this.typesUsed = [...new Set(this.$data.links.map(function (link, index) { return link.type_id }))]
          } else {
            this.weekCount = 1
            this.typesUsed = [2]
          }
        })
        .catch(error => this.setError(error, 'Something went wrong with Links'))
    },
    getTypeName (typeId) {
      return (this.allTypes.find((type) => type.id === typeId) || []).typeName
    },
    // Sends delete command to API for current subject
    removeSubject () {
      this.$http.secured.delete(`/api/v1/subjects/${this.subject}`)
        .then(this.info = 'Subject will be removed on reload')
        .catch(error => this.setError(error, 'Cannot delete Subject'))
    },
    saveType () {
      this.showTypeDialog = false
      if (this.initialType) {
        this.typesUsed[this.typesUsed.indexOf(this.initialType)] = this.newType
        if (this.initialType) this.typesUsed = this.typesUsed.filter((type) => this.initialType !== type)
        this.$http.secured.patch(`/api/v1/links/type`, {
          subject_id: this.subject,
          type_new: this.newType,
          type_old: this.initialType
        }).catch(error => this.setError(error, 'Cannot update links'))
        this.links.filter((link) => link.type_id === this.initialType).forEach(function (link) { link.type_id = this.newType }, this)
      } else {
        this.typesUsed.push(this.newType)
      }
    },
    addType () {
      this.initialType = false
      this.typesAvailable = this.allTypes.filter((type) => !this.typesUsed.includes(type.id))
      this.newType = this.typesAvailable[0].id
      this.showTypeDialog = true
    },
    editType (typeId) {
      if (!this.showEditCtrls) return false
      this.newType = this.initialType = typeId
      this.typesAvailable = this.allTypes.filter((type) => !this.typesUsed.includes(type.id) || type.id === typeId)
      this.showTypeDialog = true
    },
    saveLink () {
      this.showLinkDialog = false
      if (this.addingLink) this.addLink()
      else this.updateLink()
    },
    // Adds link via API if activeLink is filled
    addLink () {
      if (!this.activeLink.linkUrl) {
        console.log('No Link given')
      } else {
        this.$http.secured.post('/api/v1/links/', {
          link: {
            linkUrl: this.activeLink.linkUrl,
            subject_id: this.activeLink.subject_id,
            linkWeek: this.activeLink.linkWeek,
            type_id: this.activeLink.type_id
          }
        }).then(response => {
          this.links.push(response.data)
        }).catch(error => this.setError(error, 'Cannot create link'))
      }
      this.addingLink = false
    },
    // Checks if a link for the given week and type is present. If there is,
    // activeLink is set to said link. If there is no link yet, it sets adding
    // to true and fills activeLink.
    startEdit (week, type) {
      const answer = this.$data.links.find((link) => link.linkWeek === week && link.type_id === type)
      if (!answer) {
        this.addingLink = true
        this.activeLink.subject_id = this.subject
        this.activeLink.linkWeek = week
        this.activeLink.type_id = type
        this.activeLink.linkUrl = ''
      } else {
        this.addingLink = false
        this.activeLink = answer
        this.originalLink = answer.linkUrl
      }
      this.showLinkDialog = true
    },
    cancelEdit () {
      this.showLinkDialog = false
      if (!this.addingLink) this.$data.links.find((link) => link.linkWeek === this.activeLink.linkWeek && link.type_id === this.activeLink.type_id).linkUrl = this.originalLink
    },
    // If link has a linkUrl (is not empty) the link is patched with the given
    // object. If link has no linkUrl (is empty) removeLink(link) is called.
    updateLink () {
      if (!this.activeLink.linkUrl) {
        this.removeLink()
      } else {
        this.$http.secured.patch(`/api/v1/links/${this.activeLink.id}`, {
          link: {
            linkUrl: this.activeLink.linkUrl,
            subject_id: this.activeLink.subject_id,
            linkWeek: this.activeLink.linkWeek,
            type_id: this.activeLink.type_id
          }
        }).catch(error => this.setError(error, 'Cannot update link'))
      }
    },
    // Deletes given link via API
    removeLink () {
      this.showLinkDialog = false
      this.$http.secured.delete(`/api/v1/links/${this.activeLink.id}`)
        .then(response => {
          this.links.splice(this.links.indexOf(this.activeLink), 1)
        })
        .catch(error => this.setError(error, 'Cannot delete link'))
    },
    // Returns linkUrl of link with given week and type in links[]
    displayUrl (week, type) {
      var answer = this.$data.links.find(function (link) {
        var speclink = (link.linkWeek === week && link.type_id === type)
        return speclink
      })
      if (answer) {
        return answer.linkUrl
      }
    },
    authorize () {
      if (this.signer && (localStorage.admin === '1' || this.userField === `${this.field}`)) { return true }
      return false
    }
  }
}
</script>
<style media="screen">

  .hundred {
    margin: 0;
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
    background: transparent;
  }

  /* Card Styles */
  .card {
    border-radius: 20px !important;
    background: #fcfcfc;
    transition: .3s transform cubic-bezier(.155, 1.105, .295, 1.12), .3s box-shadow, .3s -webkit-transform cubic-bezier(.155, 1.105, .295, 1.12);
    padding: 18px 36px 18px 36px;
  }

  .card:hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, .12), 0 4px 8px rgba(0, 0, 0, .06);
  }

  .card h3 {
    font-weight: 200;
    font-size: 40px;
    color: #0E9CE4;
  }

  @media(max-width: 990px) {
    .card {
      margin: 20px;
    }
  }

  .card-table {
    margin: 20px 0;
    border-radius: 20px !important;
    border: solid #FC8668;
    border-left-width: 0;
    border-right-width: 0;
    border-bottom-width: 0;
    background: white !important;
    box-shadow: 0 0 1px rgba(0, 0, 0, .05), 0 1px 3px rgba(0, 0, 0, .06);
  }

  .edit-mode{
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
  }

  /* Table Styles , https://codepen.io/florantara/pen/dROvdb*/

  .fl-table {
    font-size: 17px;
    font-weight: normal;
    border: none;
    border-collapse: collapse;
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    white-space: nowrap;
  }

  .fl-table td {
    font-size: 15px;
    border-right: 1px solid #f8f8f8;
  }

  .fl-table td a{
    display: block;
  }

  .fl-table th,
  .fl-table td a {
    padding: 8px;
  }

  .view-mode .fl-table td:not(:empty):not(:first-of-type):hover{
    background-color: rgba(252,134,104,.05);
  }

  .edit-mode .fl-table td:not(:first-of-type):hover{
    background-color: rgba(252,134,104,.05);
    cursor: text;
  }

  .fl-table thead th {
    border-bottom: 1px solid #f8f8f8;
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    word-break: keep-all;
    white-space: nowrap;
  }

  .card-button {
    white-space: pre-line;
    text-align: end;
  }

  .delete-subject {
    border-radius: 5px;
  }

  @media (min-width: 767px) {
    .fl-table td,
    .fl-table th {
      background: white;
      text-align: center;
    }

    .fl-table tr:first-child th:first-child{
      border-top-left-radius: 20px;
    }

    .fl-table tr:first-child th:last-child{
      border-top-right-radius: 20px;
    }

    .fl-table tr:last-child td:first-child{
      border-bottom-left-radius: 20px;
    }

    .fl-table tr:last-child td:last-child{
      border-bottom-right-radius: 20px;
    }

    .fl-table tr:nth-child(even) td {
      background: #F8F8F8;
    }

    .card-controls {
      display: flex;
      justify-content: space-between;
      word-break: keep-all;
      white-space: nowrap;
    }

    th:first-child,
    td:first-child {
      width: 80px;
    }

    .edit-mode th:first-child,
    .edit-mode td:first-child {
      position: absolute;
    }

    .edit-mode th:nth-child(2),
    .edit-mode td:nth-child(2) {
      padding-left: 88px;
    }

    .edit-mode td{
      height: 38px;
      padding: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  @media (max-width: 767px) {
    .card-header {
      align-self: center;
      display: inline;
    }

    .control-switch {
      justify-content: center;
    }

    .card h3{
      font-size: 2rem !important;
    }

    .hide-overflow {
      max-width: 100%;
    }

    .card-button, .card-controls {
      display: grid;
      margin-top: 15px;
    }

    .card {
      padding: 5px 10px 5px 10px;
      margin-left: 0;
      margin-right: 0;
    }

    .fl-table {
      display: block;
      width: 100%;
    }

    .card-table {
      margin: 20px 0 20px;
      width: auto;
      display: block;
      text-align: left;
      font-size: 15px;
      background: white;
      padding: 0;
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
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
    }

    .fl-table tbody {
      width: auto;
      position: relative;
      overflow-x: scroll;
      -webkit-overflow-scrolling: touch;
      border-top-right-radius: 20px;
      border-bottom-right-radius: 20px;
    }

    .fl-table td,
    .fl-table th {
      font-size: 15px;
      overflow: hidden;
      vertical-align: middle;
      box-sizing: border-box;
      text-overflow: ellipsis;
    }

    .fl-table td:not(:first-of-type),
    .fl-table th:not(:first-of-type) {
      height: 54px;
    }

    .fl-table thead th {
      text-align: left;
      border-bottom: 1px solid #f7f7f9;
      max-width: 75px;
    }

    .fl-table thead th .edit-type {
      display: none;
    }

    .fl-table th,
    .fl-table td a{
      padding: 16px 8px;
    }

    .fl-table tr th:first-of-type,
    .fl-table tr td:first-of-type {
      padding: 8px 8px;
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
      min-width: 100px;
      max-width: 140px;
      text-align: center;
    }

    .edit-mode .fl-table tbody td:not(:first-child) {
      line-height: 38px;
      padding: 8px;
    }
  }
</style>

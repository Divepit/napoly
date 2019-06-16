<template>
  <section class="" :id="subjectName">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <div class="card">
            <div style="color: red;" v-if="error">{{ error }}</div>
            <div style="color: red;" v-if="info">{{ info }}</div>
            <h3>{{subjectName}}</h3>
            <!-- <p class="infos" v-if="editorMode">Instructions:</p>
            <p class="infos" v-if="editorMode">- Click an existing button to edit or delete it</p>
            <p class="infos" v-if="editorMode">- Click a table cell (empty or filled) to edit or delete it</p>
            <p class="infos" v-if="editorMode">- Hitting save when a link url / button url / button label is empty, will delete the corresponding button/link</p> -->
            <SubjectButtons v-bind:subject="subject" v-bind:editorMode="editorMode"/>
            <v-switch v-if="signedIn()" color="success" v-model="editorMode" label="Edit Mode"></v-switch>
            <br>
            <br>
            <div>
              <v-dialog v-model="dialog" persistent max-width="600px">
                <template v-if="signedIn() && editorMode" v-slot:activator=" {on} ">
                  <div class="table-wrapper">
                    <v-icon class="unselectable" color="" x-large @click="addWeek()">add_circle</v-icon>
                    <v-icon class="unselectable" color="" x-large @click="removeWeek()">remove_circle</v-icon>
                    <table class="fl-table">
                      <thead>
                        <tr class="bordered">
                          <th class="bordered fonted"> Week </th>
                          <th class="bordered fonted" v-for="type in types" :key="type.id"> {{type.typeName}} </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="" v-for="(week,index) in weekCount" :key="index">
                          <td class="fonted">{{index + 1}}</td>
                          <td class="fonted hide-overflow" v-on="on" v-for="type in types" :key="type.id" @click="editMode(week,type)">{{ displayUrl(week,type) }}
                            <v-icon class="unselectable" v-if="!displayUrl(week,type)">add</v-icon>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </template>
                <template v-else v-slot:activator="{on}">
                  <div class="table-wrapper">
                    <table class="fl-table">
                      <thead>
                        <tr class="bordered">
                          <th class="bordered fonted"> Week </th>
                          <th class="bordered fonted" v-for="type in types" :key="type.id"> {{type.typeName}} </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr class="" v-for="(week,index) in weekCount" :key="index">
                          <td class="fonted">{{index + 1}}</td>
                          <td class="fonted"  v-for="type in types" :key="type.id">
                            <a style="color: #6772e5; text-decoration: none;" v-if="displayUrl(week,type)" target="_blank" :href="displayUrl(week,type)">{{type.typeName}} {{week}}</a>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </template>
                <v-card v-for="(link, index) in links" :key="link.id" :link="link" v-if="link == editedLink || adding && index == 0">
                  <v-card-title>
                    <span v-if="adding" class="headline">Add Link</span>
                    <span v-else class="headline">Edit Link</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>
                      <v-layout wrap>
                        <v-flex xs12>
                          <div v-if="link == editedLink">
                            <v-text-field label="Editing" v-on:keyup.enter="updateLink(link); dialog = false" required v-model="link.linkUrl"></v-text-field>
                          </div>
                          <div v-if="adding">
                            <v-text-field label="Adding" v-on:keyup.enter="addLink(); dialog = false" required v-model="newLink.linkUrl"></v-text-field>
                          </div>
                        </v-flex>
                      </v-layout>
                    </v-container>
                  </v-card-text>
                  <v-card-actions>

                    <v-btn v-if="link == editedLink && signedIn()" color="error" flat  @click="removeLink(link); dialog = false">Remove Link</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click="dialog = false">Cancel</v-btn>
                    <v-btn v-if="link == editedLink && signedIn()" color="blue darken-1" flat  @click="updateLink(link); dialog = false">Save</v-btn>
                    <v-btn v-if="adding && signedIn()" color="blue darken-1" flat  @click="addLink(); dialog = false">Save</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>

            </div>
            <v-dialog v-if="editorMode && signedIn()" v-model="deleting" persistent max-width="290">
              <template v-slot:activator="{ on }">
                <v-btn class="fatfonted" v-if="allTypes" depressed color="success" @click="getTypes()">Hide Types</v-btn>
                <v-btn class="fatfonted" v-else depressed color="success" @click="seeAllTypes()">See All Types</v-btn>
                <v-btn class="fatfonted" depressed color="error" dark v-on="on">Delete Subject</v-btn>
              </template>
              <v-card>
                <v-card-title class="headline fonted" style="color: red;">Delete {{subjectName}}?</v-card-title>
                <v-card-text class="fonted" style="text-align: left;">This cannot be undone</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="" depressed @click="deleting = false">Cancel</v-btn>
                  <v-btn color="error" depressed @click="deleting = false; removeSubject()">Delete</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </div>
    </div>
    <br>
  </section>
</template>

<script>
import SubjectButtons from '@/components/SubjectButtons'

export default {
  name: 'Links',
  props: ['subject'],
  components: {
    SubjectButtons
  },
  data () {
    return {
      // subject: 2,
      links: [],
      newLink: [],
      newButton: [],
      error: '',
      editedLink: '',
      types: [],
      adding: false,
      info: '',
      subjectName: '',
      deleting: false,
      dialog: false,
      editorMode: false,
      weekCount: null,
      allTypes: false
    }
  },
  created () {
    this.getLinks()
    this.getSubjectName()
  },
  methods: {
    // Returns true if localStorage.signedIn is true
    signedIn () {
      return localStorage.signedIn
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
        })
        .catch(error => this.setError(error, 'Something went wrong with Links'))
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
    // Sets editedLink to provided object
    editLink (link) {
      this.editedLink = link
      this.exitAdding()
    },
    // Checks if a link for the given week and type is present. If there is,
    // editedLink is set to said link. If there is no link yet, it sets adding
    // to true and fills newLink.
    editMode (week, type) {
      if (!this.signedIn()) {
        return
      }
      this.adding = false
      this.editedLink = ''
      var answer = this.$data.links.find(function (link) {
        return (link.linkWeek === week && link.type_id === type.id)
      })
      if (!answer) {
        this.adding = true
        this.newLink.subject_id = this.subject
        this.newLink.linkWeek = week
        this.newLink.type_id = type.id
      } else {
        this.editedLink = answer
      }
    },
    // If link has a linkUrl (is not empty) the link is patched with the given
    // object. If link has no linkUrl (is empty) removeLink(link) is called.
    updateLink (link) {
      this.editedLink = ''
      if (!link.linkUrl) {
        this.removeLink(link)
      } else {
        this.$http.secured.patch(`/api/v1/links/${link.id}`, {
          link: {
            linkUrl: link.linkUrl,
            subject_id: link.subject_id,
            linkWeek: link.linkWeek,
            type_id: link.type_id
          }
        })
          .catch(error => this.setError(error, 'Cannot update link'))
      }
    },
    // Deletes given link via API
    removeLink (link) {
      this.$http.secured.delete(`/api/v1/links/${link.id}`)
        .then(response => {
          this.links.splice(this.links.indexOf(link), 1)
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
  .infos {
    font-size: 15px;
    color: gray
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

  .theme--light.application {
    background: transparent !important;
    color: rgba(0, 0, 0, .87);
  }

  .bordered {
    background: transparent !important;
    background-color: inherit;
  }

  /* Card Styles */
  .card {
    border-radius: 20px;
    background: #fcfcfc;
    box-shadow: 0 6px 10px rgba(0, 0, 0, .08), 0 0 6px rgba(0, 0, 0, .05);
    transition: .3s transform cubic-bezier(.155, 1.105, .295, 1.12), .3s box-shadow, .3s -webkit-transform cubic-bezier(.155, 1.105, .295, 1.12);
    padding: 14px 80px 18px 36px;
    cursor: pointer;
  }

  .card:hover {
    transform: scale(1.0);
    box-shadow: 0 10px 20px rgba(0, 0, 0, .12), 0 4px 8px rgba(0, 0, 0, .06);
  }

  .card h3 {
    font-weight: 200;
    font-size: 40px;
    color: #6772e5
  }

  .card img {
    position: absolute;
    top: 20px;
    right: 15px;
    max-height: 120px;
  }

  .card-1 {
    background-image: url(https://ionicframework.com/img/getting-started/ionic-native-card.png);
    background-repeat: no-repeat;
    background-position: right;
    background-size: 80px;
  }

  .card-2 {
    background-image: url(https://ionicframework.com/img/getting-started/components-card.png);
    background-repeat: no-repeat;
    background-position: right;
    background-size: 80px;
  }

  .card-3 {
    background-image: url(https://ionicframework.com/img/getting-started/theming-card.png);
    background-repeat: no-repeat;
    background-position: right;
    background-size: 80px;
  }

  @media(max-width: 990px) {
    .card {
      margin: 20px;
    }
  }

  /* Table Styles , https://codepen.io/florantara/pen/dROvdb*/

  .table-wrapper {
    margin: 10px 70px 70px;
    border-radius: 20px;

    background: white !important;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .05), 0 4px 8px rgba(0, 0, 0, .06);
  }

  .fl-table {
    border-radius: 20px;
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

  @media (max-width: 767px) {
    .fl-table {
      display: block;
      width: 100%;
    }

    .table-wrapper:before {
      display: block;
      text-align: right;
      font-size: 15px;
      background: white;
      padding: 0 0 10px;
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

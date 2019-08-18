<template>
    <v-container justify-center my-4 :id="subjectName">
      <v-layout justify-center>
        <v-flex>
          <v-card class="py-4 px-4 rounded text-center" hover raised="20"> <!-- TODO: Add rounded corners -->
            <span style="color: red;">{{error}}</span>
            <span style="color: red;">{{info}}</span>
              <v-card-title style="font-weight: 100 !important;"class="accent--text pl-1  display-2 font-weight-thin text-truncate ">{{subjectName}}
                <v-spacer />
                <SubjectButtons class="hidden-sm-and-down" :subject="subject" :showEditCtrls="showEditCtrls"/>
              </v-card-title>
              <SubjectButtons class="hidden-md-and-up " style="width: 100%; align: left;" :subject="subject" :showEditCtrls="showEditCtrls"/>

              <v-card-actions>
                <v-switch v-if="authorize()" color="success" v-model="editorMode" label="Edit Mode" ></v-switch>
                <v-btn  v-if="showEditCtrls"  color="error" class="font-weight-bold" dark @click.stop="showDeleteDialog=true">Delete Subject</v-btn>
              </v-card-actions>

            <div :class="[showEditCtrls ? 'edit-mode' : 'view-mode', 'card-table']">
              <table class="fl-table">
                <thead>
                <tr >
                  <th class="font-weight-light subheading">Woche</th>
                  <th class="font-weight-light subheading" v-for="type in typesUsed" :key="type" @click="editType(type)">
                    {{getTypeName(type)}} <v-icon v-if="showEditCtrls" small class="unselectable edit-type">edit</v-icon>
                  </th>
                  <th v-if="showAddType"><v-icon class="unselectable" @click="addType()">add_circle</v-icon></th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="week in range(startWeek,startWeek+weekCount)" :key="week" v-if="weeks.includes(week) || showEditCtrls">
                  <td v-if="showEditCtrls && week===startWeek" @click="showWeekDialog=true">{{week}} <v-icon v-if="showEditCtrls && week===startWeek" small class="unselectable edit-type">edit</v-icon></td>
                  <td v-else class="font-weight-light subheading">{{week}}</td>
                  <td class="hide-overflow font-weight-light subheading" v-if="showEditCtrls" v-for="type in typesUsed" :key="type"
                      @click.stop="startEdit(week,type)">{{ displayUrl(week,type) }}</td>
                  <td v-if="!showEditCtrls" class="font-weight-light" v-for="type in typesUsed" :key="type">
                    <a v-if="displayUrl(week,type)" target="_blank"
                       :href="displayUrl(week,type)">{{getTypeName(type)}} {{week}}</a>
                  </td>
                  <td v-if="showAddType"></td>
                </tr>
                <tr v-if="showEditCtrls && weekCount<16">
                  <td><v-icon class="unselectable" v-if="showEditCtrls" @click="weekCount += 1">add_circle</v-icon></td>
                  <td v-for="type in typesUsed" :key="type"></td>
                  <td v-if="showAddType"></td>
                </tr>
                </tbody>
              </table>
            </div>

            <v-dialog v-model="showLinkDialog"  max-width="700px">
              <v-card>
                <v-card-title>
                  <v-card-title>{{addingLink?'Add':'Edit'}} Link</v-card-title>
                  <v-spacer/>
                  <v-card-title class="font-weight-thin">{{getTypeName(activeLink.type_id)}} | Week {{activeLink.linkWeek}}</v-card-title>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-layout>
                      <v-flex>
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

            <v-dialog v-model="showDeleteDialog" max-width="600">
              <v-card >
                <v-card-title class="red--text font-weight-light">Delete {{subjectName}}?</v-card-title>
                <v-card-text  class="text-sm-left font-weight-light">This will delete all links, buttons and infos and <strong>cannot</strong> be undone.</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn depressed @click="showDeleteDialog=false">Cancel</v-btn>
                  <v-btn color="error" depressed @click="removeSubject();showDeleteDialog=false">Delete</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="showTypeDialog" max-width="300">
              <v-card>
                <v-card-title> {{initialType?'Edit':'Add'}} Type </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-layout>
                      <v-flex>
                        <v-select v-on:enter="saveType()" required v-model="newType" :items="typesAvailable" item-text="typeName" item-value="id"></v-select>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="showTypeDialog=false">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat @click="saveType()">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="showWeekDialog" persistent max-width="300">
              <v-card>
                <v-card-title> Edit Start Week </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-layout>
                      <v-flex>
                        <v-text-field placeholder="1" type="number" v-on:keyup.enter="saveStartWeek()" required v-model="newStartWeek"></v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" flat @click="showWeekDialog=false">Cancel</v-btn>
                  <v-btn color="blue darken-1" flat  @click="saveStartWeek()">Save</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <SubjectInfos v-bind:subject="subject" v-bind:showEditCtrls="showEditCtrls"/>
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
  name: 'Subject',
  props: ['subject', 'allTypes'],
  components: {
    SubjectButtons,
    SubjectInfos
  },
  data () {
    return {
      links: [],
      startWeek: 1,
      newStartWeek: 1,
      weekCount: 1,
      activeLink: [],
      originalLink: '',
      newButton: [],
      typesUsed: [2],
      typesAvailable: [],
      newType: 0,
      error: '',
      info: '',
      subjectName: '',
      showDeleteDialog: false,
      showLinkDialog: false,
      showTypeDialog: false,
      showWeekDialog: false,
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
      return this.typesUsed.length < 6 && this.showEditCtrls
    },
    weeks: function () {
      return this.$data.links.map(function (link, index) { return link.linkWeek })
    }
  },
  methods: {
    // Sets subjectName to the subjectName of the current subject
    getData () {
      this.$http.secured.get('/api/v1/subjects/' + this.subject)
        .then(response => {
          this.subjectName = response.data.subjectName
          this.startWeek = this.newStartWeek = response.data.startWeek
        })
      this.$http.secured.get('/api/v1/links?subject_id=' + this.subject)
        .then(response => {
          if (response.data.length) {
            this.links = response.data
            this.weekCount = Math.max(...this.weeks)
            this.typesUsed = [...new Set(this.$data.links.map(function (link, index) { return link.type_id }))]
          }
        })
    },
    getTypeName (typeId) {
      return (this.allTypes.find((type) => type.id === typeId) || []).typeName
    },
    // Sends delete command to API for current subject
    removeSubject () {
      this.$http.secured.delete(`/api/v1/subjects/${this.subject}`)
        .then(this.info = 'Subject will be removed on reload')
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
        })
        this.links.filter((link) => link.type_id === this.initialType).forEach(function (link) { link.type_id = this.newType }, this)
      } else {
        this.typesUsed.push(this.newType)
      }
    },
    saveStartWeek () {
      this.showWeekDialog = false
      this.newStartWeek = Number(this.newStartWeek)
      this.$http.secured.patch(`/api/v1/subjects/${this.subject}/startWeek`, {
        subject: {
          startWeek: this.newStartWeek
        }
      }).then(response => {
        this.links.forEach(function (link) { link.linkWeek += (this.newStartWeek - this.startWeek) }, this)
        this.startWeek = this.newStartWeek
      })
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
          this.endEdit()
          this.links.push(response.data)
        })
      }
    },
    // Checks if a link for the given week and type is present. If there is,
    // activeLink is set to said link. If there is no link yet, it sets adding
    // to true and fills activeLink.
    startEdit (week, type) {
      this.activeLink = []
      const existingLink = this.$data.links.find((link) => link.linkWeek === week && link.type_id === type)
      if (!existingLink) {
        this.addingLink = true
        this.activeLink.subject_id = this.subject
        this.activeLink.linkWeek = week
        this.activeLink.type_id = type
      } else {
        this.addingLink = false
        this.activeLink = existingLink
        this.originalLink = existingLink.linkUrl
      }
      this.showLinkDialog = true
    },
    endEdit () {
      this.showLinkDialog = false
    },
    cancelEdit () {
      if (!this.addingLink) this.activeLink.linkUrl = this.originalLink
      this.endEdit()
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
        }).then(response => this.endEdit())
      }
    },
    // Deletes given link via API
    removeLink () {
      this.showLinkDialog = false
      this.$http.secured.delete(`/api/v1/links/${this.activeLink.id}`)
        .then(response => {
          this.links.splice(this.links.indexOf(this.activeLink), 1)
        })
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
      if (this.signer && (localStorage.admin === 1 || this.userField === this.field)) { return true }
      return false
    },
    range (start, stop) {
      return new Array(stop - start).fill(start).map((n, i) => n + i)
    }
  }
}
</script>
<style media="screen" lang="less" rel="stylesheet/less">

  @import url("../assets/styles/main");

  .unselectable {
   -moz-user-select: -moz-none;
   -khtml-user-select: none;
   -webkit-user-select: none;
   -ms-user-select: none;
   user-select: none;
}

  .hide-overflow {
    overflow: hidden;
    max-width: 10px;
  }
  .ellipsis {
    overflow: hidden;
  }

  .card-table {
    margin-bottom: 20px;
    border-radius: 10px !important;
    border-top: solid 2px @accent;
    box-shadow: 0 0 1px rgba(0, 0, 0, .05), 0 1px 3px rgba(0, 0, 0, .06);
    overflow-x: scroll;
    -webkit-overflow-scrolling: touch;
  }

</style>

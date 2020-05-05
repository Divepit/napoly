<!-- Generates the table filled with links in each subject card -->
<template>
  <v-container fluid>
    <v-card flat outlined class="ma-0 mb-6">
      <v-simple-table fixed-header>
        <!-- Creates headers based on the types which occur in the links associated to the subject-->
        <thead>
        <tr>
          <th class="font-weight-light text-center">Week</th>
          <th class="font-weight-light text-center" :key="type" v-for="type in typeIds">{{types[type-1]}}</th>
          <!-- Button which opens a window to select a new type to add -->
          <th v-if="editMode === subject.id">
            <v-btn text small color="primary" @click="addingType = true">+</v-btn>
          </th>
        </tr>
        </thead>
        <tbody align="center">
        <!-- The amount of weeks created is equal to the highest linkWeek integer present in the links associated to the subject-->
          <tr :key="week" v-for="week in subjectWeeks">
            <!-- Create the week column -->
            <td class="font-weight-light">{{week}}</td>
            <td style="cursor: pointer" :key="type" v-for="type in typeIds">
              <!-- Create the links in case we are not in edit mode-->
              <a class="primary--text font-weight-light" style="text-decoration: none;" :href="findLinkFromTypeAndWeek(type, week).linkUrl"
                 target="_blank"
                 v-if="typeWeekCombos.includes(`${type}/${week}`) && editMode !== subject.id"><span class="hidden-sm-and-down">{{types[type-1]}}</span> {{week}}</a>
              <span v-else/>
              <!-- Create the link-editing-buttons in case we are in edit mode-->
              <v-btn outlined tile x-small color="primary" @click="editLink(type,week)" v-if="editMode === subject.id">
                {{typeWeekCombos.includes(`${type}/${week}`) ? types[type-1] + ' ' + week : '+'}}
              </v-btn>
              <span v-else/>
            </td>
            <!-- We need another row in edit mode for the add-week button -->
            <td v-if="editMode === subject.id"/>
          </tr>
        <!-- Add week button -->
        <tr v-if="editMode === subject.id">
          <td class="text-center">
            <v-btn text x-small color="primary" class="pa-0 ma-0" @click="subjectWeeks.push(subjectWeeks[subjectWeeks.length-1]+1)">+
            </v-btn>
          </td>
        </tr>
        </tbody>
      </v-simple-table>
    </v-card>
    <ObjectEditor :objectToEdit="editedLink" :forbidden-attributes="forbiddenAttributes" :active="editingLink"
                  @updateObject="updateLink($event)" @cancel="editingLink = false; editedLink = null" @delete="removeLink(editedLink)"/>
    <!-- Array Selector is a derivative of ObjectEditor. It lets you select an element from an array and returns it -->
    <ArraySelector :arrayToSelectFrom="types" :active="addingType" @returnSelection="addType($event)"
                   @cancel="addingType = false"/>
  </v-container>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import { plainAxiosInstance, securedAxiosInstance } from '../../backend/axios'
import ObjectEditor from '../UI/ObjectEditor'
import ArraySelector from '../UI/ArraySelector'

export default {
  name: 'LinkTable',
  components: { ArraySelector, ObjectEditor },
  created () {
    this.getSubjectLinks()
  },
  props: {
    subject: null,
    // Note that editMode is NOT used as a boolean but actually as an integer which is set to the currently edited subject's ID
    editMode: null
  },
  data () {
    return {
      subjectWeeks: [],
      typeIds: [],
      subjectLinks: [],
      typeWeekCombos: [],
      editingLink: false,
      editedLink: null,
      addingType: false,
      newLink: {},
      creators: [],
      // Refer to the ObjectEditor component for an explanation of the forbiddenAttributes prop
      forbiddenAttributes: ['id', 'created_at', 'updated_at', 'creator', 'editor', 'linkWeek', 'type_id', 'subject_id']
    }
  },
  computed: {
    // Note that all the API States are defined a separate vuex module at src/store/modules/napolyApi.js
    ...mapState('napolyApiModule', ['types', 'subjects']),
    ...mapState(['signedIn', 'message'])
  },
  methods: {
    ...mapMutations(['setMessage']),
    getSubjectLinks () {
      plainAxiosInstance.get(`/api/v1/links?subject_id=${this.subject.id}`).then(response => {
        this.subjectLinks = response.data
        response.data.forEach(link => {
          if (!this.creators.includes(link.creator)) {
            this.creators.push(link.creator)
          }
          if (!this.typeIds.includes(link.type_id)) {
            this.typeIds.push(link.type_id)
          }
          while (!this.subjectWeeks.includes(link.linkWeek)) {
            this.subjectWeeks.push(link.linkWeek)
          }
          this.typeWeekCombos.push(`${link.type_id}/${link.linkWeek}`)
        })
        function sorter (a, b) {
          if (a < b) return -1
          if (a > b) return 1
          return 0
        }
        this.subjectWeeks.sort(sorter)
        this.$emit('linksLoaded', { subject: this.subject.id, creators: this.creators })
      })
    },
    // Unfortunately this is the only way of identifying a link currently
    findLinkFromTypeAndWeek (type, week) {
      return this.subjectLinks.find(link => (link.type_id === type && link.linkWeek === week))
    },
    editLink (type, week) {
      if (this.findLinkFromTypeAndWeek(type, week)) {
        this.editedLink = this.findLinkFromTypeAndWeek(type, week)
        this.editingLink = true
      } else if (this.editedLink === null) {
        this.editedLink = { linkWeek: week, type_id: type, linkUrl: '', subject_id: this.subject.id, creator: localStorage.username, editor: '' }
        this.editingLink = true
      }
    },
    // updateLink() will also serve as createLink() in case the link object passed has an undefined id
    updateLink (link) {
      this.editingLink = false
      this.editedLink.linkUrl = link.objectValues[0]
      // Creating a new Link
      if (this.editedLink.linkUrl.length !== 0 && this.editedLink.id === undefined) {
        securedAxiosInstance.post('/api/v1/links', this.editedLink)
          .then(response => {
            this.editedLink = null
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = `Link ${response.data.id} added`
            this.message.color = 'info'
            this.message.active = true
            this.subjectLinks.push(response.data)
            this.typeWeekCombos.push(`${response.data.type_id}/${response.data.linkWeek}`)
          })
      // Updating an existing Link
      } else if (this.editedLink.linkUrl.length !== 0 && this.editedLink.id !== undefined) {
        securedAxiosInstance.patch(`/api/v1/links/${this.editedLink.id}`, this.editedLink)
          .then(response => {
            this.editedLink = null
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = `Link ${response.data.id} updated`
            this.message.color = 'info'
            this.message.active = true
          })
      } else {
        this.editedLink = null
        // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
        this.message.text = `Invalid link`
        this.message.color = 'error'
        this.message.active = true
      }
    },
    removeLink (link) {
      securedAxiosInstance.delete(`/api/v1/links/${link.id}`)
        .then(
          this.editingLink = false,
          this.typeWeekCombos.splice(this.typeWeekCombos.indexOf(`${link.type_id}/${link.linkWeek}`), 1),
          // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
          this.message.text = `Link ${link.id} removed`,
          this.message.color = 'warning',
          this.message.active = true
        )
    },
    addType (typename) {
      this.addingType = false
      this.typeIds.push(this.types.indexOf(typename) + 1)
    }
  }
}
</script>

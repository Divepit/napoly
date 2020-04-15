<!-- Generates the buttons in each subject, pulled from the API -->
<template>
  <div>
    <!-- Display the buttons regularly -->
    <div v-if="editMode !== subject.id">
      <v-btn depressed color="primary" :href="btn.buttonUrl" :key="'inline'+btn.id" class="mx-1 hidden-sm-and-down white--text" small target="_blank" v-for="btn in buttons">
        {{btn.buttonLabel}}
      </v-btn>
      <v-btn depressed color="primary" :href="btn.buttonUrl" :key="'block'+btn.id" class="my-2 hidden-md-and-up white--text" small target="_blank" v-for="btn in buttons" block>
        {{btn.buttonLabel}}
      </v-btn>
    </div>
    <!-- Make the buttons editable in editMode -->
    <div v-else>
      <v-btn :key="'inline'+btn.id" class="mx-1 px-1 hidden-sm-and-down" small target="_blank" v-for="btn in buttons" outlined color="info" tile
             @click="editButton(btn)">{{btn.buttonLabel}}
      </v-btn>
      <v-btn :key="'block'+btn.id" class="my-1 hidden-md-and-up" small target="_blank" v-for="btn in buttons" outlined color="info" tile block
             @click="editButton(btn)">{{btn.buttonLabel}}
      </v-btn>
      <v-btn color="primary" outlined class="pa-0 hidden-sm-and-down ml-4" small tile @click="editButton({buttonUrl: '', buttonLabel: '', subject_id: subject.id})">
        +
      </v-btn>
      <v-btn color="primary" outlined class="hidden-md-and-up mt-4" small tile @click="editButton({buttonUrl: '', buttonLabel: '', subject_id: subject.id})" block>
        +
      </v-btn>
    </div>
    <ObjectEditor :objectToEdit="newButton" :forbidden-attributes="forbiddenAttributes" :active="editingButton"
                  @updateObject="updateButton($event)" @cancel="editingButton = false"
                  @delete="removeButton(newButton)"/>
  </div>
</template>

<script>
// plainAxiosInstance and securedAxiosInstance are defined in the axios wrapper and is used to access API values which do not require authentication
import { plainAxiosInstance, securedAxiosInstance } from '../../backend/axios'
import ObjectEditor from '../UI/ObjectEditor'
// For the functionality of mapState, mapActions and mapMutations please refer to the vuex documentation
import { mapState } from 'vuex'

export default {
  name: 'SubjectButtons',
  components: { ObjectEditor },
  data () {
    return {
      buttons: [],
      editingButton: false,
      newButton: {},
      // Refer to the ObjectEditor component for an explanation of the forbiddenAttributes prop
      forbiddenAttributes: ['id', 'created_at', 'updated_at', 'creator', 'editor', 'linkWeek', 'subject_id', 'type_id']
    }
  },
  created () {
    this.getButtons()
  },
  props: {
    subject: null,
    // Note that editMode is NOT used as a boolean but actually as an integer which is set to the currently edited subject's ID
    editMode: null
  },
  computed: {
    ...mapState(['message'])
  },
  methods: {
    getButtons () {
      plainAxiosInstance.get(`/api/v1/buttons?subject_id=${this.subject.id}`).then(response => {
        this.buttons = response.data
      })
    },
    editButton (button) {
      if (this.editMode === this.subject.id) {
        this.editingButton = true
        this.newButton = button
      }
    },
    // updateButton() will also serve as createButton() in case the button object passed has an undefined id
    updateButton (button) {
      this.editingButton = false
      for (var i in button.objectKeys) {
        this.newButton[button.objectKeys[i]] = button.objectValues[i]
      }
      if (this.newButton.buttonUrl.length !== 0 && this.newButton.buttonLabel.length !== 0 && this.newButton.id === undefined) {
        securedAxiosInstance.post('/api/v1/buttons', this.newButton)
          .then(response => {
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = `Button ${response.data.id} added`
            this.message.color = 'info'
            this.message.active = true
            this.buttons.push(response.data)
          })
          .catch(error => {
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = error
            this.message.color = 'error'
            this.message.active = true
          })
      } else if (this.newButton.buttonUrl.length !== 0 && this.newButton.buttonLabel.length !== 0 && this.newButton.id !== undefined) {
        securedAxiosInstance.patch(`/api/v1/buttons/${this.newButton.id}`, this.newButton)
          .then(response => {
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = `Button ${response.data.id} updated`
            this.message.color = 'info'
            this.message.active = true
          })
          .catch(error => {
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = error
            this.message.color = 'error'
            this.message.active = true
          })
      } else {
        // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
        this.message.text = `Invalid Button`
        this.message.color = 'error'
        this.message.active = true
      }
    },
    removeButton (button) {
      securedAxiosInstance.delete(`/api/v1/buttons/${button.id}`)
        .then(
          this.editingButton = false,
          this.buttons.splice(this.buttons.indexOf(button), 1),
          this.message.text = `Button ${button.id} removed`,
          this.message.color = 'warning',
          this.message.active = true
        )
    }
  }
}
</script>

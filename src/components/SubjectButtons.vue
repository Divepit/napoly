<template lang="html">
  <div class="">
    <v-btn v-if="editorMode && signedIn()" class="subjectButton" v-for="button in buttons" :key="button.id" depressed @click="editButton(button); buttonId = button.id">{{button.buttonLabel}}</v-btn>
    <v-btn v-if="!editorMode" class="subjectButton" v-for="button in buttons" :key="button.id" target="_blank" :href="button.buttonUrl">{{button.buttonLabel}}</v-btn>
    <v-icon class="unselectable" v-if="editorMode && signedIn()" color="" @click="dialog = !dialog; editing = false; stopEditing()">add_circle</v-icon>
    <template v-if="editorMode && signedIn()">
      <v-layout row justify-center>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card class="card">
            <v-card-title>
              <span v-if="editing" class="headline">Edit Button</span>
              <span v-else class="headline">Add Button</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <v-flex xs12>
                    <v-text-field label="Button Label" v-model="newButtonLabel" required></v-text-field>
                  </v-flex>
                  <v-flex xs12>
                    <v-text-field label="Button Url" v-model="newButtonUrl" required></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn v-if="editing" color="error" flat @click="dialog = false; removeButton(buttonId)">Delete Button</v-btn>

              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click="dialog = false; stopEditing()">Close</v-btn>
              <v-btn v-if="editing" color="blue darken-1" flat @click="dialog = false; updateButton()">Confirm</v-btn>
              <v-btn v-else color="blue darken-1" flat @click="dialog = false; addButton()">Add</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-layout>
    </template>
  </div>

</template>

<script>
export default {
  name: 'SubjectButtons',
  props: ['subject', 'editorMode'],
  created () {
    this.getButtons()
  },
  data () {
    return {
      buttons: [],
      buttonId: null,
      newButtonUrl: '',
      newButtonLabel: '',
      editing: false,
      dialog: false
    }
  },
  methods: {
    // Returns true if localStorage.signedIn is true
    signedIn () {
      return localStorage.signedIn
    },
    // Gets all buttons from API with the current subject
    getButtons () {
      this.buttons = []
      this.$http.secured.get('/api/v1/buttons?subject_id=' + this.subject)
        .then(response => {
          this.buttons = response.data
        })
    },
    // Adds button via API if newButton is filled
    addButton () {
      if (!this.newButtonUrl || !this.newButtonLabel) {
        return
      }
      this.$http.secured.post('/api/v1/buttons/', {
        button: {
          buttonUrl: this.newButtonUrl,
          buttonLabel: this.newButtonLabel,
          subject_id: this.subject
        }
      })

        .then(response => {
          this.buttons.push(response.data)
        })
    },
    editButton (button) {
      this.editing = true
      this.newButtonUrl = button.buttonUrl
      this.newButtonLabel = button.buttonLabel
      this.dialog = true
    },
    updateButton () {
      if (!this.newButtonUrl || !this.newButtonLabel) {
        this.removeButton(this.buttonId)
      } else {
        this.$http.secured.patch(`/api/v1/buttons/${this.buttonId}`, {
          button: {
            buttonUrl: this.newButtonUrl,
            buttonLabel: this.newButtonLabel,
            subject_id: this.subject
          }
        })
          .then(response => {
            this.getButtons()
            this.stopEditing()
          })
      }
    },
    // Deletes given button via API
    removeButton (button) {
      this.$http.secured.delete(`/api/v1/buttons/${button}`)
        .then(response => {
          this.buttons.splice(this.buttons.indexOf(button), 1)
        })
    },
    stopEditing () {
      this.editing = false
      this.buttonId = null
      this.newButtonUrl = ''
      this.newButtonLabel = ''
    }
  }
}
</script>

<style lang="css" scoped>
  .subjectButton {
      color: white !important;
      background: #FC8668 !important;
      border-radius: 5px;
  }
</style>

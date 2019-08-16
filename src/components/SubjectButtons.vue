<template>
  <span>
    <v-btn v-if="showEditCtrls" color="blue" class="white--text" v-for="button in buttons" :key="button.id" @click="startEdit(button)">{{button.buttonLabel}}</v-btn>
    <v-btn v-if="!showEditCtrls" color="blue" class="white--text" v-for="button in buttons" :key="button.id" target="_blank" :href="button.buttonUrl">{{button.buttonLabel}}</v-btn>
    <v-icon class="pb-2" v-if="showEditCtrls" @click="addingButton=showButtonDialog=true">add_circle</v-icon>
    <v-dialog v-model="showButtonDialog" max-width="700px">
      <v-card class="py-3 px-3">
        <v-card-title> {{addingButton?'Add':'Edit'}} Button </v-card-title>
        <v-card-text>
          <v-text-field label="Button Label" v-model="activeButton.buttonLabel" required></v-text-field>
          <v-text-field label="Button Url" v-model="activeButton.buttonUrl" required></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="!addingButton" color="error"  @click="removeButton(activeButton.id)">Remove Button</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="cancelEdit()">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click="saveButton()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  name: 'SubjectButtons',
  props: ['subject', 'showEditCtrls'],
  created () {
    this.getButtons()
  },
  data () {
    return {
      buttons: [],
      activeButton: [],
      originalButton: [],
      addingButton: false,
      showButtonDialog: false
    }
  },
  methods: {
    // Gets all buttons from API with the current subject
    getButtons () {
      this.buttons = []
      this.$http.secured.get('/api/v1/buttons?subject_id=' + this.subject)
        .then(response => {
          this.buttons = response.data
        })
    },
    saveButton () {
      if (this.addingButton) this.addButton()
      else this.updateButton()
    },
    // Adds button via API if newButton is filled
    addButton () {
      if (this.activeButton.buttonUrl && this.activeButton.buttonLabel) {
        this.$http.secured.post('/api/v1/buttons/', {
          button: {
            buttonUrl: this.activeButton.buttonUrl,
            buttonLabel: this.activeButton.buttonLabel,
            subject_id: this.subject
          }
        }).then(response => {
          this.endEdit()
          this.buttons.push(response.data)
        })
      }
    },
    startEdit (button) {
      if (!this.showEditCtrls) return
      this.addingButton = false
      this.activeButton = button
      this.originalInfo = {...button}
      this.showButtonDialog = true
    },
    endEdit () {
      this.showButtonDialog = false
      this.activeButton = []
    },
    cancelEdit () {
      this.buttons[this.buttons.indexOf(this.activeButton)] = this.originalInfo
      this.endEdit()
    },
    updateButton () {
      if (!this.activeButton.buttonUrl || !this.activeButton.buttonLabel) {
        this.removeButton(this.activeButton.id)
      } else {
        this.$http.secured.patch(`/api/v1/buttons/${this.activeButton.id}`, {
          button: {
            buttonUrl: this.activeButton.buttonUrl,
            buttonLabel: this.activeButton.buttonLabel,
            subject_id: this.subject
          }
        }).then(response => this.endEdit())
      }
    },
    // Deletes given button via API
    removeButton (button) {
      this.$http.secured.delete(`/api/v1/buttons/${button}`)
        .then(response => {
          this.endEdit()
          this.buttons.splice(this.buttons.indexOf(button), 1)
        })
    }
  }
}
</script>

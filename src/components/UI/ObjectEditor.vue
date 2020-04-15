<template>
  <v-dialog v-model="active" width="500" persistent>
    <v-card>
        <v-card-text v-for="(objectValue, index) in objectValues" :key="objectValue.id" class="py-2">
            <!-- SPECIAL CASE INFOS -->
            <div v-if="objectKeys[index].includes('infoText')">
              <v-textarea hide-details outlined class="ma-0 pb-0 pt-2" :label="objectKeys[index]" v-model="objectValues[index]" :type="typeof objectValue"/>
              <v-btn small outlined tile class="pl-1 my-2" @click="objectValues[index] += ' [Link Title](URL)', active = false, active = true"><v-icon class="mr-1">mdi-link-variant-plus</v-icon>Add Link</v-btn>
              <v-divider/>
              <v-card class="mt-2">
                <v-card-title>Info Preview</v-card-title>
                <v-card-text>
                  <vue-markdown :source="objectValues[index]"></vue-markdown>
                </v-card-text>
              </v-card>
            </div>
            <!-- SPECIAL CASE ROLE -->
            <v-select v-else-if="objectKeys[index].includes('role')" :items="[{ value: 1, text: 'Admin' },{ value: 0, text: 'Moderator' }]" hide-details class="ma-0 pb-0 pt-2" outlined :label="objectKeys[index]" v-model="objectValues[index]"/>
            <!-- SPECIAL CASE FIELD ID -->
            <v-select v-else-if="objectKeys[index].includes('field_id')" :items="fields.data" item-text="fieldName" item-value="id" hide-details class="ma-0 pb-0 pt-2" outlined :label="objectKeys[index]" v-model="objectValues[index]"/>
            <!-- SPECIAL CASE PASSWORD -->
            <v-text-field v-else-if="objectKeys[index].includes('password')" :append-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'" v-on:click:append="showPassword = !showPassword" hide-details outlined class="ma-0 pb-0 pt-2" :label="objectKeys[index]" v-model="objectValues[index]" :type="!showPassword ? 'password' : 'text'"/>
            <v-text-field v-else hide-details outlined class="ma-0 pb-0 pt-2" :label="objectKeys[index]" v-model="objectValues[index]" :type="typeof objectValue"/>
        </v-card-text>
      <v-card-actions class="mt-0 pt-0">
        <v-btn color="error" text @click="$emit('delete')">
          Delete
        </v-btn>
        <v-spacer/>
        <v-btn color="primary" text @click="$emit('cancel')">
          Cancel
        </v-btn>
        <v-btn color="primary" text @click="$emit('updateObject', {objectKeys, objectValues})">
          Send
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import VueMarkdown from 'vue-markdown'

export default {
  name: 'ObjectEditor',
  components: { VueMarkdown },
  watch: {
    objectToEdit: function () {
      if (this.active) {
        this.initializeObject()
      }
    }
  },
  data () {
    return {
      objectKeys: [],
      objectValues: [],
      newField: null,
      showPassword: false
    }
  },
  props: {
    objectToEdit: {},
    active: null,
    forbiddenAttributes: null
  },
  computed: {
    ...mapState('napolyApiModule', ['fields'])
  },
  methods: {
    initializeObject () {
      this.objectKeys = Object.keys(this.objectToEdit)
      this.objectValues = Object.values(this.objectToEdit)
      for (var i in this.objectValues) {
        if (this.objectValues[i] === null) {
          this.objectValues[i] = ' '
        }
      }
      for (var j = this.objectKeys.length - 1; j >= 0; j--) {
        if (this.forbiddenAttributes.includes(this.objectKeys[j])) {
          this.objectKeys.splice(j, 1)
          this.objectValues.splice(j, 1)
        }
      }
    }
  }
}
</script>

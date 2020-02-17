<template>
  <v-dialog v-model="active" width="500" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Edit Object
      </v-card-title>
      <v-container>
        <v-row v-for="attribute in objectKeys.length" :key="attribute.id">
          <v-col v-if="!forbiddenAttributes.includes(objectKeys[attribute-1])">
            <v-text-field v-if="objectValues[attribute-1].length < 20 && !exceptionalAttributes.includes(objectKeys[attribute-1])" flat outlined class="mb-0" :label="objectKeys[attribute-1]" v-model="objectValues[attribute-1]" :type="typeof objectValues[attribute-1]"/>
            <v-select v-if="objectKeys[attribute-1] === 'field_id'" label="Field" :items="fields.data" item-text="fieldName" item-value="id" v-model="objectValues[attribute-1]"/>
            <div v-if="!(objectValues[attribute-1].length < 20) && !exceptionalAttributes.includes(objectKeys[attribute-1])">
              <div v-if="objectKeys[attribute-1].includes('info')">
                <v-btn small outlined tile class="mr-2" @click="objectValues[attribute-1] += ' [Link Title](URL)', active = false, active = true"><v-icon>mdi-link-variant-plus</v-icon></v-btn>
              </div>
              <v-textarea flat outlined class="mb-0 mt-2" :label="objectKeys[attribute-1]" v-model="objectValues[attribute-1]" :type="typeof objectValues[attribute-1]"/>
            </div>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions>
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
export default {
  name: 'ObjectEditor',
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
      exceptionalAttributes: ['field_id'],
      newField: null
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
    }
  }
}
</script>

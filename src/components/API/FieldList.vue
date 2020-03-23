<!-- Lists the fields present on the API to display in the sidebar -->
<template>
  <v-list>
    <v-subheader @click="changeField" style="cursor: pointer">{{currentFieldName ? currentFieldName : 'Departement wählen'}}
      <v-spacer/>
      <v-icon @click="changeField" small>{{changingField ? 'mdi-chevron-up':'mdi-chevron-down'}}</v-icon>
    </v-subheader>
    <v-list-item-group v-if="changingField">
      <v-list-item v-for="field in fields.data" :key="field.id" @click="setCurrentField(field.id)">{{field.fieldName}}</v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
// For the functionality of mapState, mapActions and mapMutations please refer to the vuex documentation
import { mapActions, mapState } from 'vuex'

export default {
  name: 'FieldList',
  created () {
    this.getFields()
  },
  computed: {
    // Note that all the API States are defined a separate vuex module at src/store/modules/napolyApi.js
    ...mapState('napolyApiModule', ['fields', 'currentFieldId', 'currentFieldName', 'changingField'])
  },
  methods: {
    // Note that all the API Actions are defined a separate vuex module at src/store/modules/napolyApi.js
    ...mapActions('napolyApiModule', ['getFields', 'setCurrentField']),
    changeField () {
      this.$store.state.napolyApiModule.changingField = !this.changingField
    }
  }
}
</script>

<style scoped>

</style>

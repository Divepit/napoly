<template>
  <v-list>
    <v-subheader @click="changeField" style="cursor: pointer">{{currentFieldName}}
      <v-spacer/>
      <v-icon @click="changeField" small>mdi-pencil</v-icon>
    </v-subheader>
    <v-list-item-group v-if="changingField">
      <v-list-item v-for="field in fields.data" :key="field.id" @click="setCurrentField(field.id)">{{field.fieldName}}</v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'FieldList',
  created () {
    this.getFields()
  },
  computed: {
    ...mapState('napolyApiModule', ['fields', 'currentFieldId', 'currentFieldName', 'changingField'])
  },
  methods: {
    ...mapActions('napolyApiModule', ['getFields', 'setCurrentField']),
    changeField () {
      this.$store.state.napolyApiModule.changingField = !this.changingField
    }
  }
}
</script>

<style scoped>

</style>

<template>
  <v-list>
    <v-subheader>Field {{currentFieldId}}</v-subheader>
    <v-list-item-group>
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
    ...mapState(['fields', 'currentFieldId'])
  },
  methods: {
    ...mapActions(['getFields', 'setCurrentField'])
  }
}
</script>

<style scoped>

</style>

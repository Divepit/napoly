<template>
  <v-list>
    <v-subheader>Year {{currentYear}}</v-subheader>
    <v-list-item-group>
      <v-list-item v-for="year in years" :key="year.id" @click="setCurrentYear(year)">{{year}}. Studienjahr</v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'YearList',
  data () {
    return {
      years: [1, 2, 3]
    }
  },
  computed: {
    ...mapState(['currentYear'])
  },
  methods: {
    ...mapActions(['setCurrentYear'])
  }
}
</script>

<style scoped>

</style>

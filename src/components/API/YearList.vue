<template>
  <v-list>
    <v-subheader>{{currentYear}}. Studienjahr <v-spacer/> <v-icon small @click="changeYear">mdi-pencil</v-icon></v-subheader>
    <v-list-item-group v-if="changingYear">
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
    ...mapState('napolyApiModule', ['currentYear', 'changingYear'])
  },
  methods: {
    ...mapActions('napolyApiModule', ['setCurrentYear']),
    changeYear () {
      this.$store.state.napolyApiModule.changingYear = !this.changingYear
    }
  }
}
</script>

<style scoped>

</style>

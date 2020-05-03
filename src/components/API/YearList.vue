<!-- Generates a list of Years for the sidebar-->
<template>
  <v-list>
    <v-subheader v-if="currentYear" @click="changeYear" style="cursor: pointer" class="font-weight-light">{{currentYear}}. Studienjahr
      <v-spacer/>
      <v-icon small>{{changingYear ? 'mdi-chevron-up':'mdi-chevron-down'}}</v-icon>
    </v-subheader>
    <v-subheader v-else @click="changeYear" style="cursor: pointer">Studienjahr wählen
      <v-spacer/>
      <v-icon small>{{changingYear ? 'mdi-chevron-up':'mdi-chevron-down'}}</v-icon>
    </v-subheader>
    <v-list-item-group v-if="changingYear">
      <v-list-item v-for="year in years" :key="year.id" @click="setCurrentYear(year)" class="font-weight-light">{{year}}. Studienjahr
      </v-list-item>
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
    // Note that all the API States are defined a separate vuex module at src/store/modules/napolyApi.js
    ...mapState('napolyApiModule', ['currentYear', 'changingYear'])
  },
  methods: {
    // Note that all the API Actions are defined a separate vuex module at src/store/modules/napolyApi.js
    ...mapActions('napolyApiModule', ['setCurrentYear']),
    changeYear () {
      this.$store.state.napolyApiModule.changingYear = !this.changingYear
    }
  }
}
</script>

<style scoped>

</style>

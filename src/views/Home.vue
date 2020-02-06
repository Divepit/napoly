<template>
  <div class="home">
    <Toolbar/>
    <v-content>
      <v-container fluid>
        <SubjectCard/>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import Toolbar from '@/components/UI/Toolbar.vue'
import SubjectCard from '../components/UI/SubjectCard'
import { mapActions } from 'vuex'
export default {
  name: 'home',
  created () {
    this.getTypes()
  },
  components: {
    SubjectCard,
    Toolbar
  },
  methods: {
    ...mapActions('napolyApiModule', ['getTypes'])
  }
}
</script>

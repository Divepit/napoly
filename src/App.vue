<template>
  <v-app id="app">
    <GlobalNotification/>
    <router-view/>
  </v-app>
</template>

<script>
import GlobalNotification from './components/UI/GlobalNotification'
export default {
  components: { GlobalNotification },
  created () {
    this.$vuetify.theme.dark = false
  }
}
</script>
<style>
  #app {
    font-family: Muli;
  }
</style>

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
  beforeCreate () {
    if (localStorage.status !== 'cleared') {
      localStorage.clear()
      localStorage.status = 'cleared'
      this.$router.go()
    }
  },
  created () {
    this.$vuetify.theme.dark = false
  }
}
</script>
<style>
  #app {
    font-family: Muli;
    overflow-x: hidden;
  }

  #app a {
    text-decoration: none;
    color: #3da4ea;
  }
  #app a:visited {
    color: #3da4ea;
  }
</style>

<template>
  <v-app id="sandbox">
    <Home/>
  </v-app>
</template>

<script>
import Home from './views/Home'
export default {
  components: { Home },
  created () {
    this.$vuetify.theme.dark = false
  }
}

</script>

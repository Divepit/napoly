<template>
  <v-container id="app"  px-0 py-0 style="max-width: 100vw;">
    <Layout/>
  </v-container>
</template>

<script>
import Layout from './components/Layout.vue'

export default {
  name: 'App',
  components: {
    Layout
  },
  data () {
    return {
      drawer: null
    }
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

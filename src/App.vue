<template>
  <div id="app">
    <Layout/>
    <router-view/>
  </div>
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
  /* font-family: 'Mandali', sans-serif; */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background: #f9f9f9;
  font-size: 20px;
  font-weight: 300 !important;
}
</style>

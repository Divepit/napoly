<template>
  <div id="app">
    <Header :drawer.sync="drawer"/>
    <router-view/>
  </div>
</template>

<script>
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
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

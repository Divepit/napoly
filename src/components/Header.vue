<template>

  <v-toolbar dark dense fixed >
  <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
  <SideDrawer v-bind:drawer="drawer" ></SideDrawer>
  <v-toolbar-title>Canoodle</v-toolbar-title>
  <v-spacer></v-spacer>
  <v-toolbar-items class="hidden-sm-and-down">
    <v-btn flat to="/links">Links</v-btn>
    <v-btn flat to="/signin" v-if="!signedIn()">Sign In</v-btn>
    <v-btn flat to="/signup" v-if="!signedIn()">Sign Up</v-btn>
    <v-btn flat @click.prevent="signOut" v-if="signedIn()">Sign Out</v-btn>
  </v-toolbar-items>
</v-toolbar>

</template>
<script>
import SideDrawer from '@/components/SideDrawer'

export default {
  name: 'Header',
  created () {
    this.signedIn()
  },
  data () {
    return {
      drawer: null
    }
  },
  components: {
    SideDrawer
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    signedIn () {
      return localStorage.signedIn
    },
    signOut () {
      this.$http.secured.delete('/signin')
        .then(response => {
          delete localStorage.csrf
          delete localStorage.signedIn
          this.$router.replace('/')
        })
        .catch(error => this.setError(error, 'Cannot sign out'))
    }
  }
}
</script>

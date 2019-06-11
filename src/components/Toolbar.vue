<template>

  <v-toolbar dark dense fixed >
  <v-toolbar-side-icon @click.stop="$emit('update:drawer', !drawer)"></v-toolbar-side-icon>
  <v-toolbar-title class="fonted">Canoodle</v-toolbar-title>
  <v-spacer></v-spacer>
  <v-toolbar-items class="hidden-sm-and-down">
    <v-btn flat to="/links" class="fonted">Links</v-btn>
    <v-btn flat to="/signin" v-if="!signedIn()" class="fonted">Sign In</v-btn>
    <v-btn flat to="/signup" v-if="!signedIn()" class="fonted">Sign Up</v-btn>
    <v-btn flat @click.prevent="signOut" v-if="signedIn()" class="fonted">Sign Out</v-btn>

  </v-toolbar-items>
</v-toolbar>

</template>
<script>
export default {
  name: 'Toolbar',
  created () {
    this.signedIn()
  },
  data () {
    return {
      drawer: null,
      editMode: false
    }
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
<style media="screen">
  .fonted {
    font-family: Roboto,sans-serif !important;
    font-weight: 400;
  }
</style>

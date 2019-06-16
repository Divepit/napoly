<template>

  <v-toolbar app fixed clipped-left>
  <v-toolbar-side-icon @click.stop="$emit('update:drawer', !drawer)"></v-toolbar-side-icon>
  <v-toolbar-title class="fonted"><a style="color: #6772e5; text-decoration: none;" href="#">Canoodle</a></v-toolbar-title>
  <v-spacer></v-spacer>
  <v-toolbar-items class="">
    <v-btn flat to="/links" class="fonted">Links</v-btn>
    <v-btn flat to="/signin" v-if="!signer" class="fonted">Sign In</v-btn>
    <v-btn flat @click.prevent="signOut" v-if="signer" class="fonted">Sign Out</v-btn>

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
      editMode: false,
      signer: null
    }
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    signedIn () {
      this.signer = localStorage.signedIn
      return localStorage.signedIn
    },
    signOut () {
      this.$http.secured.delete('/signin')
        .then(response => {
          delete localStorage.csrf
          delete localStorage.signedIn
          this.$router.replace('/links')
        })
        .catch(error => this.setError(error, 'Cannot sign out'))
    }
  },
  watch: {
    signer: function (val) {
      this.signer = this.signedIn()
    }
  }
}
</script>
<style media="screen">
  .fonted {
    font-family: Roboto,sans-serif !important;
    font-weight: 300;
  }
</style>

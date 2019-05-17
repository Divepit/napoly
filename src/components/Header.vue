<template>
  <header>
    <div>
      <div>
        <router-link to="/signin" v-if="!signedIn()">Sign in</router-link>
        <router-link to="/signup" v-if="!signedIn()">Sign Up</router-link>
        <router-link to="/links">Links</router-link>
        <a href="#" @click.prevent="signOut" v-if="signedIn()">Sign out</a>
      </div>
    </div>
  </header>
</template>
<script>
export default {
  name: 'Header',
  created () {
    this.signedIn()
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

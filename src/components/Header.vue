<template>
  <header>
    <div>
      <div>
        <a href="/">Home</a>
        <router-link to="/" v-if="!signedIn()">Sign in</router-link>
        <router-link to="/signup" v-if="!signedIn()">Sign Up</router-link>
        <router-link to="/records" v-if="signedIn()">Records</router-link>
        <router-link to="/artists" v-if="signedIn()">Artists</router-link>
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

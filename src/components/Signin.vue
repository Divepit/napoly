<template>
  <div >
    <div >
      <h3 >Sign In</h3>
      <form @submit.prevent="signin">
        <div v-if="error">{{ error }}</div>
        <div v-if="!signedIn()">
          <label for="email" >E-mail Address</label>
          <input type="" v-model="email" id="email" placeholder="testuser@example.com">
          <label for="password">Password</label>
          <input type="password" v-model="password" id="password" placeholder="Password">
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Signin',
  data () {
    return {
      email: '',
      password: '',
      error: ''
    }
  },
  created () {
    this.checkSignedIn()
  },
  updated () {
    this.checkSignedIn()
  },
  methods: {
    signedIn () {
      return localStorage.signedIn
    },
    signin () {
      this.$http.plain.post('/signin', { email: this.email, password: this.password })
        .then(response => this.signinSuccessful(response))
        .catch(error => this.signinFailed(error))
    },
    signinSuccessful (response) {
      if (!response.data.csrf) {
        this.signinFailed(response)
        return
      }
      localStorage.csrf = response.data.csrf
      localStorage.signedIn = true
      this.$store.state.signer = true
      this.error = ''
      this.$router.replace('/')
    },
    signinFailed (error) {
      this.error = (error.response && error.response.data && error.response.data.error) || ''
      delete localStorage.csrf
      delete localStorage.signedIn
    },
    checkSignedIn () {
      if (localStorage.signedIn) {
        this.$router.replace('/')
      }
    }
  }
}
</script>

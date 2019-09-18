<!-- recordstore-frontend/src/components/Signup.vue -->

<template>
      <v-container fluid>
        <v-form>
      <v-layout row justify-center>

        <v-flex xs12 sm12 md12>
          <v-text-field
            label="E-mail address"
            placeholder=""
            outline
            type="email"
            v-model="email"
            browser-autocomplete="false"
            color="teal accent-2"
            id="email"
            dont-fill-mask-blanks
          ></v-text-field>
        </v-flex>
        &nbsp;
        <v-flex xs12 sm12 md12>
          <v-text-field
            color="teal accent-2"
            label="Password"
            placeholder=""
            outline
            type="password"
            v-model="password"
            autocomplete="false"
            id="password"
          ></v-text-field>
        </v-flex>
        &nbsp;
        <v-flex xs12 sm12 md12>
          <v-text-field
            color="teal accent-2"
            label="Password Confirmation"
            placeholder=""
            outline
            type="password"
            v-model="password_confirmation"
            autocomplete="false"
            id="password_confirmation"
            @keyup.enter="signup()"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>
        <v-flex xs12 sm12 md12>

        <v-checkbox color="teal accent-2" v-model="admin" id="admin" label="Admin"></v-checkbox>
      </v-flex>
      <v-flex xs12 sm12 md12 justify-self-right style="text-align: right;">
        <v-btn flat color="teal accent-2" @click="signup()">Create User</v-btn>
      </v-flex>

      </v-layout>
    </v-form>
    </v-container>
</template>
<script>
export default {
  name: 'Signup',
  data () {
    return {
      email: '',
      password: '',
      password_confirmation: '',
      admin: false,
      error: ''
    }
  },
  methods: {
    signup () {
      this.$http.secured.post('/signup/', { email: this.email, password: this.password, password_confirmation: this.password_confirmation, role: this.admin })
        .then(response => {
          this.$emit('pushUser', response)
          this.email = ''
          this.password = ''
          this.password_confirmation = ''
        })
    },
    signupSuccessful (response) {
      if (!response.data.csrf) {
        this.signupFailed(response)
        return
      }

      localStorage.csrf = response.data.csrf
      localStorage.signedIn = true
      this.error = ''
      this.$router.replace('/links')
    },
    signupFailed (error) {
      this.error = (error.response && error.response.data && error.response.data.error) || 'Something went wrong'
      delete localStorage.csrf
      delete localStorage.signedIn
    }
  }
}
</script>

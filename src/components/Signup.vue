<!-- recordstore-frontend/src/components/Signup.vue -->

<template>
      <v-container fluid>
        <v-form>
        <v-layout row justify-center>
          <v-flex xs2 sm2 md2>

          <div class="">
            Create New User
            <v-divider/>
            <br>
          </div>
        </v-flex>
      </v-layout>
      <v-layout row justify-center>

        <v-flex xs2 sm2 md2>
          <v-text-field
            label="E-mail address"
            placeholder=""
            outline
            type="email"
            v-model="email"
            autocomplete="false"
            id="email"
          ></v-text-field>
        </v-flex>

        <v-flex xs2 sm2 md2>
          <v-text-field
            label="Password"
            placeholder=""
            outline
            type="password"
            v-model="password"
            autocomplete="false"
            id="password"
          ></v-text-field>
        </v-flex>

        <v-flex xs2 sm2 md2>
          <v-text-field
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
        <v-flex xs2 sm2 md3>

        <v-checkbox v-model="admin" id="admin" label="Admin"></v-checkbox>
      </v-flex>
      <v-flex xs2 sm2 md3 justify-self-right style="text-align: right;">
        <v-btn depressed color="primary" @click="signup()">Create User</v-btn>
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
      this.$http.plain.post('/signup', { email: this.email, password: this.password, password_confirmation: this.password_confirmation, role: this.admin })
        .then(response => {
          this.$emit('pushUser', response)
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

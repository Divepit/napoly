<!-- Generic sign-in page -->
<template>
  <v-content fluid>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col sm="12" md="6">
          <v-card flat>
            <v-toolbar flat>
              <v-spacer/>
              <v-toolbar-title class="grey--text">Sign in to napoly.ch</v-toolbar-title>
              <v-spacer/>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field solo label="Username" name="Username" prepend-inner-icon="mdi-account"  type="text" v-model="email" @keydown.enter="signin"/>
                <v-text-field solo id="password" label="Password" name="password" prepend-inner-icon="mdi-lock" type="password" @keydown.enter="signin"
                              v-model="password"/>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn outlined color="primary" @click="signin">Sign in</v-btn>
              <v-spacer/>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import { plainAxiosInstance } from '../../backend/axios'
import { mapState } from 'vuex'

export default {
  name: 'Signin',
  created () {
    // If user is already signed in, we redirect him to the Admin Interface
    if (localStorage.signedIn) {
      // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
      this.message.text = 'Already Signed in'
      this.message.color = 'warning'
      this.message.active = true
      this.$router.replace('/admin')
    }
  },
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    ...mapState(['message', 'signedIn'])
  },
  methods: {
    signin () {
      // Error in case user forgets to enter username or password
      if (!this.email || !this.password) {
        // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
        this.message.text = 'Invalid e-mail or password'
        this.message.color = 'error'
        this.message.active = true
        return
      }
      // Note that signin requests are sent directly to /signin and NOT to /api/v1/signin as they use a different set of controllers
      plainAxiosInstance.post('/signin', { email: this.email, password: this.password })
        .then(response => {
          if (response.data.csrf) {
            // We extract all the provided information about the user and store them in localStorage
            localStorage.csrf = response.data.csrf
            localStorage.username = response.data.username
            localStorage.uid = response.data.id
            localStorage.userRole = response.data.role
            localStorage.userField = response.data.field_id
            localStorage.signedIn = true
            // Let the application know globally that we are logged in now
            this.$store.state.signedIn = true
            // Redirect
            this.$router.replace('/')
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = 'Signin Successful'
            this.message.color = 'success'
            this.message.active = true
          }
        })
        .catch(error => {
          // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
          this.message.text = error
          this.message.color = 'error'
          this.message.active = true
        })
    }
  }
}
</script>

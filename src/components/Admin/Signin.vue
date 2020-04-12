<!-- Generic Sign-in page -->
<template>
  <v-content fluid>
    <v-container class="fill-height">
      <v-row align="center" justify="center">
        <v-col cols="6">
          <v-card class="elevation-12">
            <v-toolbar dark flat>
              <v-toolbar-title>Login form</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field label="Login" name="login" prepend-icon="mdi-face" type="text" v-model="email"/>
                <v-text-field id="password" label="Password" name="password" prepend-icon="mdi-lock" type="password"
                              v-model="password"/>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn @click="signin">Login</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
// plainAxiosInstance is defined in the axios wrapper and is used to access API values which do not require authentication
import { plainAxiosInstance } from '../../backend/axios'
// For the functionality of mapState, mapActions and mapMutations please refer to the vuex documentation
import { mapState } from 'vuex'

export default {
  name: 'Signin',
  data () {
    return {
      email: '',
      password: ''
    }
  },
  computed: {
    ...mapState(['message'])
  },
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
  methods: {
    signin () {
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
            localStorage.csrf = response.data.csrf
            localStorage.username = response.data.username
            localStorage.uid = response.data.id
            localStorage.userRole = response.data.role
            localStorage.userField = response.data.field_id
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = 'Signin Successful'
            this.message.color = 'success'
            this.message.active = true
            localStorage.signedIn = true
            this.$store.state.signedIn = true
            this.$router.replace('/admin')
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

<style scoped>

</style>

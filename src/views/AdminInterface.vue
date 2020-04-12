<template>
  <div>
    <AdminToolbar/>
    <v-content>
      <v-container>
        <v-row class="headline mb-6 mt-6">Hello, {{username}}</v-row>
        <v-card>
          <v-card-title>Change Password</v-card-title>
          <v-card-text>
            <v-text-field label="New Password" type="password" v-model="password"></v-text-field>
            <v-text-field label="Password Confirmation" type="password" v-model="password_confirmation"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn tile outlined color="primary" @click="changePassword">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import AdminToolbar from '../components/Admin/AdminToolbar'
import { mapState } from 'vuex'
import { securedAxiosInstance } from '../backend/axios'
export default {
  name: 'AdminInterface',
  components: { AdminToolbar },
  created () {
    this.username = localStorage.username
    this.uid = localStorage.uid
    this.userField = localStorage.userField
  },
  data () {
    return {
      uid: null,
      username: null,
      email: null,
      password: null,
      password_confirmation: null
    }
  },
  computed: {
    ...mapState(['message'])
  },
  methods: {
    changePassword () {
      if (this.password === this.password_confirmation) {
        securedAxiosInstance.patch('/api/v1/users/' + this.uid, {
          field_id: this.userField,
          email: this.username,
          password: this.password,
          password_confirmation: this.password_confirmation
        })
          .then(
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = `Password updated`,
            this.message.color = 'success',
            this.message.active = true
          )
          .catch(error => {
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = error
            this.message.color = 'error'
            this.message.active = true
          })
      } else {
        // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
        this.message.text = 'Password and confirmation do not match'
        this.message.color = 'error'
        this.message.active = true
      }
    }
  }
}
</script>

<style scoped>

</style>

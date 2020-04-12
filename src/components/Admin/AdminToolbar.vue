<!-- Sidebar used in the admin interface -->
<template>
  <div>
    <v-navigation-drawer dark app overflow permanent color="primary">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="title">
              Napoly.ch
            </v-list-item-title>
            <v-list-item-subtitle>
              Student Document Repository
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider/>
        <!-- List of links to different functions / pages available to admins-->
        <v-list-item-group>
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Homepage</v-list-item-title>
          </v-list-item>
          <v-divider/>
          <v-list-item to="/account" v-if="userRole === '1'">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Account Management</v-list-item-title>
          </v-list-item>
          <v-divider v-if="userRole === '1'"/>
          <v-list-item @click="signOut()">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Log Out</v-list-item-title>
          </v-list-item>
          <v-divider/>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>

</template>
<script>
import { securedAxiosInstance } from '@/backend/axios'

export default {
  name: 'AdminToolbar',
  created () {
    // Redirects user to homepage in case he is not signed in
    if (localStorage.signedIn !== 'true') {
      this.$router.replace('/')
    }
    this.userRole = localStorage.userRole
  },
  data () {
    return {
      username: null,
      userRole: null
    }
  },
  methods: {
    // Signs out the user at the API and purges the localStorage
    signOut () {
      this.$store.signedIn = false
      securedAxiosInstance.delete('/signin')
        .then(response => {
          delete localStorage.csrf
          delete localStorage.signedIn
          delete localStorage.username
          delete localStorage.uid
          delete localStorage.userRole
          delete localStorage.userField
          this.$store.state.signedIn = false
          this.$router.replace('/')
        })
    }
  }
}
</script>

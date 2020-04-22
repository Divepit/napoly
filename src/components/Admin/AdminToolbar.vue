<!-- This sidebar is used in the admin interface, its title should always be the same as the title in the frontpage -->
<!-- TODO: Merge the frontpage toolbar and the admin toolbar so they are not two components-->
<template>
  <div>
    <v-navigation-drawer v-model="showDrawer" dark app overflow color="primary">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title style="font-size: 1.5rem" class="font-weight-light">
              napoly
            </v-list-item-title>
            <v-list-item-subtitle class="font-weight-light">
              Student Document Repository
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider/>
        <!-- List of links to different functions / pages available to admins-->
        <v-list-item-group>
          <v-list-item to="/">
            <v-list-item-icon class="mr-2">
              <v-icon small color="white">mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="font-weight-light white--text">Homepage</v-list-item-title>
          </v-list-item>
          <v-divider/>
          <v-list-item to="/admin">
            <v-list-item-icon class="mr-2">
              <v-icon small color="white">mdi-account-cowboy-hat</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="font-weight-light white--text">My Account</v-list-item-title>
          </v-list-item>
          <v-divider/>
          <v-list-item to="/account" v-if="userRole === '1'">
            <v-list-item-icon class="mr-2">
              <v-icon small color="white">mdi-account-multiple-plus</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="font-weight-light white--text">User Management</v-list-item-title>
          </v-list-item>
          <v-divider v-if="userRole === '1'"/>
          <v-list-item @click="signOut()" >
            <v-list-item-icon class="mr-2">
              <v-icon small color="white">mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-title class="font-weight-light white--text">Log Out</v-list-item-title>
          </v-list-item>
          <v-divider/>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app flat dense color="white">
      <v-app-bar-nav-icon @click.stop="showDrawer = !showDrawer"></v-app-bar-nav-icon>
    </v-app-bar>
  </div>

</template>
<script>
import { securedAxiosInstance } from '@/backend/axios'

export default {
  name: 'AdminToolbar',
  created () {
    // Redirect user to homepage in case he is not signed in
    if (localStorage.signedIn !== 'true') {
      this.$router.replace('/')
    }
    // Get user role, to display conditional menu-items
    this.userRole = localStorage.userRole
  },
  data () {
    return {
      showDrawer: true,
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

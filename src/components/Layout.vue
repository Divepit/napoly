<template>
  <v-app id="sandbox" :dark="dark">
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      :permanent="primaryDrawer.type === 'permanent'"
      :temporary="primaryDrawer.type === 'temporary'"
      :clipped="primaryDrawer.clipped"
      :floating="primaryDrawer.floating"
      :mini-variant="primaryDrawer.mini"
      overflow
      app
    >
  <SidebarContent/>
  </v-navigation-drawer>
    <v-toolbar  :clipped-left="primaryDrawer.clipped" app fixed>
      <v-toolbar-side-icon
        v-if="primaryDrawer.type !== 'permanent'"
        @click.stop="primaryDrawer.model = !primaryDrawer.model">
      </v-toolbar-side-icon>
      <v-toolbar-title href="/"></v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="">
        <v-btn flat to="/" class="fonted">Links</v-btn>
        <v-btn flat v-if="!signer" to="/signin" class="fonted">Sign In</v-btn>
        <v-btn flat v-if="signer" class="fonted" to="/admin">Admin</v-btn>
        <v-btn flat v-if="signer" class="fonted" @click="signOut()">Sign Out</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import SubjectList from '@/components/SubjectList'
import SidebarContent from '@/components/SidebarContent'
import Hero from '@/components/Hero'
import {mapState} from 'vuex'

export default {
  components: {
    SubjectList,
    SidebarContent,
    Hero
  },
  data: () => ({
    primaryDrawer: {
      model: null,
      type: 'temporary',
      clipped: false,
      floating: false,
      mini: false
    },
    footer: {
      inset: false
    }
  }),
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
      localStorage.signedIn = false
      this.$store.state.signer = false
      this.$http.secured.delete('/signin')
        .then(response => {
          delete localStorage.csrf
          delete localStorage.signedIn
          delete localStorage.uid
          delete localStorage.admin
          delete localStorage.userField
          this.$forceUpdate()
        })
        .catch(error => this.setError(error, 'Cannot sign out'))
    }
  },
  computed: {
    ...mapState([
      'signer',
      'dark'
    ])
  }
}
</script>

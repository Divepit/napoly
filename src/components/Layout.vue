<template>
  <v-app id="sandbox" :dark="dark">
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      :permanent="primaryDrawer.type === 'permanent'"
      :temporary="primaryDrawer.type === 'temporary'"
      :clipped="primaryDrawer.clipped"
      :floating="primaryDrawer.floating"
      :mini-variant="primaryDrawer.mini"
      absolute
      overflow
      app
    >
  <SidebarContent/>
  </v-navigation-drawer>
    <v-toolbar :clipped-left="primaryDrawer.clipped" app absolute>
      <v-toolbar-side-icon
        v-if="primaryDrawer.type !== 'permanent'"
        @click.stop="primaryDrawer.model = !primaryDrawer.model">
      </v-toolbar-side-icon>
      <v-toolbar-title>Canoodle</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat to="/" class="fonted">Links</v-btn>
        <v-btn flat v-if="!signedIn()" to="/signin" class="fonted">Sign In</v-btn>
        <v-btn flat v-if="signedIn()" class="fonted" @click="signOut()">Sign Out</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
    <v-footer :inset="footer.inset" app>
      <span class="px-3">&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import SubjectList from '@/components/SubjectList'
import SidebarContent from '@/components/SidebarContent'
export default {
  components: {
    SubjectList,
    SidebarContent
  },
  data: () => ({
    dark: false,
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
      this.signer = localStorage.signedIn
      return localStorage.signedIn
    },
    signOut () {
      localStorage.signedIn = false
      this.signer = false
      this.$http.secured.delete('/signin')
        .then(response => {
          delete localStorage.csrf
          delete localStorage.signedIn
          this.$forceUpdate()
        })
        .catch(error => this.setError(error, 'Cannot sign out'))
    }
  },
  watch: {
    signer: function (val) {
      signedIn()
    }
  }
}
</script>

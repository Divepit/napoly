<template>
  <v-app id="sandbox" :dark="dark">
    <v-navigation-drawer
    v-model="primaryDrawer.model"
    temporary
    overflow
    app
    >
    <SidebarContent />
  </v-navigation-drawer>
  <v-toolbar app fixed dark color="main" >
    <v-toolbar-side-icon @click.stop="primaryDrawer.model = !primaryDrawer.model" />
    <p class="pt-3" @click.stop="primaryDrawer.model = !primaryDrawer.model" style="cursor: pointer;">
      Filter anpassen
    </p>
    <!-- <v-toolbar-title class=" hidden-sm-and-down titlebartext--text headline font-weight-bold muli"> napoly </v-toolbar-title> -->
    <v-spacer/>
    <v-toolbar-items >
      <!-- <v-btn flat to="/" class="titlebartext--text subheading font-weight-regular text-capitalize">Links</v-btn> -->
      <v-btn flat v-if="signer" to="/admin" class="titlebartext--text subheading font-weight-regular text-capitalize">Admin</v-btn>
      <v-btn flat v-if="signer" @click="signOut()" class="titlebartext--text subheading font-weight-regular text-capitalize">Sign Out</v-btn>
    </v-toolbar-items>
  </v-toolbar>

  <v-content>
    <router-view/>
  </v-content>
</v-app>
</template>

<script>
import SidebarContent from '@/components/SidebarContent'
import {mapState} from 'vuex'

export default {
  components: {
    SidebarContent
  },
  data: () => ({
    primaryDrawer: {
      model: null
    }
  }),
  created () {
    this.signedIn()
  },
  methods: {
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
          delete localStorage.username
          this.$forceUpdate()
        })
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
<style media="screen">
.muli {
  font-family: 'Muli', sans-serif !important;
}
</style>

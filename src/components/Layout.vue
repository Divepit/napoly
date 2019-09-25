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
  <v-toolbar app fixed dark :color="colors[color]" >
    <v-toolbar-side-icon @click.stop="primaryDrawer.model = !primaryDrawer.model" />
    <p class="pt-3" @click.stop="primaryDrawer.model = !primaryDrawer.model" style="cursor: pointer;">
      Filter anpassen
    </p>
    <!-- <v-toolbar-title class=" hidden-sm-and-down titlebartext--text headline font-weight-bold muli"> napoly </v-toolbar-title> -->
    <v-spacer/>
    <v-toolbar-items >
      <!-- <v-btn flat to="/" class="titlebartext--text subheading font-weight-regular text-capitalize">Links</v-btn> -->
      <v-icon v-if="signer" class="mr-2 nonselectable" @click="changeColor">brush</v-icon>
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
    },
    colors: ['#fc5c65', '#fd9644', '#fed330', '#26de81', '#2bcbba', '#45aaf2', '#4b7bec', '#a55eea', '#d1d8e0', '#778ca3', '#4b6584', '#3d3d3d'],
    color: '5'
  }),
  created () {
    this.signedIn()
    this.setColor()
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
    },
    setColor () {
      if (this.$store.state.signer || (localStorage.color != 5 && localStorage.color != null)) {
        if (localStorage.color != null) {
          this.color = parseInt(localStorage.color, 10)
          this.$store.state.color = localStorage.color
        } else {
          localStorage.color = 5
          this.color = 5
        }
      }
    },
    changeColor () {
      if (this.color < this.colors.length - 1) {
        this.color += 1
      } else {
        this.color = 0
      }
      localStorage.color = this.color
      this.$store.state.color = localStorage.color

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

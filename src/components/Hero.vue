<!-- TODO: Unfuck this -->
<template lang="html">
  <div style="height: 94vh" :class="(color == 5 || color == null) ? 'gradient absolute' : 'absolute'" :style="(color == 5 || color == null) ? '' : ('background: ' + colors[color] )">
    <v-container grid-list-xl text-xs-center fill-height  class=" fixed " style="height: 95vh; width:100vw; max-width: 100vw !important; " >
      <v-layout  wrap align-center>
        <v-flex md12>
          <span class="muli display-3 white--text font-weight-thin ">napoly.ch</span>
          <br>
          <span class="headline white--text font-weight-thin">Student Document Repository</span>
          <v-flex md12 mt-5 >
            <v-progress-circular v-if="this.$store.state.loadingSubjects" indeterminate color="white" :size="50" width="2" ></v-progress-circular>
          </v-flex>
        </v-flex>
      </v-layout >
    </v-container>
    <div class="hidden-sm-and-down" style="position: fixed; right: 2vw; bottom: 1vh;">
      <span class="title white--text font-weight-thin mb-4" style="position: absolute; left: -125px; bottom: -5px">Supported by</span>
      <a href="https://sph.ethz.ch" target="_blank"> <img :src="require('@/assets/sph.png')" height="70"></img></a>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import SubjectButtons from '@/components/SubjectButtons'
export default {
  components: {
    SubjectButtons
  },
  created () {
    this.ensureLocalStorage()
  },
  computed: {
    ...mapState([
      'color',
      'colors'
    ])
  },
  methods: {
    ensureLocalStorage () {
      if (localStorage.signedIn && localStorage.username == null) {
        this.signOut()
      }
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
    }

  }
}
</script>

<style lang="css" scoped>
  .custImage {
    height: 95vh !important;
  }
  .gradient {
  background: #45aaf2; /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #45aaf2, #2d98da); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #45aaf2, #2d98da); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  }
</style>

<!-- TODO: Unfuck this -->
<template lang="html">
  <div style="height: 100vh" class="gradient absolute">
    <v-container grid-list-md text-xs-center justify-center fill-height class=" fixed " style="height: 95vh; width:100vw; max-width: 100vw !important; " >
      <v-layout row wrap align-center>
        <v-flex md12 >
          <!-- <v-avatar tile size="200" >
            <img src="https://www.svgrepo.com/show/229523/volcano.svg" alt="avatar" style="border-radius: 0px 0px 75px 75px;">
          </v-avatar>
          <br> -->
          <span class="muli display-3 white--text font-weight-thin ">napoly.ch</span>
          <br>
          <span class="headline white--text font-weight-thin">Student Document Repository</span>
        </v-flex>
      </v-layout >
    </v-container>
  </div>
</template>

<script>
import SubjectButtons from '@/components/SubjectButtons'
export default {
  components: {
    SubjectButtons
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

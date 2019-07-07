<template lang="html">
  <section>
    <v-parallax
        dark
        class="image"
        src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg"
      >
        <v-layout
          align-center
          column
          justify-center
        >
          <h1 class="display-2 font-weight-thin mb-3"></h1>
          <h4 class="subheading"></h4>
        </v-layout>
      </v-parallax>
    <v-container class="subimage" dark>
      <v-layout>
      </v-layout>
    </v-container>

  </section>

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
  .image {
    position: absolute;
    width: 100vw;
    height: 60vh !important;
    background: rgba(red, 0.5);

  }
  .subimage {
    height: 40vh !important;
  }
</style>

<template lang="html">
    <v-parallax
        src="https://www.napoly.ch/assets/18.jpg"
        class="custImage"
        height=""
      >
        <v-layout
          align-center
          column
          justify-center
        >
          <h1 class="display-2 font-weight-thin mb-3">Napoly</h1>
          <h4 class="subheading">Beta v1.5.0</h4>
        </v-layout>
      </v-parallax>
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
</style>

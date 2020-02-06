<template>
  <div>
    <v-btn :href="btn.buttonUrl" :key="btn.id" class="mx-2" target="_blank" v-for="btn in buttons">{{btn.buttonLabel}}
    </v-btn>
  </div>
</template>

<script>
import { plainAxiosInstance } from '../../backend/axios'

export default {
  name: 'SubjectButtons',
  data () {
    return {
      buttons: []
    }
  },
  created () {
    this.getButtons()
  },
  props: {
    subject: null
  },
  methods: {
    getButtons () {
      plainAxiosInstance.get(`https://api.napoly.ch/api/v1/buttons?subject_id=${this.subject.id}`).then(response => {
        this.buttons = response.data
      })
    }
  }
}
</script>

<style scoped>

</style>

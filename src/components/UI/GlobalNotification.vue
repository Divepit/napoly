<template>
  <div class="text-center">
    <v-snackbar top :color="message.color" v-model="message.active" :timeout="message.timeout">
      <v-spacer/>
      {{ message.text }}
      <v-spacer/>
    </v-snackbar>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'GlobalNotification',
  computed: {
    ...mapState(['message'])
  }
}
</script>

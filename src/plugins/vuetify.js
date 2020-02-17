import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#3da4ea',
        secondary: '#b0bec5',
        anchor: '#8c9eff'
      }
    }
  }
})

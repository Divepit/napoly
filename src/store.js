import Vue from 'vue'
import Vuex from 'vuex'
import router from './router'
import { securedAxiosInstance, plainAxiosInstance } from './backend/axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    secured: securedAxiosInstance,
    plain: plainAxiosInstance,
    email: 'testuser@example.com',
    password: 'password',
    error: ''
  },
  mutations: {
    signedIn () {
      return localStorage.signedIn
    }
  },
  actions: {
    signIn () {
      this.state.plain.post('/signin', { email: this.state.email, password: this.state.password })
        .then(response => this.dispatch('signinSuccessful', response))
        .catch(error => this.dispatch('signinFailed', error))
    },
    signinSuccessful (response) {
      if (!response.data.csrf) {
        this.dispatch('signinFailed', response)
        return
      }

      localStorage.csrf = response.data.csrf
      localStorage.signedIn = true
      this.state.error = ''
      router.replace('/')
    },

    signinFailed (error) {
      this.state.error = (error.response && error.response.data && error.response.data.error) || ''
      delete localStorage.csrf
      delete localStorage.signedIn
    },
    checkSignedIn () {
      if (localStorage.signedIn) {
        router.replace('/')
      }
    },
    signOut () {
      this.state.secured.delete('/signin')
        .then(response => {
          delete localStorage.csrf
          delete localStorage.signedIn
          router.replace('/')
        })
        .catch(error => this.setError(error, 'Cannot sign out'))
    }
  }
})

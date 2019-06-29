<template lang="html">
  <div v-if="signer" class="">
    <Signup @pushUser="pushUser($event)"/>
    <v-container
        fluid
        grid-list-lg
      >
    <v-layout  row wrap >
          <v-flex v-for="user in users" :key="user.id" xs4>
            <v-card :color="user.role ? 'success':'info'" class="white--text text-sm-left">
              <v-card-title primary-title>
                <div>
                  <div class="headline">[UID: {{user.id}}] {{user.email}} </div>
                  <br>
                  <v-divider dark />
                  <br>
                  <p></p>
                  <!-- <p>Created at: {{user.created_at}}</p> -->
                  <!-- <p>Updated at: {{user.updated_at}}</p> -->
                  <p>Role: {{user.role}}</p>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn depressed dark color="error" @click="dialog = !dialog">Delete</v-btn>
              </v-card-actions>
            </v-card>

            <v-dialog v-model="dialog" persistent max-width="290">

              <v-card>
                <v-card-title class="headline">Delete User?</v-card-title>
                <v-card-text>By confirming, the user <strong style="color: gray;">{{user.email}}</strong> will be deleted</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="info" flat @click="dialog = false">Cancel</v-btn>
                  <v-btn color="error" flat @click="dialog = false; removeUser(user.id)">Delete</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-flex>
    </v-layout>

  </v-container>
  </div>

</template>

<script>
import Signup from '@/components/Signup'
import {mapState} from 'vuex'
export default {
  name: 'AdminInterface',
  components: {
    Signup
  },
  computed: {
    ...mapState([
      'signer'
    ])
  },
  data () {
    return {
      users: [],
      dialog: false
    }
  },
  created () {
    this.checkSignedIn()
    this.getUsers()
  },
  methods: {
    signedIn () {
      return localStorage.signedIn
    },
    checkSignedIn () {
      if (!localStorage.signedIn) {
        this.$router.replace('/')
      }
    },
    getUsers () {
      this.users = []
      this.$http.secured.get('/api/v1/users')
        .then(response => {
          this.users = response.data
        })
    },
    removeUser (user) {
      this.$http.secured.delete(`/api/v1/users/${user}`)
        .then(response => {
          this.users.splice(this.users.indexOf(user), 1)
        })
    },
    pushUser (user) {
      this.users.push(user)
      this.getUsers()
    }
  }
}
</script>

<style lang="css" scoped>
</style>

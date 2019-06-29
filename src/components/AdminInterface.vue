<template lang="html">
  <div v-if="signer" class="">
    <Signup @pushUser="pushUser($event)"/>
    <v-container fluid grid-list-lg>
    <v-layout  row wrap justify-center>
          <v-flex v-for="user in users" :key="user.id" xs12 sm12 md3>
            <v-card :color="user.role ? 'teal accent-4':'cyan darken-3'" class="white--text text-sm-left rounded">
              <v-card-title primary-title>
                <div>
                  <div class="headline">
                    <v-icon v-if="user.role == 1" large >android</v-icon>
                    <v-icon v-else large >account_box</v-icon>
                    &nbsp;
                    {{user.email}}
                  </div>
                  <br>
                  <v-divider dark />
                  <p></p>
                  <!-- <p>Created at: {{user.created_at}}</p> -->
                  <!-- <p>Updated at: {{user.updated_at}}</p> -->
                  <div style="text-align: left;">UID: {{user.id}}</div>
                  <div style="text-align: left;">{{getRole(user)}}</div>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn depressed dark color="red lighten-2" @click="deleting = !deleting; currentUser = user">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
    </v-layout>
    <v-dialog v-model="deleting" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Delete User?</v-card-title>
        <v-card-text>By confirming, the user <strong style="color: gray;">{{currentUser.email}}</strong> will be deleted</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="info" flat @click="deleting = false">Cancel</v-btn>
          <v-btn color="error" flat @click="deleting = false; removeUser(currentUser.id)">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
      deleting: false,
      currentUser: ''
    }
  },
  created () {
    this.checkSignedIn()
    this.getUsers()
    this.$store.state.dark = true
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
      this.currentUser = ''
      this.$http.secured.delete(`/api/v1/users/${user}`)
        .then(response => {
          this.getUsers()
        })
    },
    pushUser (user) {
      this.users.push(user)
      this.getUsers()
    },
    getRole (user) {
      return user.role === 1 ? 'Role: Admin' : `Role: ${user.role}`
    }
  }
}
</script>

<style lang="css" scoped>
  .rounded {
    border-radius: 10px;
  }
</style>

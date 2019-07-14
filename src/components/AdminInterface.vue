<template lang="html">
  <div v-if="signer" class="">
    <Signup v-if="this.super" @pushUser="pushUser($event)"/>
    <v-container fluid grid-list-lg>
    <v-layout row wrap justify-center>
          <v-flex v-for="user in users" :key="user.id" xs12 sm12 md3>
            <v-card :color="user.role ? 'teal accent-4':'cyan darken-3'" class="white--text text-sm-left rounded" @click="editUser(user)">
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
                  <div style="text-align: left;">User ID: {{user.id}}</div>
                  <div style="text-align: left;">{{getRole(user)}}</div>
                  <div style="text-align: left;">Field: {{user.field_id}}</div>
                </div>
              </v-card-title>
            </v-card>
          </v-flex>
    </v-layout>
    <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="600px">
      <template v-slot:activator="{ on }">
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm12 md12>
                <v-text-field label="Username" type="email" v-model="editedEmail" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="Password" v-model="editedPassword" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-text-field label="Password confirmation" v-model="editedPasswordConfirmation" required></v-text-field>
              </v-flex>
              <v-flex v-if="this.super" xs6 sm6 md6>
                <v-select
                  :items="fields"
                  item-value="id"
                  item-text="fieldName"
                  label="Field"
                  required
                  v-model="editedField"
                ></v-select>
              </v-flex>
              <v-flex v-if="this.super" xs6 sm6 md6>
              <v-checkbox color="teal accent-2" v-model="admin" id="admin" label="Admin"></v-checkbox>
            </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="this.super" depressed dark color="red lighten-2" @click="deleting = !deleting">Delete</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
          <v-btn color="blue darken-1" flat @click="dialog = false; updateUser()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      fields: [],
      deleting: false,
      currentUser: '',
      editedEmail: '',
      editedField: '',
      editedPassword: '',
      editedPasswordConfirmation: '',
      dialog: false,
      admin: null,
      super: false

    }
  },
  created () {
    this.checkSignedIn()
    this.getUsers()
    this.getFields()
    this.$store.state.dark = true
    this.checkSuper()
  },
  methods: {
    signedIn () {
      return localStorage.signedIn
    },
    checkSignedIn () {
      if (!localStorage.signedIn) {
        this.$router.replace('/signin')
      }
    },
    getUsers () {
      this.users = []
      this.$http.secured.get('/api/v1/users')
        .then(response => {
          this.users = response.data
        })
    },
    getFields () {
      this.fields = []
      this.$http.plain.get('/api/v1/fields')
        .then(response => {
          this.fields = response.data
        })
    },
    removeUser (user) {
      this.currentUser = ''
      this.$http.secured.delete(`/api/v1/users/${user}`)
        .then(response => {
          this.getUsers()
          this.dialog = false
        })
    },
    updateUser () {
      this.$http.secured.patch(`/api/v1/users/${this.currentUser.id}`, {
        user: {
          email: this.editedEmail,
          field_id: this.editedField,
          password: this.editedPassword,
          password_confirmation: this.editedPasswordConfirmation,
          role: this.admin
        }
      })
        .then(response => {
          this.getUsers()
          this.editedEmail = ''
          this.editedPassword = ''
          this.editedPasswordConfirmation = ''
          this.admin = ''
        })
    },
    pushUser (user) {
      this.users.push(user)
      this.getUsers()
    },
    getRole (user) {
      return user.role === 1 ? 'Role: Admin' : `Role: ${user.role}`
    },
    editUser (user) {
      this.dialog = true
      this.currentUser = user
      this.editedEmail = user.email
      this.editedField = user.field_id
      this.admin = user.role
    },
    checkSuper () {
      if (localStorage.admin === '1') {
        this.super = true
      } else {
        this.super = false
      }
    }
  }
}
</script>

<style lang="css" scoped>
  .rounded {
    border-radius: 10px;
  }
</style>

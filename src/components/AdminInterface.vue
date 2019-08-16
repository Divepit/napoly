<template>
  <div v-if="signer">
    <Signup v-if="this.super" @pushUser="pushUser($event)"/>
    <v-container grid-list-lg>
      <v-layout justify-center>
        <v-flex v-for="user in users" :key="user.id" xs12 sm12 md3>
          <v-card :color="user.role ? 'teal accent-4':'cyan darken-3'" class="text-sm-left" @click="editUser(user)">
            <v-card-title class="headline">
              <v-icon class="mr-3" v-if="user.role == 1" large >android</v-icon>
              <v-icon v-else large >account_box</v-icon>
              {{user.email}}
            </v-card-title>
            <v-card-text class="py-1">User ID: {{user.id}}</v-card-text>
            <v-card-text class="py-1">{{getRole(user)}}</v-card-text>
            <v-card-text class="py-1 pb-3">Field: {{user.field_id}}</v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
      <v-layout>
        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title class="headline"> User Profile </v-card-title>
            <v-card-text>
              <v-text-field label="Username" type="email" v-model="editedEmail" required></v-text-field>
              <v-text-field label="Password" v-model="editedPassword" required></v-text-field>
              <v-text-field label="Password confirmation" v-model="editedPasswordConfirmation" required></v-text-field>
              <v-select v-if="this.super"
              :items="fields"
              item-value="id"
              item-text="fieldName"
              label="Field"
              required
              v-model="editedField"
              />
              <v-checkbox v-if="this.super"
              color="teal accent-2"
              v-model="admin"
              id="admin"
              label="Admin"
              />
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
      <v-dialog v-model="deleting" persistent max-width="600">
        <v-card>
          <v-card-title>Delete User?</v-card-title>
          <v-card-text class="text-sm-left">Do you really want to delete the user {{currentUser.email}}?</v-card-text>
          <v-card-actions>
            <v-btn color="info" flat @click="deleting = false">Cancel</v-btn>
            <v-spacer/>
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

<template>
  <div v-if="signer">
    <v-container fluid grid-list-md>
      <v-layout justify-center>
        <v-flex xs12 sm12 md4 >
          <v-card class="text-sm-left pointer" to="/">
            <v-card-title class="headline">
              <v-icon class="mr-3" medium >arrow_left</v-icon>
              <p class="my-0 mx-0 py-0 px-0">Back to Napoly</p>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md4 >
          <v-card color="info" class="text-sm-left pointer" @click="display = 'users'">
            <v-card-title class="headline">
              <v-icon class="mr-3" medium >account_box</v-icon>
              <p v-if="this.super" class="my-0 mx-0 py-0 px-0">Manage the Users</p>
              <p v-else class="my-0 mx-0 py-0 px-0">My Account</p>
            </v-card-title>
          </v-card>
        </v-flex>
        <v-flex xs12 sm12 md4 >
          <v-card color="warning" class="text-sm-left pointer" @click="display = 'linklog'">
            <v-card-title class="headline">
              <v-icon class="mr-3" medium >assignment</v-icon>
              See the logs
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container fluid grid-list-md justify-center>
      <v-btn v-if="display == 'users' && this.super" class="text-sm-left" @click="addingUser = !addingUser" >
          <v-icon class="mr-3" medium >add</v-icon>
          Add new user
      </v-btn>
      <v-layout  v-if="display == 'users'" row wrap class="responsive-text" align-center justify-center>

        <v-flex v-for="user in users" :key="user.id" xs12 sm12 md4 >
          <v-card :color="user.role ? '#4b6584':'#778ca3'" class="text-sm-left">
            <v-card-title class="headline">
              <v-icon class="mr-3" v-if="user.role == 1" large >android</v-icon>
              <v-icon v-else large class="mr-3">account_box</v-icon>
              {{user.email}}
            </v-card-title>
            <v-card-text class="py-1">User ID: {{user.id}}</v-card-text>
            <v-card-text class="py-1">{{getRole(user)}}</v-card-text>
            <v-card-text class="py-1 pb-3">Field: {{user.field_id}}</v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn color="accent"  @click="editUser(user)">Edit account</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
      <Linklog v-if="display == 'linklog'"/>
      <v-layout >
        <v-dialog v-model="dialog" max-width="500px" persistent>
          <v-card>
            <v-card-title class="headline"> User Profile </v-card-title>
            <v-card-text>
              <v-text-field label="Username" v-model="editedEmail" required></v-text-field>
              <v-switch color="info" v-model="changingPassword" label="Edit Password" ></v-switch>
              <v-text-field v-if="!changingPassword" disabled label="Password" type="password" v-model="editedPassword" required></v-text-field>
              <v-text-field v-else label="Password" type="password" v-model="editedPassword" required></v-text-field>
              <v-text-field v-if="!changingPassword" disabled label="Password confirmation" type="password" v-model="editedPasswordConfirmation" required></v-text-field>
              <v-text-field v-else label="Password confirmation" type="password" v-model="editedPasswordConfirmation" required></v-text-field>
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
              <v-btn color="blue darken-1" flat @click="dialog = false; changingPassword = false">Close</v-btn>
              <v-btn color="blue darken-1" flat @click="dialog = false; changingPassword = false; updateUser()">Save</v-btn>
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
      <v-dialog v-model="addingUser"  max-width="900">
        <v-card>
          <v-card-title>
            New User
          </v-card-title>
          <v-card-text>
            <Signup v-if="this.super && addingUser" @pushUser="pushUser($event)"/>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script>
import Signup from '@/components/Signup'
import Linklog from '@/components/Linklog'
import {mapState} from 'vuex'
export default {
  name: 'AdminInterface',
  components: {
    Signup,
    Linklog
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
      super: false,
      changingPassword: false,
      addingUser: false,
      display: 'users'

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
      // eslint-disable-next-line
      if (localStorage.admin == '1') {
        this.super = true
      } else {
        this.super = false
      }
    }
  }
}
</script>

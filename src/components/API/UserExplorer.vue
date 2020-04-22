<!-- UserExplorer is a derivative of the ArraySelector combined with the ObjectEditor. If passed an Array of users it will display them and allow the user to edit them.
     Note that this component is quite specific for users but I suggest a TODO: Refactor this component into an Object-Array Explorer-->
<template>
  <v-container fluid>
    <v-data-iterator :items="searchedArray" single-select :items-per-page="100" :page="page" hide-default-footer>
      <template v-slot:header>
        <v-toolbar flat>
          <v-text-field v-model="search" flat solo-inverted hide-details
                        prepend-inner-icon="mdi-account-search" label="Search User"/>
          <v-btn class="ml-4" text outlined
                 @click="editUser({email: '', field_id: 1, role: 1, password: '', password_confirmation: ''})">
            <v-icon left>mdi-account-plus</v-icon>
            Add User
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:default="props">
        <v-list>
          <v-list-item-group v-model="props.items">
            <div v-for="user in props.items" :key="user.id">
              <v-list-item three-line color="primary" @click="editUser(user)">
                <v-list-item-content>
                  <v-list-item-title>{{user.email}}</v-list-item-title>
                  <v-list-item-subtitle>Role: {{user.role === 1 ? 'Admin' : 'Moderator'}}
                    <v-spacer/>
                    Field: {{fields.data[user.field_id-1].fieldName}}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider/>
            </div>
          </v-list-item-group>
        </v-list>
      </template>
    </v-data-iterator>
    <ObjectEditor :object-to-edit="editedUser" :forbidden-attributes="forbiddenAttributes" :active="editingUser"
                  @cancel="editingUser = false" @updateObject="updateUser($event)" @delete="removeUser(editedUser)"/>
  </v-container>
</template>

<script>
// plainAxiosInstance and securedAxiosInstance are defined in the axios wrapper and is used to access API values which do not require authentication
import { securedAxiosInstance } from '../../backend/axios'
import ObjectEditor from '../UI/ObjectEditor'
// For the functionality of mapState, mapActions and mapMutations please refer to the vuex documentation
import { mapActions, mapState } from 'vuex'

export default {
  name: 'UserExplorer',
  components: { ObjectEditor },
  created () {
    this.getUsers()
    this.getFields()
  },
  data () {
    return {
      users: [],
      editedUser: {},
      editingUser: false,
      search: '',
      page: 1,
      itemsPerPage: 4,
      forbiddenAttributes: ['password_digest', 'created_at', 'updated_at', 'id']
    }
  },
  computed: {
    ...mapState(['message']),
    ...mapState('napolyApiModule', ['fields']),
    numberOfPages () {
      return Math.ceil(this.searchedArray.length / this.itemsPerPage)
    },
    searchedArray () {
      if (this.search.length !== 0 && this.search.length !== null) {
        return this.users.filter(item => item.email.includes(this.search) || item.email.includes(this.capitalize(this.search)))
      } else {
        return this.users
      }
    }
  },
  methods: {
    // Note that all the API Actions are defined a separate vuex module at src/store/modules/napolyApi.js
    ...mapActions('napolyApiModule', ['getFields']),
    getUsers () {
      securedAxiosInstance.get('/api/v1/users')
        .then(response => {
          this.users = response.data
        })
    },
    editUser (user) {
      this.editingUser = true
      this.editedUser = user
    },
    // updateUser() will also serve as createUser() in case the user object passed has an undefined id
    updateUser (user) {
      this.editingUser = false
      for (var i in user.objectKeys) {
        this.editedUser[user.objectKeys[i]] = user.objectValues[i]
      }
      if (this.editedUser.email.length !== 0 && this.editedUser.field_id !== null && this.editedUser.id === undefined) {
        securedAxiosInstance.post('/signup', this.editedUser)
          .then(response => {
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = `User ${this.editedUser.email} added`
            this.message.color = 'info'
            this.message.active = true
            this.users = []
            this.getUsers()
          })
          .catch(error => {
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = error
            this.message.color = 'error'
            this.message.active = true
          })
      } else if (this.editedUser.email.length !== 0 && this.editedUser.field_id !== null && this.editedUser.id !== undefined) {
        securedAxiosInstance.patch(`/api/v1/users/${this.editedUser.id}`, this.editedUser)
          .then(response => {
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = `User ${response.data.id} updated`
            this.message.color = 'info'
            this.message.active = true
            this.getUsers()
          })
          .catch(error => {
            // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
            this.message.text = error
            this.message.color = 'error'
            this.message.active = true
          })
      } else {
        // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
        this.message.text = `Invalid User`
        this.message.color = 'error'
        this.message.active = true
      }
    },
    removeUser (user) {
      securedAxiosInstance.delete(`/api/v1/users/${user.id}`)
        .then(
          this.search = '',
          this.editingUser = false,
          this.users.splice(this.users.indexOf(user), 1),
          // TODO: Fix the non DRY way of activating the global message. Using a vuex mutation seems to cause a circular object
          this.message.text = `User ${user.email} removed`,
          this.message.color = 'warning',
          this.message.active = true
        )
    },
    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },
    capitalize (word) {
      return word.charAt(0).toUpperCase() + word.slice(1)
    }
  }
}
</script>

<style scoped>

</style>

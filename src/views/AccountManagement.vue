<template>
  <div>
    <AdminToolbar/>
    <v-content>
      <UserExplorer v-if="userRole == 1"/>
      <v-card v-else>
        <v-card-title>Not permitted</v-card-title>
      </v-card>
    </v-content>
  </div>
</template>

<script>
import AdminToolbar from '../components/Admin/AdminToolbar'
import UserExplorer from '../components/API/UserExplorer'
export default {
  name: 'AdminInterface',
  components: { UserExplorer, AdminToolbar },
  created () {
    this.userRole = localStorage.userRole
  },
  data () {
    return {
      userRole: null
    }
  }
}
</script>

<style scoped>

</style>

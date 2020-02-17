<template>
  <div>
    <AdminToolbar/>
    <v-content>
      <UserExplorer/>
    </v-content>
  </div>
</template>

<script>
import AdminToolbar from '../components/Admin/AdminToolbar'
import UserExplorer from '../components/API/UserExplorer'
export default {
  name: 'AdminInterface',
  components: { UserExplorer, AdminToolbar }
}
</script>

<style scoped>

</style>

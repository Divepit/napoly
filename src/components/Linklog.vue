<template lang="html">
  <v-container>
    <v-layout>
        <v-flex>
          <v-data-table
            :headers="headers"
            :items="links"
            class="elevation-1"
            disable-initial-sort
          >
            <template v-slot:items="props">
              <td>{{ props.item.id }}</td>
              <td>{{ subjects[props.item.subject_id].subjectName }}</td>
              <td>{{ types[props.item.type_id].typeName }}</td>
              <td>{{ props.item.linkWeek }}</td>
              <td>{{ props.item.created_at }}</td>
              <td>{{ props.item.updated_at }}</td>
            </template>
          </v-data-table>
        </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  created () {
    this.getLinks()
    this.getSubjects()
    this.getTypes()
  },
  data () {
    return {
      links: [],
      subjects: [],
      types: [],
      headers: [
        { text: 'Link ID', value: 'id' },
        { text: 'Subject', value: 'subject_id' },
        { text: 'Type', value: 'type_id' },
        { text: 'Week', value: 'linkWeek' },
        { text: 'Created', sortable: false, value: 'created_at' },
        { text: 'Updated', sortable: false, value: 'updated_at' }

      ]
    }
  },
  methods: {
    getLinks () {
      this.$http.secured.get('/api/v1/links')
        .then(response => {
          if (response.data.length) {
            this.links = response.data
            this.links = this.links.reverse()
          }
        })
    },
    getSubjects () {
      this.$http.secured.get('/api/v1/subjects')
        .then(response => {
          if (response.data.length) {
            this.subjects = response.data
            this.subjects = this.subjects.reverse()
          }
        })
    },
    getTypes () {
      this.$http.secured.get('/api/v1/types')
        .then(response => {
          if (response.data.length) {
            this.types = response.data
            this.types = this.types.reverse()
          }
        })
    }

  }

}
</script>

<style lang="css" scoped>
</style>

<template lang="html">
  <v-container>
    <v-layout>
        <v-flex>
          <v-data-table
            :headers="headers"
            :items="links"
            class="elevation-1"
          >
            <template v-slot:items="props">
              <td>{{ props.item.linkUrl }}</td>
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
  },
  data () {
    return {
      links: [],
      headers: [
          {
            text: 'Url',
            sortable: false,
            value: 'linkUrl'
          },
          {
            text: 'Updated',
            sortable: false,
            value: 'updated_at'
          },
        ]
    }
  },
  methods: {
    getLinks () {
      this.$http.secured.get('/api/v1/links')
        .then(response => {
          if (response.data.length) {
            this.links = response.data
          }
        })
    }

  }

}
</script>

<style lang="css" scoped>
</style>

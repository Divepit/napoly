<!-- The ArraySelector component will display all the objects in the array and lets the user search them and select
     one which can then be passed to the upper component -->
<template>
  <v-dialog v-model="active" width="600" persistent>
    <v-card class="pa-3">
      <v-container fluid>
        <v-data-iterator :items="searchedArray" single-select :items-per-page.sync="itemsPerPage" :page="page" hide-default-footer>
          <template v-slot:header>
            <v-toolbar dark color="blue darken-3" class="mb-1">
              <v-text-field v-model="search" flat solo-inverted hide-details prepend-inner-icon="mdi-file-document-box-search-outline" label="Search"/>
            </v-toolbar>
          </template>
          <template v-slot:default="props">
            <v-list-item-group>
              <v-list>
                <v-list-item :color="item === elementToReturn ? 'success':''"  v-for="item in props.items" :key="item" @click="elementToReturn = item">
                  <span>{{item}}</span>
                </v-list-item>
              </v-list>
            </v-list-item-group>
          </template>
        </v-data-iterator>
      </v-container>
      <v-card-actions>
        <span class="mr-4 grey--text">Page {{ page }} of {{ numberOfPages }}</span>
        <v-btn dark color="blue darken-3" class="mr-1" @click="formerPage" x-small>
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn x-small dark color="blue darken-3" class="ml-1" @click="nextPage">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-spacer/>
        <v-btn color="primary" text @click="$emit('cancel')">
          Cancel
        </v-btn>
        <v-btn v-if="elementToReturn" color="primary" @click="$emit('returnSelection', elementToReturn)">
          Select
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'ArraySelector',
  data () {
    return {
      elementToReturn: null,
      itemsPerPageArray: [4, 8, 12],
      search: '',
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4
    }
  },
  props: {
    arrayToSelectFrom: null,
    active: null
  },
  computed: {
    numberOfPages () {
      return Math.ceil(this.searchedArray.length / this.itemsPerPage)
    },
    searchedArray () {
      if (this.search.length !== 0 && this.search.length !== null) {
        return this.arrayToSelectFrom.filter(item => item.includes(this.search) || item.includes(this.capitalize(this.search)))
      } else {
        return this.arrayToSelectFrom
      }
    }
  },
  methods: {
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

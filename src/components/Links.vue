<!-- recordstore-frontend/src/components/links/Links.vue -->

<template>
  <div class="max-w-md m-auto py-10">
    <div class="text-red" v-if="error">{{ error }}</div>
    <h3 class="font-mono font-regular text-3xl mb-4">Add a new link</h3>
    <form action="" @submit.prevent="addLink">
      <div class="mb-6">
        <input class="input"
          autofocus autocomplete="off"
          placeholder="Link URL"
          v-model="newLink.linkUrl" />
        <input class="input"
          autofocus autocomplete="off"
          placeholder="Link Week"
          v-model="newLink.subject_id" />

      </div>
      <input type="submit" value="Add Link" class="font-sans font-bold px-4 rounded cursor-pointer no-underline bg-green hover:bg-green-dark block w-full py-4 text-white items-center justify-center" />
    </form>

    <hr class="border border-grey-light my-6" />

    <ul class="list-reset mt-4">
      <li class="py-4" v-for="link in links" :key="link.id" :link="link">

        <div class="flex items-center justify-between flex-wrap">
          <p class="block flex-1 font-mono font-semibold flex items-center ">
            {{ link.linkUrl }}
          </p>

          <button class="bg-tranparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 mr-2 rounded"
          @click.prevent="editLink(link)">Edit</button>

          <button class="bg-transprent text-sm hover:bg-red text-red hover:text-white no-underline font-bold py-2 px-4 rounded border border-red"
         @click.prevent="removeLink(link)">Delete</button>
        </div>

        <div v-if="link == editedLink">
          <form action="" @submit.prevent="updateLink(link)">
            <div class="mb-6 p-4 bg-white rounded border border-grey-light mt-4">
              <input class="input" v-model="link.linkUrl" />
              <input type="submit" value="Update" class=" my-2 bg-transparent text-sm hover:bg-blue hover:text-white text-blue border border-blue no-underline font-bold py-2 px-4 rounded cursor-pointer">
            </div>
          </form>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Links',
  data () {
    return {
      links: [],
      newLink: [],
      error: '',
      editedLink: ''
    }
  },
  created () {
    this.$http.secured.get('/api/v1/links')
      .then(response => { this.links = response.data })
      .catch(error => this.setError(error, 'Something went wrong'))
  },
  methods: {
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    addLink () {
      const value = this.newLink
      if (!value) {
        return
      }
      this.$http.secured.post('/api/v1/links/', { link: { linkUrl: this.newLink.linkUrl, subject_id: this.newLink.subject_id } })

        .then(response => {
          this.links.push(response.data)
          this.newLink = ''
        })
        .catch(error => this.setError(error, 'Cannot create link'))
    },
    removeLink (link) {
      this.$http.secured.delete(`/api/v1/links/${link.id}`)
        .then(response => {
          this.links.splice(this.links.indexOf(link), 1)
        })
        .catch(error => this.setError(error, 'Cannot delete link'))
    },
    editLink (link) {
      this.editedLink = link
    },
    updateLink (link) {
      this.editedLink = ''
      this.$http.secured.patch(`/api/v1/links/${link.id}`, { link: { linkUrl: link.linkUrl } })
        .catch(error => this.setError(error, 'Cannot update link'))
    }
  }
}
</script>

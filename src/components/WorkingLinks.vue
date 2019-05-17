<!-- recordstore-frontend/src/components/links/Links.vue -->

<template>
  <div>
    <div v-if="error">{{ error }}</div>
    <h3>Add a new link</h3>
    <form @submit.prevent="addLink">
      <div>
        <input autofocus autocomplete="off"
          placeholder="Link URL"
          v-model="newLink.linkUrl" />
        <input autofocus autocomplete="off"
          placeholder="Subject ID"
          v-model="newLink.subject_id" />
        <input autofocus autocomplete="off"
          placeholder="Semester ID"
          v-model="newLink.semester_id" />
        <input autofocus autocomplete="off"
          placeholder="Field ID"
          v-model="newLink.field_id" />
      </div>
      <input type="submit" value="Add Link" />
    </form>
    <hr>
    <ul>
      <li v-for="link in links" :key="link.id" :link="link">
        <div>
          <p> {{ link.linkUrl }} </p>
          <button @click="editLink(link)">Edit</button>
          <button @click="removeLink(link)">Delete</button>
        </div>

        <div v-if="link == editedLink">
          <form action="" @submit.prevent="updateLink(link)">
            <div>
              <input v-model="link.linkUrl" />
              <input type="submit" value="Update" >
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
      this.$http.secured.post('/api/v1/links/', {
        link: {
          linkUrl: this.newLink.linkUrl,
          subject_id: this.newLink.subject_id,
          semester_id: this.newLink.semester_id,
          field_id: this.newLink.field_id
        }
      })

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

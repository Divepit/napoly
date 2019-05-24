<!-- recordstore-frontend/src/components/links/Links.vue -->

<template>
  <div>
    <div v-if="error">{{ error }}</div>
    Semester: {{semester}} - Subject: {{subject}}

    <h3>Add a new link</h3>
    <table  class="bordered">
      <tr  class="bordered">
        <th  class="bordered"> Week </th>
        <th   class="bordered" v-for="type in types"> {{type.typeName}} </th>
      </tr>
      <tr  class="bordered" v-for="(week,index) in weekCount">
        <td  class="bordered">{{index + 1}}</td>
        <td  class="bordered" v-for="type in types" @click="specLink(week,type,true)">{{ specLink(week,type,false) }}</td>
      </tr>
    </table>
    <button type="button" name="button" @click="addWeek()">Add Week</button>
    <button type="button" name="button" @click="removeWeek()">Remove Week</button>
      <tr v-for="link in links" :key="link.id" :link="link">
        <div v-if="link == editedLink">
          <form action="" @submit.prevent="updateLink(link)">
            <div>
              <input v-model="link.linkUrl" />
              <input type="submit" value="Update" >
            </div>
          </form>
        </div>
      </tr>
      <div v-if="adding">
        <form action="" @submit.prevent="addLink()">
          <div>
            <input v-model="newLink.linkUrl">
            <input type="submit" value="Update" >
          </div>
        </form>
      </div>
      <br>
      <hr>
      <br>
  </div>
</template>

<script>
export default {
  name: 'Links',
  props: ['subject', 'semester', 'weekCount'],
  data () {
    return {
      // subject: 2,
      field: 1,
      links: [],
      newLink: [],
      error: '',
      editedLink: '',
      types: [],
      adding: false
    }
  },
  created () {
    this.$http.secured.get('/api/v1/links?subject_id=' + this.subject + '&semester_id=' + this.semester)
      .then(response => { this.links = response.data })
      .catch(error => this.setError(error, 'Something went wrong with Links'))
    this.$http.secured.get('/api/v1/types')
      .then(response => { this.types = response.data })
      .catch(error => this.setError(error, 'Something went wrong with Types'))
  },
  computed: {

  },
  methods: {
    addWeek () {
      this.weekCount += 1
      this.$http.secured.patch('/api/v1/subjects/' + this.subject, {
        subject: {
          weekCount: this.weekCount
        }
      })
    },
    removeWeek () {
      this.weekCount -= 1
      this.$http.secured.patch('/api/v1/subjects/' + this.subject, {
        subject: {
          weekCount: this.weekCount
        }
      })
    },
    specLink (week, type, editor) {
      var answer = this.$data.links.find(function (link) {
        var speclink = link.linkWeek === week && link.type_id === type.id
        return speclink
      })
      if (editor) {
        if (!answer) {
          this.newLink.subject_id = this.subject
          this.newLink.semester_id = this.semester
          this.newLink.field_id = this.field
          this.newLink.linkWeek = week
          this.newLink.type_id = type.id
          this.adding = true
        }
        this.editedLink = answer
      }
      if (answer) {
        return answer.linkUrl
      } else {
        return ' '
      }
    },
    setError (error, text) {
      this.error = (error.response && error.response.data && error.response.data.error) || text
    },
    addLink () {
      const value = this.newLink
      if (!this.newLink.linkUrl) {
        console.log('No Link given')
        return
      }
      this.$http.secured.post('/api/v1/links/', {
        link: {
          linkUrl: this.newLink.linkUrl,
          subject_id: this.newLink.subject_id,
          semester_id: this.newLink.semester_id,
          field_id: this.newLink.field_id,
          linkWeek: this.newLink.linkWeek,
          type_id: this.newLink.type_id
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
      if (!link.linkUrl) {
        this.removeLink(link)
      }
      this.$http.secured.patch(`/api/v1/links/${link.id}`, {
        link: {
          linkUrl: link.linkUrl,
          subject_id: link.subject_id,
          semester_id: link.semester_id,
          field_id: link.field_id,
          linkWeek: link.linkWeek,
          type_id: link.type_id
        }
      })
        .catch(error => this.setError(error, 'Cannot update link'))
    }
  }
}
</script>
<style media="screen">
  .bordered {
    border: solid !important;
  }
</style>

<template>
  <v-simple-table class="ma-5">
    <thead>
    <tr>
      <th>Week</th>
      <th :key="type" v-for="type in typeIds">{{types[type]}}</th>
    </tr>
    </thead>
    <tbody>
    <tr :key="week" v-for="week in subjectWeeks.length">
      <td>{{week}}</td>
      <td :key="type" v-for="type in typeIds">
        <a :href="findLinkFromTypeAndWeek(type, week).linkUrl" target="_blank"
           v-if="typeWeekCombos.includes(`${type}/${week}`)">{{types[type-1]}} {{week}}</a>
        <span v-else> </span>
      </td>
    </tr>
    </tbody>
  </v-simple-table>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import { plainAxiosInstance } from '../../backend/axios'

export default {
  name: 'LinkTable',
  data () {
    return {
      subjectWeeks: [],
      typeIds: [],
      subjectLinks: [],
      typeWeekCombos: []
    }
  },
  created () {
    this.getSubjectLinks()
  },
  computed: {
    ...mapState('napolyApiModule', ['types', 'subjects'])
  },
  props: {
    subject: null
  },
  methods: {
    ...mapMutations(['stopLoading', 'startLoading']),
    getSubjectLinks () {
      plainAxiosInstance.get(`https://api.napoly.ch/api/v1/links?subject_id=${this.subject.id}`).then(response => {
        this.subjectLinks = response.data
        response.data.forEach(link => {
          if (!this.typeIds.includes(link.type_id)) {
            this.typeIds.push(link.type_id)
          }
          if (!this.subjectWeeks.includes(link.linkWeek)) {
            this.subjectWeeks.push(link.linkWeek)
          }
          this.typeWeekCombos.push(`${link.type_id}/${link.linkWeek}`)
        })
        this.stopLoading()
      })
    },
    findLinkFromTypeAndWeek (type, week) {
      return this.subjectLinks.find(link => (link.type_id === type && link.linkWeek === week))
    }
  }
}
</script>

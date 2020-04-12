<template>
  <div>
    <v-navigation-drawer dark app overflow color="primary">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title">
            Napoly.ch
          </v-list-item-title>
          <v-list-item-subtitle>
            Student Document Repository
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item-group v-if="signedIn" >
        <v-divider/>
        <v-list-item to="/admin">
          <v-list-item-icon class="mr-2">
            <v-icon>mdi-face</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{username}}</v-list-item-title>
        </v-list-item>
      </v-list-item-group>
      <v-divider/>
      <YearList/>
      <v-divider/>
      <FieldList/>
      <v-divider/>
      <SemesterList/>
      <v-divider/>
      <SubjectList/>
    </v-navigation-drawer>
<!--    <v-app-bar app>-->
<!--      <v-spacer/>-->
<!--      <v-toolbar-items>-->
<!--        <v-btn text flat class="text-none">Ilias</v-btn>-->
<!--        <v-btn text flat class="text-none">Moodle</v-btn>-->
<!--        <v-btn text flat class="text-none">myStudies</v-btn>-->
<!--        <v-btn text flat class="text-none">About</v-btn>-->
<!--      </v-toolbar-items>-->
<!--    </v-app-bar>-->
  </div>

</template>
<script>
import SemesterList from '../API/SemesterList'
import SubjectList from '../API/SubjectList'
import FieldList from '../API/FieldList'
import YearList from '../API/YearList'
import { mapState } from 'vuex'

export default {
  name: 'Toolbar',
  components: { YearList, FieldList, SubjectList, SemesterList },
  created () {
    if (localStorage.username) {
      this.username = localStorage.username
    }
  },
  data: () => ({
    primaryDrawer: {
      model: true,
      username: ''
    }
  }),
  computed: {
    ...mapState(['signedIn'])
  }
}
</script>

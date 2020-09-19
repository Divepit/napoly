<!-- Sidebar used in the main interface -->
<template>
  <div class="d-flex">
    <v-navigation-drawer v-model="showDrawer" dark app overflow color="primary">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title style="font-size: 1.5rem" class="font-weight-light">
              napoly
            </v-list-item-title>
            <v-list-item-subtitle class="font-weight-light">
              Student Document Repository
            </v-list-item-subtitle>
            <v-divider class="my-3"/>
            <v-list-item-action-text>
              Created by Marco Trentini
            </v-list-item-action-text>
          </v-list-item-content>
        </v-list-item>
        <v-list-item-group v-if="signedIn">
          <v-divider/>
          <v-list-item dense style="background: #2d98da" to="/admin">
            <!--            <v-list-item-icon class="mr-2">-->
            <!--              <v-icon>mdi-face</v-icon>-->
            <!--            </v-list-item-icon>-->
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
        <v-list-item-group style="position: absolute; bottom: 0; width: 100%" class="hidden-xs-only">
          <v-divider/>
          <v-list-item two-line to="/about">
            <v-list-item-icon><v-icon class="pt-5 pl-2">mdi-face</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>About</v-list-item-title>
              <v-list-item-subtitle>Who is behind Napoly</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-list-item-group class="hidden-sm-and-up">
          <v-list-item two-line to="/about">
            <v-list-item-icon><v-icon class="pt-5 pl-2">mdi-face</v-icon></v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>About</v-list-item-title>
              <v-list-item-subtitle>Who is behind Napoly</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
<!--      <v-footer color="primary" absolute>© Marco Trentini, 2020</v-footer>-->
    </v-navigation-drawer>
    <v-app-bar app flat dense color="white">
      <v-app-bar-nav-icon @click.stop="showDrawer = !showDrawer"></v-app-bar-nav-icon>
      <v-spacer/>
      <v-toolbar-title class="primary--text font-weight-light" v-if="!showDrawer">napoly.ch</v-toolbar-title>
    </v-app-bar>
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
  components: {
    YearList,
    FieldList,
    SubjectList,
    SemesterList
  },
  created () {
    if (localStorage.username) {
      this.username = localStorage.username
    }
  },
  data: () => ({
    showDrawer: true
  }),
  computed: {
    ...mapState(['signedIn'])
  }
}
</script>

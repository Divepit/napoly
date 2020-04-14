<!-- Sidebar used in the main interface -->
<template>
  <div>
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
          </v-list-item-content>
        </v-list-item>
        <v-list-item-group v-if="signedIn">
          <v-divider/>
          <v-list-item to="/admin" style="background: #2d98da">
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
      </v-list>
    </v-navigation-drawer>
    <v-app-bar app hide-on-scroll flat dense color="white">
      <v-app-bar-nav-icon @click.stop="showDrawer = !showDrawer"></v-app-bar-nav-icon>
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
  components: { YearList, FieldList, SubjectList, SemesterList },
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

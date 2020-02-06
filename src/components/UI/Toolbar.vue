<template>
  <div>
    <v-navigation-drawer app overflow v-model="primaryDrawer.model">
      <YearList/>
      <FieldList/>
      <SemesterList/>
      <SubjectList/>
    </v-navigation-drawer>
    <v-app-bar app>
      <v-app-bar-nav-icon @click.stop="primaryDrawer.model = !primaryDrawer.model"/>
      <v-toolbar-title>Napoly II</v-toolbar-title>
    </v-app-bar>
  </div>

</template>
<script>
import SemesterList from '../API/SemesterList'
import SubjectList from '../API/SubjectList'
import FieldList from '../API/FieldList'
import YearList from '../API/YearList'

export default {
  name: 'Toolbar',
  components: { YearList, FieldList, SubjectList, SemesterList },
  data: () => ({
    primaryDrawer: {
      model: true
    }
  })
}
</script>

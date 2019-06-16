import Vue from 'vue'
import Router from 'vue-router'
import Signin from '@/components/Signin'
// import Signup from '@/components/Signup'
import SubjectList from '@/components/SubjectList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/links',
      name: 'Links',
      component: SubjectList

    },
    {
      path: '/',
      name: 'SubjectList',
      component: SubjectList
    }
    // {
    //   path: '/signup',
    //   name: 'Signup',
    //   component: Signup
    // }
  ]
})

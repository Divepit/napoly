import Vue from 'vue'
import Router from 'vue-router'
import Signin from '@/components/Signin'
// import Signup from '@/components/Signup'
import SubjectList from '@/components/SubjectList'
import AdminInterface from '@/components/AdminInterface'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/signin',
      name: 'Signin',
      component: Signin
    },
    {
      path: '/',
      name: 'Links',
      component: SubjectList
    },
    {
      path: '/admin',
      name: 'AdminInterface',
      component: AdminInterface
    }
    // {
    //   path: '/signup',
    //   name: 'Signup',
    //   component: Signup
    // }
  ]
})

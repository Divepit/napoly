import Vue from 'vue'
import Router from 'vue-router'
import Signin from '@/components/Signin'
import Signup from '@/components/Signup'
import FilterComponent from '@/components/FilterComponent'

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
      component: FilterComponent
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    }
  ]
})

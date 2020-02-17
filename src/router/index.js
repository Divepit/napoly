import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import AdminInterface from '../views/AdminInterface'
import Signin from '../components/Admin/Signin'
import AccountManagement from '../views/AccountManagement'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/admin',
    name: 'Admin Interface',
    component: AdminInterface
  },
  {
    path: '/signin',
    name: 'Sign In',
    component: Signin
  },
  {
    path: '/account',
    name: 'Account',
    component: AccountManagement
  }
]

const router = new VueRouter({
  routes
})

export default router

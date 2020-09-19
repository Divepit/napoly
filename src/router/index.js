import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
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
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/*',
    name: 'redirect',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

export default router

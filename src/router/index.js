import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    { path: '/login', component: () => import('@/views/login') },
    {
      path: '/',
      redirect: '/dashboard',
      component: () => import('@/views/layout'),
      children: [
        { path: '/article', component: () => import('@/views/article') },
        { path: '/dashboard', component: () => import('@/views/dashboard') }
      ]
    }
  ]
})

export default router

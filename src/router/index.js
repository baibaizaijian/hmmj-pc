import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import { Message } from 'element-ui'
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
router.beforeEach((to, from, next) => {
  const { token } = store.state.user
  // 如果去页面不是登录且没有token,都打回到登录页
  if (to.path !== '/login' && !token) {
    next('/login')
    Message.error('请您先登录哦小笨蛋')
    return
  }
  next()
  // 提示用户
})

export default router

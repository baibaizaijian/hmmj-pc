/* 封装axios用于发送请求 */
import axios from 'axios'
import store from '@/store'
import router from '@/router'
import { Message } from 'element-ui'
// 创建一个新的axios实例
// 避免axios被污染
const request = axios.create({
  baseURL: 'http://interview-api-t.itheima.net/',
  // 超时时间
  timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const { token } = store.state.user
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data
}, function (error) {
  // 对响应错误做点什么
  if (error.response) {
    if (error.response.status === 401) {
      // 如果是 401 代表一定是 token 的问题
      // 只要是 token 有问题, 我们就将其清空并跳转到登录页
      // 1. 清空 token
      store.commit('user/logout')
      // 2. 跳转到登录页
      router.push('/login')
      // 3. 提示用户
      Message.error('请您重新登录哦')
    }
    // else {
    //   // 4. 提示普通的错误
    //   Message.error(error.response.data.message)
    // }
  }
  return Promise.reject(error)
})
export default request

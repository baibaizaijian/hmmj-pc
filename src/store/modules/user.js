import { login } from '@/api/user'
import { getToken, setToken, delToken } from '@/utils/storage'

export default {
  // 开启命名空间
  namespaced: true,
  state: {
    token: getToken() || ''
  },
  mutations: {
    updateToken (state, token) {
      // 存储到 vuex
      state.token = token
      // 存储到 localStorage
      setToken(token)
    },
    logout (state) {
      // 清空 token
      state.token = ''
      // 删除本地的 token
      delToken()
    }
  },
  actions: {
    async  loginAction (context, data) {
      const res = await login(data)
      console.log(res)
      context.commit('updateToken', res.data.token)
    }

  },
  getter: {}
}

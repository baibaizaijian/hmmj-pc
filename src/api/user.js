import request from '@/utils/request'

export const login = data => request.post('/auth/login', data)

// export const getUser = () => request.post('/auth/currentUser')
export const getUser = () => {
  return request.get('/auth/currentUser')
}

import request from '@/utils/request'

export const getArticles = params => request.get('/admin/interview/query', { params })
export const delArticles = id => request.delete('/admin/interview/remove', { data: { id } })

export const addArticles = data => request.post('/admin/interview/create', data)
// 获取单个面经详情
export const getArticleDetail = id => request.get('/admin/interview/show', { params: { id } })
// 修改文章
export const updateArticle = data => request.put('/admin/interview/update', data)

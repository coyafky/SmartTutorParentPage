import request from './request'

// 家长档案API
export const parentProfileAPI = {
  // 创建家长档案
  createProfile: (data) => request.post('/parent-profiles', data),
  
  // 获取家长档案
  getProfile: (parentId) => request.get(`/parent-profiles/${parentId}`),
  
  // 更新家长档案
  updateProfile: (parentId, data) => request.put(`/parent-profiles/${parentId}`, data),
  
  // 删除家长档案
  deleteProfile: (parentId) => request.delete(`/parent-profiles/${parentId}`),
  
  // 添加子女信息
  addChild: (parentId, data) => request.post(`/parent-profiles/${parentId}/children`, data),
  
  // 获取子女信息列表
  getChildren: (parentId) => request.get(`/parent-profiles/${parentId}/children`),
  
  // 获取单个子女信息
  getChild: (parentId, childId) => request.get(`/parent-profiles/${parentId}/children/${childId}`),
  
  // 更新子女信息
  updateChild: (parentId, childId, data) => request.put(`/parent-profiles/${parentId}/children/${childId}`, data),
  
  // 删除子女信息
  deleteChild: (parentId, childId) => request.delete(`/parent-profiles/${parentId}/children/${childId}`),
}

export default parentProfileAPI

import request from './request'

// 家长档案API
export const parentProfileAPI = {
  // 创建家长档案
  createProfile: (data) => request.post('/parentProfiles', data),

  // 获取家长档案
  getProfile: (parentId) => request.get(`/parentProfiles/${parentId}`),

  // 更新家长档案
  updateProfile: (parentId, data) => request.put(`/parentProfiles/${parentId}`, data),

  // 删除家长档案
  deleteProfile: (parentId) => request.delete(`/parentProfiles/${parentId}`),

  // 添加子女信息
  addChild: (parentId, data) => request.post(`/parentProfiles/${parentId}/children`, data),

  // 获取子女信息列表
  getChildren: (parentId) => request.get(`/parentProfiles/${parentId}/children`),

  // 获取单个子女信息
  getChild: (parentId, childId) => request.get(`/parentProfiles/${parentId}/children/${childId}`),

  // 更新子女信息
  updateChild: (parentId, childId, data) =>
    request.put(`/parentProfiles/${parentId}/children/${childId}`, data),

  // 删除子女信息
  deleteChild: (parentId, childId) =>
    request.delete(`/parent-profiles/${parentId}/children/${childId}`),

  // 获取同城市的教师列表
  getCityTutors: (parentId) => request.get(`/parentProfiles/${parentId}/tutors/city`),

  // 按科目筛选教师
  getSubjectTutors: (parentId, subject) =>
    request.get(`/parentProfiles/${parentId}/tutors/subject?subject=${subject}`),

  // 按地理位置筛选教师
  getLocationTutors: (parentId, params) =>
    request.get(`/parentProfiles/${parentId}/tutors/location`, { params }),

  // 按价格区间筛选教师
  getPriceTutors: (parentId, minPrice, maxPrice) =>
    request.get(
      `/parentProfiles/${parentId}/tutors/price?minPrice=${minPrice}&maxPrice=${maxPrice}`,
    ),

  // 按学历筛选教师
  getEducationTutors: (parentId, education) =>
    request.get(`/parentProfiles/${parentId}/tutors/education?education=${education}`),

  // 按开课时间筛选教师
  getSessionTutors: (parentId, day, timeSlot) =>
    request.get(`/parentProfiles/${parentId}/tutors/session?day=${day}&timeSlot=${timeSlot}`),

  // 多条件筛选教师
  filterTutors: (parentId, params) =>
    request.get(`/parentProfiles/${parentId}/tutors/filter`, { params }),
}

export default parentProfileAPI

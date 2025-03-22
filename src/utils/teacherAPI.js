import request from './request';

// 教师API服务
export const teacherAPI = {
  // 获取教师列表
  getTeachers: (params) => request.get('/teachers', { params }),
  
  // 获取教师详情
  getTeacherDetail: (teacherId) => request.get(`/teachers/${teacherId}`),
  
  // 筛选教师
  filterTeachers: (filters) => request.post('/teachers/filter', filters),
  
  // 获取推荐教师
  getRecommendedTeachers: (parentId) => request.get(`/teachers/recommended/${parentId}`),
  
  // 联系教师
  contactTeacher: (data) => request.post('/contact-request', data),
  
  // 收藏教师
  favoriteTeacher: (parentId, teacherId) => request.post('/favorites', { parentId, teacherId }),
  
  // 取消收藏
  unfavoriteTeacher: (parentId, teacherId) => request.delete(`/favorites/${parentId}/${teacherId}`),
  
  // 获取收藏的教师
  getFavoriteTeachers: (parentId) => request.get(`/favorites/${parentId}`)
};

import { defineStore } from 'pinia';
import { teacherAPI } from '../utils/teacherAPI';

export const useTeacherStore = defineStore('teacher', {
  state: () => ({
    teachers: [],
    recommendedTeachers: [],
    favoriteTeachers: [],
    currentTeacher: null,
    loading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    hasMore: true,
    filters: {
      keyword: '',
      subject: null,
      grade: null,
      teachingStyle: null,
      priceRange: [100, 300],
      rating: 4,
      sortBy: 'rating'
    }
  }),

  getters: {
    filteredTeachers: (state) => {
      return state.teachers;
    },
    
    hasTeachers: (state) => {
      return state.teachers.length > 0;
    }
  },

  actions: {
    // 初始化教师列表
    async initTeachers() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await teacherAPI.getTeachers({
          page: this.currentPage,
          pageSize: this.pageSize
        });
        
        this.teachers = response.data.teachers;
        this.totalCount = response.data.totalCount;
        this.hasMore = this.teachers.length < this.totalCount;
      } catch (error) {
        console.error('获取教师列表失败:', error);
        this.error = '获取教师列表失败，请稍后重试';
      } finally {
        this.loading = false;
      }
    },
    
    // 加载更多教师
    async loadMoreTeachers() {
      if (!this.hasMore || this.loading) return;
      
      this.loading = true;
      this.currentPage += 1;
      
      try {
        const response = await teacherAPI.getTeachers({
          page: this.currentPage,
          pageSize: this.pageSize
        });
        
        this.teachers = [...this.teachers, ...response.data.teachers];
        this.hasMore = this.teachers.length < this.totalCount;
      } catch (error) {
        console.error('加载更多教师失败:', error);
        this.error = '加载更多教师失败，请稍后重试';
        this.currentPage -= 1; // 恢复页码
      } finally {
        this.loading = false;
      }
    },
    
    // 筛选教师
    async filterTeachers(filters) {
      this.loading = true;
      this.error = null;
      this.currentPage = 1;
      
      // 更新筛选条件
      this.filters = { ...this.filters, ...filters };
      
      try {
        const response = await teacherAPI.filterTeachers({
          ...this.filters,
          page: this.currentPage,
          pageSize: this.pageSize
        });
        
        this.teachers = response.data.teachers;
        this.totalCount = response.data.totalCount;
        this.hasMore = this.teachers.length < this.totalCount;
      } catch (error) {
        console.error('筛选教师失败:', error);
        this.error = '筛选教师失败，请稍后重试';
      } finally {
        this.loading = false;
      }
    },
    
    // 搜索教师
    async searchTeachers(keyword) {
      this.filters.keyword = keyword;
      await this.filterTeachers({ keyword });
    },
    
    // 重置筛选条件
    resetFilters() {
      this.filters = {
        keyword: '',
        subject: null,
        grade: null,
        teachingStyle: null,
        priceRange: [100, 300],
        rating: 4,
        sortBy: 'rating'
      };
    },
    
    // 获取教师详情
    async getTeacherDetail(teacherId) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await teacherAPI.getTeacherDetail(teacherId);
        this.currentTeacher = response.data;
        return response.data;
      } catch (error) {
        console.error('获取教师详情失败:', error);
        this.error = '获取教师详情失败，请稍后重试';
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    // 获取推荐教师
    async getRecommendedTeachers(parentId) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await teacherAPI.getRecommendedTeachers(parentId);
        this.recommendedTeachers = response.data;
        return response.data;
      } catch (error) {
        console.error('获取推荐教师失败:', error);
        this.error = '获取推荐教师失败，请稍后重试';
        return [];
      } finally {
        this.loading = false;
      }
    },
    
    // 收藏教师
    async favoriteTeacher(parentId, teacherId) {
      try {
        await teacherAPI.favoriteTeacher(parentId, teacherId);
        
        // 更新当前教师的收藏状态
        if (this.currentTeacher && this.currentTeacher.id === teacherId) {
          this.currentTeacher.isFavorite = true;
        }
        
        // 更新教师列表中的收藏状态
        const index = this.teachers.findIndex(teacher => teacher.id === teacherId);
        if (index !== -1) {
          this.teachers[index].isFavorite = true;
        }
        
        return true;
      } catch (error) {
        console.error('收藏教师失败:', error);
        return false;
      }
    },
    
    // 取消收藏
    async unfavoriteTeacher(parentId, teacherId) {
      try {
        await teacherAPI.unfavoriteTeacher(parentId, teacherId);
        
        // 更新当前教师的收藏状态
        if (this.currentTeacher && this.currentTeacher.id === teacherId) {
          this.currentTeacher.isFavorite = false;
        }
        
        // 更新教师列表中的收藏状态
        const index = this.teachers.findIndex(teacher => teacher.id === teacherId);
        if (index !== -1) {
          this.teachers[index].isFavorite = false;
        }
        
        return true;
      } catch (error) {
        console.error('取消收藏失败:', error);
        return false;
      }
    },
    
    // 获取收藏的教师
    async getFavoriteTeachers(parentId) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await teacherAPI.getFavoriteTeachers(parentId);
        this.favoriteTeachers = response.data;
        return response.data;
      } catch (error) {
        console.error('获取收藏教师失败:', error);
        this.error = '获取收藏教师失败，请稍后重试';
        return [];
      } finally {
        this.loading = false;
      }
    }
  }
});

import { defineStore } from 'pinia'
import { parentProfileAPI } from '../utils/parentProfileAPI'
import { useUserStore } from './user'

export const useParentProfileStore = defineStore('parentProfile', {
  state: () => ({
    profile: null,
    children: [],
    loading: false,
    error: null,
  }),

  getters: {
    hasProfile: (state) => !!state.profile,
    childrenCount: (state) => state.children.length,
  },

  actions: {
    // 初始化家长档案
    async initProfile() {
      this.loading = true
      this.error = null
      try {
        const userStore = useUserStore()
        const parentId = userStore.userInfo.customId
        
        if (!parentId) {
          throw new Error('用户ID不存在')
        }
        
        const res = await parentProfileAPI.getProfile(parentId)
        if (res.status === 'success') {
          this.profile = res.data.profile
          await this.getChildren()
        }
      } catch (error) {
        // 如果是404错误，说明档案不存在，不需要显示错误
        if (error.status !== 404) {
          this.error = error.message || '获取家长档案失败'
        }
      } finally {
        this.loading = false
      }
    },

    // 创建家长档案
    async createProfile(profileData) {
      this.loading = true
      this.error = null
      try {
        const userStore = useUserStore()
        const parentId = userStore.userInfo.customId
        
        if (!parentId) {
          throw new Error('用户ID不存在')
        }
        
        // 确保parentId与用户ID一致
        const data = { ...profileData, parentId }
        
        const res = await parentProfileAPI.createProfile(data)
        if (res.status === 'success') {
          this.profile = res.data
          return res.data
        }
      } catch (error) {
        this.error = error.message || '创建家长档案失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    // 更新家长档案
    async updateProfile(profileData) {
      this.loading = true
      this.error = null
      try {
        const userStore = useUserStore()
        const parentId = userStore.userInfo.customId
        
        if (!parentId) {
          throw new Error('用户ID不存在')
        }
        
        const res = await parentProfileAPI.updateProfile(parentId, profileData)
        if (res.status === 'success') {
          this.profile = res.data.profile
          return res.data.profile
        }
      } catch (error) {
        this.error = error.message || '更新家长档案失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    // 删除家长档案
    async deleteProfile() {
      this.loading = true
      this.error = null
      try {
        const userStore = useUserStore()
        const parentId = userStore.userInfo.customId
        
        if (!parentId) {
          throw new Error('用户ID不存在')
        }
        
        await parentProfileAPI.deleteProfile(parentId)
        this.profile = null
        this.children = []
      } catch (error) {
        this.error = error.message || '删除家长档案失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    // 获取子女信息列表
    async getChildren() {
      this.loading = true
      this.error = null
      try {
        const userStore = useUserStore()
        const parentId = userStore.userInfo.customId
        
        if (!parentId) {
          throw new Error('用户ID不存在')
        }
        
        const res = await parentProfileAPI.getChildren(parentId)
        if (res.status === 'success') {
          this.children = res.data.children
          return res.data.children
        }
      } catch (error) {
        // 如果是404错误，说明没有子女信息，不需要显示错误
        if (error.status !== 404) {
          this.error = error.message || '获取子女信息失败'
        }
        this.children = []
      } finally {
        this.loading = false
      }
    },

    // 添加子女信息
    async addChild(childData) {
      this.loading = true
      this.error = null
      try {
        const userStore = useUserStore()
        const parentId = userStore.userInfo.customId
        
        if (!parentId) {
          throw new Error('用户ID不存在')
        }
        
        const res = await parentProfileAPI.addChild(parentId, childData)
        if (res.status === 'success') {
          await this.getChildren() // 重新获取子女列表
          return res.data.child
        }
      } catch (error) {
        this.error = error.message || '添加子女信息失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    // 更新子女信息
    async updateChild(childId, childData) {
      this.loading = true
      this.error = null
      try {
        const userStore = useUserStore()
        const parentId = userStore.userInfo.customId
        
        if (!parentId) {
          throw new Error('用户ID不存在')
        }
        
        const res = await parentProfileAPI.updateChild(parentId, childId, childData)
        if (res.status === 'success') {
          await this.getChildren() // 重新获取子女列表
          return res.data.child
        }
      } catch (error) {
        this.error = error.message || '更新子女信息失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    // 删除子女信息
    async deleteChild(childId) {
      this.loading = true
      this.error = null
      try {
        const userStore = useUserStore()
        const parentId = userStore.userInfo.customId
        
        if (!parentId) {
          throw new Error('用户ID不存在')
        }
        
        await parentProfileAPI.deleteChild(parentId, childId)
        await this.getChildren() // 重新获取子女列表
      } catch (error) {
        this.error = error.message || '删除子女信息失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    // 筛选教师的方法
    async filterTutors(params) {
      this.loading = true
      this.error = null
      try {
        const userStore = useUserStore()
        const parentId = userStore.userInfo.customId
        
        if (!parentId) {
          throw new Error('用户ID不存在')
        }
        
        const res = await parentProfileAPI.filterTutors(parentId, params)
        if (res.status === 'success') {
          return res.data.tutors
        }
        return []
      } catch (error) {
        this.error = error.message || '筛选教师失败'
        return []
      } finally {
        this.loading = false
      }
    },
  },
})

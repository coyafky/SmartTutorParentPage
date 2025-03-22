import { defineStore } from 'pinia'

export const usePreferencesStore = defineStore('preferences', {
  state: () => ({
    teacherGender: 'any',
    teachingStyle: '',
    budget: 100,
    subjects: []
  }),

  actions: {
    updatePreferences(preferences) {
      this.teacherGender = preferences.teacherGender
      this.teachingStyle = preferences.teachingStyle
      this.budget = preferences.budget
      this.subjects = preferences.subjects
    },

    // 将偏好设置转换为发帖表单数据
    getPostFormData() {
      return {
        teacherGender: this.teacherGender === 'any' ? '均可' : this.teacherGender === 'male' ? '男' : '女',
        salary: this.budget,
        subject: this.subjects[0] || '',  // 默认选择第一个科目
      }
    }
  }
})
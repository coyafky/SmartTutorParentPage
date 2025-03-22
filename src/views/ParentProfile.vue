<template>
  <div class="parent-profile-container bg-gray-50 dark:bg-gray-900 p-6">
    <!-- 顶部个人信息卡片 -->
    <ParentInfoCard
      :parentInfo="formData"
      :hasProfile="hasProfile"
      :statistics="parentProfileStore.statistics"
      :childrenCount="children.length"
      :loading="loading"
      @update-parent-info="updateParentInfo"
    />

    <!-- 主要内容区域 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      <!-- 左侧：教师偏好设置 -->
      <div class="lg:col-span-2">
        <TeacherPreference
          :preferences="formData.preferences"
          :loading="loading"
          @update-preferences="updatePreferences"
        />
      </div>

      <!-- 右侧：快捷操作 -->
      <div class="lg:col-span-1">
        <a-card class="profile-card mb-6" :bordered="false">
          <template #title>
            <div class="card-title flex items-center">
              <icon-dashboard class="mr-2 text-blue-500" />
              <span class="text-lg font-medium">快捷操作</span>
            </div>
          </template>
          <div class="flex flex-col gap-3">
            <a-button type="outline" class="rounded-lg" @click="$router.push('/teachers')">
              <template #icon><icon-search /></template>
              查找教师
            </a-button>
            <a-button type="outline" class="rounded-lg" @click="$router.push('/my-posts')">
              <template #icon><icon-calendar /></template>
              课程安排
            </a-button>
            <a-button type="outline" class="rounded-lg" @click="$router.push('/messages')">
              <template #icon><icon-message /></template>
              消息中心
            </a-button>

            <!-- 退出登录按钮 -->
            <LogoutButton @logout="handleLogout" />
          </div>
        </a-card>
      </div>
    </div>

    <!-- 子女信息管理 -->
    <ChildCard
      v-if="hasProfile"
      :children="children"
      :loading="loading"
      @add-child="addChild"
      @update-child="updateChild"
      @delete-child="deleteChild"
    />
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { useParentProfileStore } from '@/stores/parentProfile'
import ParentInfoCard from '@/components/ParentInfoCard.vue'
import ChildCard from '@/components/ChildCard.vue'
import TeacherPreference from '@/components/TeacherPreference.vue'
import LogoutButton from '@/components/LogoutButton.vue'

export default {
  name: 'ParentProfile',
  components: {
    ParentInfoCard,
    ChildCard,
    TeacherPreference,
    LogoutButton,
  },
  setup() {
    const router = useRouter()
    const parentProfileStore = useParentProfileStore()
    const loading = ref(false)

    // 父母信息表单数据
    const formData = reactive({
      nickname: '',
      location: {
        province: '',
        city: '',
        district: '',
        address: '',
      },
      contactInfo: {
        phone: '',
        email: '',
        wechat: '',
      },
      preferences: {
        teacherGender: '不限',
        budget: {
          min: 0,
          max: 0,
        },
        teachingStyle: [],
        teachingLocation: '不限',
      },
    })

    // 子女列表
    const children = ref([])

    // 是否已有档案
    const hasProfile = computed(() => {
      return !!parentProfileStore.profile?.profileId
    })

    // 初始化数据
    onMounted(async () => {
      loading.value = true
      try {
        await parentProfileStore.initProfile()

        // 如果有档案，加载数据
        if (parentProfileStore.profile) {
          Object.assign(formData, parentProfileStore.profile)
          children.value = parentProfileStore.children || []
        }
      } catch (error) {
        console.error('加载档案失败:', error)
        Message.error('加载档案失败，请稍后重试')
      } finally {
        loading.value = false
      }
    })

    // 更新父母信息
    const updateParentInfo = async (updatedInfo) => {
      loading.value = true
      try {
        // 合并更新的信息
        Object.assign(formData, updatedInfo)

        // 保存到服务器
        await parentProfileStore.updateProfile(formData)
        Message.success('个人信息更新成功')
      } catch (error) {
        console.error('更新个人信息失败:', error)
        Message.error('更新个人信息失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    // 更新教师偏好
    const updatePreferences = async (updatedPreferences) => {
      loading.value = true
      try {
        // 合并更新的偏好
        Object.assign(formData.preferences, updatedPreferences)

        // 保存到服务器
        await parentProfileStore.updateProfile(formData)
        Message.success('教师偏好更新成功')
      } catch (error) {
        console.error('更新教师偏好失败:', error)
        Message.error('更新教师偏好失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    // 添加子女
    const addChild = async (childData) => {
      loading.value = true
      try {
        const newChild = await parentProfileStore.addChild(childData)
        children.value.push(newChild)
        Message.success('添加子女信息成功')
      } catch (error) {
        console.error('添加子女信息失败:', error)
        Message.error('添加子女信息失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    // 更新子女信息
    const updateChild = async (childData) => {
      loading.value = true
      try {
        await parentProfileStore.updateChild(childData)

        // 更新本地子女列表
        const index = children.value.findIndex((child) => child.childId === childData.childId)
        if (index !== -1) {
          children.value[index] = { ...children.value[index], ...childData }
        }

        Message.success('更新子女信息成功')
      } catch (error) {
        console.error('更新子女信息失败:', error)
        Message.error('更新子女信息失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    // 删除子女
    const deleteChild = async (childId) => {
      loading.value = true
      try {
        await parentProfileStore.deleteChild(childId)

        // 从本地子女列表中移除
        children.value = children.value.filter((child) => child.childId !== childId)

        Message.success('删除子女信息成功')
      } catch (error) {
        console.error('删除子女信息失败:', error)
        Message.error('删除子女信息失败，请稍后重试')
      } finally {
        loading.value = false
      }
    }

    // 处理退出登录
    const handleLogout = async () => {
      try {
        await parentProfileStore.logout()
        router.push('/login')
        Message.success('退出登录成功')
      } catch (error) {
        console.error('退出登录失败:', error)
        Message.error('退出登录失败，请稍后重试')
      }
    }

    return {
      parentProfileStore,
      loading,
      formData,
      children,
      hasProfile,
      updateParentInfo,
      updatePreferences,
      addChild,
      updateChild,
      deleteChild,
      handleLogout,
    }
  },
}
</script>

<style scoped>
.parent-profile-container {
  min-height: calc(100vh - 64px);
}

.profile-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.profile-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
</style>

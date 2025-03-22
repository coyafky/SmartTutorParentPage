<template>
  <div class="max-w-4xl mx-auto p-5">
    <a-spin :loading="loading" tip="加载中...">
      <a-alert v-if="error" type="error" :content="error" closable />

      <!-- 步骤条 -->
      <a-steps :current="currentStep" class="mb-6">
        <a-step title="学生基本信息" />
        <a-step title="教师偏好" />
      </a-steps>

      <a-form :model="form" @submit="handleSubmit">
        <!-- 第一步：学生基本信息卡片 -->
        <a-card v-if="currentStep === 0" class="mb-6">
          <template #title>
            <div class="font-medium text-lg">第一步：学生基本信息</div>
          </template>
          <template #extra>
            <a-button type="primary" status="success" @click="importPersonalInfo">导入个人信息</a-button>
          </template>
          <student-info-form v-model="form.studentInfo" :children="children" @child-selected="handleChildSelected" />
        </a-card>

        <!-- 第二步：教师偏好卡片 -->
        <a-card v-if="currentStep === 1" class="mb-6">
          <template #title>
            <div class="font-medium text-lg">第二步：教师偏好</div>
          </template>
          <teacher-preference-form v-model="form.teacherPreference" />
        </a-card>

        <!-- 导航按钮 -->
        <div class="flex justify-center gap-3 mb-6">
          <a-space>
            <a-button v-if="currentStep > 0" @click="prevStep">
              <template #icon>
                <icon-left />
              </template>
              上一步
            </a-button>
            <a-button v-if="currentStep < 1" type="primary" @click="nextStep">
              下一步
              <template #icon>
                <icon-right />
              </template>
            </a-button>
            <a-button v-if="currentStep === 1" type="primary" status="success" html-type="submit">
              提交
              <template #icon>
                <icon-check />
              </template>
            </a-button>
          </a-space>
        </div>
      </a-form>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconLeft, IconRight, IconCheck, IconInfo } from '@arco-design/web-vue/es/icon'
import StudentInfoForm from '@/components/StudentInfoForm.vue'
import TeacherPreferenceForm from '@/components/TeacherPreferenceForm.vue'
import { useParentProfileStore } from '@/stores/parentProfile'

const parentProfileStore = useParentProfileStore()
const router = useRouter()

const loading = ref(false)
const error = ref('')
const currentStep = ref(0)
const children = ref([])

// 初始化表单数据，符合 API 文档格式
const form = ref({
  studentInfo: {
    childId: '',
    grade: '',
    subjects: [
      {
        name: '',
        currentScore: '',
        targetScore: '',
        difficulty: '中等'
      }
    ],
    location: {
      address: '',
      city: '',
      district: '',
      coordinates: {
        type: 'Point',
        coordinates: [116.4716, 39.9088] // 默认北京坐标
      }
    },
    description: ''
  },
  teacherPreference: {
    preferences: {
      teachingLocation: '家里',
      teacherGender: '均可',
      teachingStyle: [],
      budget: {
        min: 200,
        max: 350,
        period: 'per_hour'
      }
    },
    status: 'open',
    availableTime: []
  }
})

// 下一步
const nextStep = () => {
  if (currentStep.value < 1) {
    currentStep.value++
  }
}

// 上一步
const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 导入个人信息
const importPersonalInfo = async () => {
  try {
    loading.value = true
    // 获取个人资料
    await parentProfileStore.initProfile()
    const profile = parentProfileStore.profile
    
    if (profile && profile.location) {
      form.value.studentInfo.location.address = profile.location.address || ''
      form.value.studentInfo.location.city = profile.location.city || ''
      form.value.studentInfo.location.district = profile.location.district || ''
      
      if (profile.location.coordinates) {
        form.value.studentInfo.location.coordinates = profile.location.coordinates
      }
    }
    
    Message.success('个人信息导入成功')
  } catch (err) {
    console.error('导入个人信息失败:', err)
    Message.error('导入个人信息失败')
  } finally {
    loading.value = false
  }
}

// 处理选择孩子
const handleChildSelected = (child) => {
  if (child) {
    // 可以根据选择的孩子自动填充一些信息
    form.value.studentInfo.grade = child.grade || ''
  }
}

// 提交表单
const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    loading.value = true
    
    // 构建提交数据，符合 API 文档格式
    const postData = {
      grade: form.value.studentInfo.grade,
      childId: form.value.studentInfo.childId,
      subjects: form.value.studentInfo.subjects,
      location: form.value.studentInfo.location,
      preferences: form.value.teacherPreference.preferences,
      status: form.value.teacherPreference.status,
      availableTime: form.value.teacherPreference.availableTime,
      description: form.value.studentInfo.description
    }
    
    console.log('提交数据：', postData)
    
    // TODO: 调用 API 发布需求
    // const response = await postAPI.createPost(postData)
    
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 显示成功提示
    Message.success('家教需求发布成功！')
    
    // 跳转到我的帖子页面
    router.push('/my-posts')
  } catch (err) {
    error.value = err?.message || '发布失败'
    Message.error('发布失败：' + error.value)
  } finally {
    loading.value = false
  }
}

// 获取孩子列表
onMounted(async () => {
  try {
    loading.value = true
    await parentProfileStore.initProfile()
    children.value = parentProfileStore.children || []
  } catch (err) {
    console.error('获取孩子列表失败:', err)
    error.value = '获取孩子列表失败'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="home-container">
    <!-- 欢迎横幅 -->
    <a-card class="welcome-banner" :bordered="false">
      <div class="banner-content">
        <div class="banner-text">
          <h2>{{ greeting }}，{{ userInfo.nickname || '家长' }}！</h2>
          <p>智能家教推荐系统将为您匹配最适合的教师</p>
        </div>
        <div class="banner-image">
          <img src="../assets/teacher-student.svg" alt="教学场景" />
        </div>
      </div>
    </a-card>

    <!-- 快捷功能区 -->
    <a-row :gutter="16" style="margin-top: 16px">
      <a-col :span="24">
        <a-card title="快捷功能" :bordered="false">
          <a-row :gutter="[16, 16]">
            <a-col :xs="12" :sm="8" :md="6" :lg="4" v-for="(item, index) in quickActions" :key="index">
              <div class="quick-action-item" @click="handleQuickAction(item.action)">
                <component :is="item.icon" :style="{ fontSize: '28px', color: item.color }" />
                <div class="quick-action-text">{{ item.title }}</div>
              </div>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>

    <!-- 推荐教师区域 -->
    <a-row :gutter="16" style="margin-top: 16px">
      <a-col :span="24">
        <a-card title="推荐教师" :bordered="false" :loading="loading.recommendTeachers">
          <template #extra>
            <a-space>
              <a-button type="text" @click="refreshRecommendTeachers">
                <template #icon><icon-refresh /></template>
                刷新
              </a-button>
              <a-button type="text" @click="router.push('/teachers')">
                查看更多
              </a-button>
            </a-space>
          </template>

          <div v-if="recommendTeachers.length === 0 && !loading.recommendTeachers" class="empty-state">
            <a-empty description="暂无推荐教师">
              <template #image>
                <icon-user-group style="font-size: 48px; color: #C9CDD4" />
              </template>
              <a-button type="primary" @click="router.push('/profile')">
                完善个人资料以获取推荐
              </a-button>
            </a-empty>
          </div>

          <a-row :gutter="16" v-else>
            <a-col :xs="24" :sm="12" :md="8" v-for="teacher in recommendTeachers" :key="teacher.tutorId">
              <a-card class="teacher-card" :bodyStyle="{ padding: '12px' }">
                <div class="teacher-card-header">
                  <a-avatar :size="64" :style="{ backgroundColor: teacher.gender === '男' ? '#165DFF' : '#FF7D00' }">
                    {{ teacher.name.charAt(0) }}
                  </a-avatar>
                  <div class="teacher-info">
                    <h3>{{ teacher.name }}</h3>
                    <div class="teacher-rating">
                      <a-rate :model-value="teacher.rating" allow-half disabled :count="5" size="small" />
                      <span>{{ teacher.rating }}</span>
                    </div>
                    <p>{{ teacher.location.city }} {{ teacher.location.district }}</p>
                  </div>
                </div>

                <a-divider style="margin: 12px 0" />

                <div class="teacher-subjects">
                  <a-space wrap>
                    <a-tag v-for="subject in teacher.subjects" :key="subject">{{ subject }}</a-tag>
                  </a-space>
                </div>

                <div class="teacher-match" v-if="teacher.matchScore">
                  <div class="match-score">
                    <div class="score-circle" :style="{ '--percent': Math.round(teacher.matchScore * 100) + '%' }">
                      {{ Math.round(teacher.matchScore * 100) }}%
                    </div>
                    <span>匹配度</span>
                  </div>
                  <div class="match-reasons">
                    <p v-for="(reason, idx) in teacher.matchReasons.slice(0, 2)" :key="idx">{{ reason }}</p>
                  </div>
                </div>

                <div class="teacher-actions">
                  <a-button type="primary" @click="viewTeacherDetail(teacher.tutorId)">
                    查看详情
                  </a-button>
                  <a-button type="outline" @click="requestTutor(teacher.tutorId)">
                    预约
                  </a-button>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>

    <!-- 学习资源和最新动态 -->
    <a-row :gutter="16" style="margin-top: 16px">
      <a-col :xs="24" :md="12">
        <a-card title="学习资源" :bordered="false">
          <a-list :data="learningResources">
            <template #item="{ item }">
              <a-list-item>
                <a-space>
                  <component :is="item.icon" />
                  <a @click="openResource(item.link)">{{ item.title }}</a>
                </a-space>
                <template #extra>
                  <a-tag>{{ item.type }}</a-tag>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>

      <a-col :xs="24" :md="12">
        <a-card title="最新动态" :bordered="false">
          <a-list :data="newsUpdates">
            <template #item="{ item }">
              <a-list-item>
                <a-space>
                  <component :is="item.icon" />
                  <span>{{ item.title }}</span>
                </a-space>
                <template #extra>
                  <a-tag>{{ item.date }}</a-tag>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>

    <!-- 子女学习进度 -->
    <a-row :gutter="16" style="margin-top: 16px">
      <a-col :span="24">
        <a-card title="子女学习进度" :bordered="false" :loading="loading.children">
          <template #extra>
            <a-button type="text" @click="router.push('/profile')">
              管理子女信息
            </a-button>
          </template>

          <div v-if="children.length === 0 && !loading.children" class="empty-state">
            <a-empty description="暂无子女信息">
              <template #image>
                <icon-user-group style="font-size: 48px; color: #C9CDD4" />
              </template>
              <a-button type="primary" @click="router.push('/profile')">
                添加子女信息
              </a-button>
            </a-empty>
          </div>

          <a-tabs v-else>
            <a-tab-pane v-for="child in children" :key="child._id" :title="child.name">
              <a-row :gutter="16">
                <a-col :xs="24" :md="8" v-for="subject in child.subjects" :key="subject.name">
                  <a-card class="subject-progress-card">
                    <div class="subject-header">
                      <h4>{{ subject.name }}</h4>
                      <a-tag>{{ subject.level }}</a-tag>
                    </div>
                    <div class="subject-progress">
                      <div class="progress-label">
                        <span>当前水平</span>
                        <span>目标分数: {{ subject.targetScore }}</span>
                      </div>
                      <a-progress :percent="getRandomProgress()" :stroke-color="getSubjectColor(subject.name)" />
                    </div>
                    <div class="subject-actions">
                      <a-button type="text" size="small">查看详情</a-button>
                    </div>
                  </a-card>
                </a-col>
              </a-row>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { useUserStore } from '../stores/user'
import { parentProfileAPI } from '../utils/parentAPI'
import {
  IconUser, IconBook, IconCalendar, IconMessage, IconNotification,
  IconSettings, IconRefresh, IconUserGroup, IconFile, IconBulb,
  IconApps, IconCommon, IconSubscribed, IconThumbUp
} from '@arco-design/web-vue/es/icon'

const router = useRouter()
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo || {})

// 加载状态
const loading = reactive({
  recommendTeachers: false,
  children: false
})

// 根据时间生成问候语
const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return '凌晨好'
  if (hour < 9) return '早上好'
  if (hour < 12) return '上午好'
  if (hour < 14) return '中午好'
  if (hour < 18) return '下午好'
  if (hour < 22) return '晚上好'
  return '夜深了'
})

// 快捷功能
const quickActions = [
  { title: '个人资料', icon: IconUser, color: '#165DFF', action: 'profile' },
  { title: '查找教师', icon: IconBook, color: '#0FC6C2', action: 'findTeachers' },
  { title: '预约课程', icon: IconCalendar, color: '#FF7D00', action: 'schedule' },
  { title: '消息中心', icon: IconMessage, color: '#722ED1', action: 'messages' },
  { title: '学习报告', icon: IconFile, color: '#0FC6C2', action: 'reports' },
  { title: '系统设置', icon: IconSettings, color: '#86909C', action: 'settings' }
]

// 推荐教师列表
const recommendTeachers = ref([])

// 子女信息列表
const children = ref([])

// 学习资源
const learningResources = [
  { title: '小学数学思维训练方法', icon: IconBulb, type: '数学', link: '#' },
  { title: '如何提高孩子的英语口语能力', icon: IconCommon, type: '英语', link: '#' },
  { title: '中考物理重点知识点总结', icon: IconFile, type: '物理', link: '#' },
  { title: '高效学习方法与时间管理', icon: IconApps, type: '学习方法', link: '#' }
]

// 最新动态
const newsUpdates = [
  { title: '系统更新：新增AI学习助手功能', icon: IconNotification, date: '今天' },
  { title: '暑期特别课程已开放报名', icon: IconSubscribed, date: '昨天' },
  { title: '新增5位特级教师加入平台', icon: IconUserGroup, date: '3天前' },
  { title: '家长讲座：如何培养孩子的学习兴趣', icon: IconThumbUp, date: '1周前' }
]

// 处理快捷功能点击
const handleQuickAction = (action) => {
  switch (action) {
    case 'profile':
      router.push('/profile')
      break
    case 'findTeachers':
      router.push('/teachers')
      break
    case 'schedule':
      router.push('/schedule')
      break
    case 'messages':
      router.push('/messages')
      break
    case 'reports':
      router.push('/reports')
      break
    case 'settings':
      router.push('/settings')
      break
    default:
      break
  }
}

// 获取推荐教师
const fetchRecommendTeachers = async () => {
  try {
    loading.recommendTeachers = true
    
    // 构建推荐请求参数
    const recommendParams = {
      subjects: [],
      preferredTeachingStyle: []
    }
    
    // 如果有子女信息，添加到推荐参数中
    if (children.value.length > 0) {
      // 收集所有子女的科目
      const allSubjects = children.value.flatMap(child => 
        child.subjects.map(subject => subject.name)
      )
      // 去重
      recommendParams.subjects = [...new Set(allSubjects)]
    }
    
    // 如果有家长偏好，添加到推荐参数中
    if (userInfo.value && userInfo.value.preferences) {
      recommendParams.preferredTeachingStyle = userInfo.value.preferences.preferredTeachingStyle || []
    }
    
    // 调用推荐API
    const response = await fetch('http://localhost:3000/api/tutors/recommend', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(recommendParams)
    })
    
    const data = await response.json()
    
    if (data.status === 'success') {
      recommendTeachers.value = data.data.tutors
    } else {
      // 如果没有推荐结果，使用模拟数据
      recommendTeachers.value = getMockTeachers()
    }
  } catch (error) {
    console.error('获取推荐教师失败:', error)
    // 使用模拟数据
    recommendTeachers.value = getMockTeachers()
  } finally {
    loading.recommendTeachers = false
  }
}

// 刷新推荐教师
const refreshRecommendTeachers = () => {
  fetchRecommendTeachers()
}

// 获取子女信息
const fetchChildren = async () => {
  try {
    if (!userInfo.value || !userInfo.value.customId) return
    
    loading.children = true
    const response = await parentProfileAPI.getChildren(userInfo.value.customId)
    
    if (response.status === 'success') {
      children.value = response.data.children
    }
  } catch (error) {
    console.error('获取子女信息失败:', error)
    // 如果是404错误，说明档案不存在，不需要提示错误
    if (error.status !== 404) {
      Message.error('获取子女信息失败')
    }
  } finally {
    loading.children = false
  }
}

// 查看教师详情
const viewTeacherDetail = (tutorId) => {
  router.push(`/teachers/${tutorId}`)
}

// 预约教师
const requestTutor = (tutorId) => {
  router.push(`/request/${tutorId}`)
}

// 打开学习资源
const openResource = (link) => {
  window.open(link, '_blank')
}

// 获取随机进度（模拟数据）
const getRandomProgress = () => {
  return Math.floor(Math.random() * 60) + 40 // 40-100之间的随机数
}

// 根据科目获取颜色
const getSubjectColor = (subject) => {
  const colorMap = {
    '语文': '#FF7D00',
    '数学': '#165DFF',
    '英语': '#14C9C9',
    '物理': '#722ED1',
    '化学': '#0FC6C2',
    '生物': '#2D9D5A',
    '历史': '#D91AD9',
    '地理': '#F7BA1E',
    '政治': '#0E42D2'
  }
  return colorMap[subject] || '#165DFF'
}

// 模拟教师数据
const getMockTeachers = () => {
  return [
    {
      tutorId: 'TUTOR_20250316123456',
      name: '王老师',
      gender: '男',
      subjects: ['数学', '物理'],
      rating: 4.8,
      location: {
        city: '深圳市',
        district: '南山区'
      },
      matchScore: 0.92,
      matchReasons: [
        '教授数学科目',
        '价格在预算范围内',
        '时间可匹配',
        '教学风格符合'
      ]
    },
    {
      tutorId: 'TUTOR_20250316123457',
      name: '李老师',
      gender: '女',
      subjects: ['英语', '语文'],
      rating: 4.9,
      location: {
        city: '深圳市',
        district: '福田区'
      },
      matchScore: 0.87,
      matchReasons: [
        '教授英语科目',
        '教学风格符合',
        '有丰富的教学经验'
      ]
    },
    {
      tutorId: 'TUTOR_20250316123458',
      name: '张老师',
      gender: '男',
      subjects: ['化学', '生物'],
      rating: 4.6,
      location: {
        city: '深圳市',
        district: '龙岗区'
      },
      matchScore: 0.78,
      matchReasons: [
        '价格在预算范围内',
        '有优秀的教学成果'
      ]
    }
  ]
}

// 页面加载时获取数据
onMounted(async () => {
  if (userInfo.value && userInfo.value.customId) {
    await fetchChildren()
    await fetchRecommendTeachers()
  } else {
    // 使用模拟数据
    recommendTeachers.value = getMockTeachers()
  }
})
</script>

<style scoped>
.home-container {
  padding: 16px;
}

.welcome-banner {
  background: linear-gradient(135deg, #165DFF 0%, #0FC6C2 100%);
  color: white;
  border-radius: 8px;
  overflow: hidden;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.banner-text {
  flex: 1;
}

.banner-text h2 {
  font-size: 24px;
  margin-bottom: 8px;
  color: white;
}

.banner-text p {
  font-size: 16px;
  opacity: 0.9;
}

.banner-image {
  max-width: 200px;
}

.banner-image img {
  width: 100%;
  height: auto;
}

.quick-action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--color-fill-2);
  cursor: pointer;
  transition: all 0.3s;
}

.quick-action-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.quick-action-text {
  margin-top: 8px;
  font-size: 14px;
}

.teacher-card {
  margin-bottom: 16px;
  border-radius: 8px;
  transition: all 0.3s;
}

.teacher-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(-5px);
}

.teacher-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.teacher-info {
  margin-left: 12px;
}

.teacher-info h3 {
  margin: 0;
  font-size: 16px;
}

.teacher-rating {
  display: flex;
  align-items: center;
  margin: 4px 0;
}

.teacher-rating span {
  margin-left: 8px;
  color: #f7ba1e;
}

.teacher-subjects {
  margin-bottom: 12px;
}

.teacher-match {
  display: flex;
  margin-bottom: 12px;
  padding: 8px;
  background-color: var(--color-fill-2);
  border-radius: 4px;
}

.match-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 12px;
}

.score-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: conic-gradient(#165DFF var(--percent), #e5e6eb var(--percent));
  color: #165DFF;
  font-weight: bold;
  position: relative;
}

.score-circle::before {
  content: '';
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
}

.score-circle {
  position: relative;
  z-index: 1;
}

.match-reasons {
  flex: 1;
}

.match-reasons p {
  margin: 4px 0;
  font-size: 12px;
  color: var(--color-text-2);
}

.teacher-actions {
  display: flex;
  justify-content: space-between;
}

.empty-state {
  padding: 24px;
  text-align: center;
}

.subject-progress-card {
  margin-bottom: 16px;
}

.subject-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.subject-header h4 {
  margin: 0;
}

.subject-progress {
  margin-bottom: 12px;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 12px;
  color: var(--color-text-3);
}

.subject-actions {
  text-align: right;
}

@media (max-width: 768px) {
  .banner-image {
    display: none;
  }
}
</style>
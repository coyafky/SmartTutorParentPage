<template>
  <div class="tutor-detail-container">
    <a-spin :loading="loading">
      <a-card v-if="tutor" class="tutor-detail-card">
        <template #title>
          <div class="card-title">
            <icon-user class="icon" />
            <span>教师详情</span>
          </div>
        </template>
        <template #extra>
          <a-button type="primary" @click="contactTutor">联系教师</a-button>
        </template>

        <!-- 基本信息 -->
        <a-row :gutter="24">
          <a-col :span="6">
            <div class="tutor-avatar-container">
              <a-avatar
                :size="120"
                :image-url="tutor.avatar || '/default-avatar.png'"
              />
              <h2 class="tutor-name">{{ tutor.name }}</h2>
              <div class="tutor-rating">
                <a-rate
                  :model-value="tutor.rating"
                  allow-half
                  readonly
                />
                <span>{{ tutor.rating }} ({{ tutor.reviewCount || 0 }}条评价)</span>
              </div>
              <div class="tutor-price">
                <span class="price-label">每小时收费</span>
                <span class="price-value">¥{{ tutor.hourlyRate }}</span>
              </div>
            </div>
          </a-col>
          <a-col :span="18">
            <a-descriptions title="基本信息" :column="{ xs: 1, sm: 2, md: 3 }" bordered>
              <a-descriptions-item label="性别">{{ tutor.gender || '未设置' }}</a-descriptions-item>
              <a-descriptions-item label="年龄">{{ tutor.age || '未设置' }}</a-descriptions-item>
              <a-descriptions-item label="教学经验">{{ tutor.experience || 0 }}年</a-descriptions-item>
              <a-descriptions-item label="学历">
                {{ tutor.education || '未设置' }}
                <span v-if="tutor.graduatedFrom">({{ tutor.graduatedFrom }})</span>
              </a-descriptions-item>
              <a-descriptions-item label="专业">{{ tutor.major || '未设置' }}</a-descriptions-item>
              <a-descriptions-item label="位置">{{ formatLocation(tutor.location) }}</a-descriptions-item>
            </a-descriptions>

            <!-- 教授科目 -->
            <a-divider>教授科目</a-divider>
            <div class="subjects-container">
              <a-tag
                v-for="(subject, index) in tutor.subjects"
                :key="index"
                color="blue"
                size="large"
              >
                {{ subject }}
              </a-tag>
            </div>

            <!-- 可授课时间 -->
            <a-divider>可授课时间</a-divider>
            <div class="sessions-container">
              <a-tag
                v-for="(session, index) in tutor.availableSessions"
                :key="index"
                color="green"
                size="large"
              >
                {{ session }}
              </a-tag>
            </div>
          </a-col>
        </a-row>

        <!-- 教师简介 -->
        <a-divider>教师简介</a-divider>
        <div class="tutor-intro">
          <p>{{ tutor.introduction || '该教师暂未填写简介' }}</p>
        </div>

        <!-- 教学经历 -->
        <a-divider>教学经历</a-divider>
        <div v-if="tutor.teachingExperiences && tutor.teachingExperiences.length > 0">
          <a-timeline>
            <a-timeline-item
              v-for="(exp, index) in tutor.teachingExperiences"
              :key="index"
              :label="exp.period"
            >
              <div class="experience-item">
                <h4>{{ exp.institution }}</h4>
                <p>{{ exp.position }}</p>
                <p>{{ exp.description }}</p>
              </div>
            </a-timeline-item>
          </a-timeline>
        </div>
        <a-empty v-else description="暂无教学经历" />

        <!-- 教学风格 -->
        <a-divider>教学风格</a-divider>
        <div class="teaching-style">
          <a-tag
            v-for="(style, index) in tutor.teachingStyles"
            :key="index"
            color="purple"
            size="large"
          >
            {{ style }}
          </a-tag>
          <p v-if="tutor.teachingStyleDescription" class="style-description">
            {{ tutor.teachingStyleDescription }}
          </p>
          <a-empty v-else description="暂无教学风格描述" />
        </div>

        <!-- 教学成就 -->
        <a-divider>教学成就</a-divider>
        <div v-if="tutor.achievements && tutor.achievements.length > 0">
          <a-list>
            <a-list-item v-for="(achievement, index) in tutor.achievements" :key="index">
              <a-list-item-meta>
                <template #title>{{ achievement.title }}</template>
                <template #description>{{ achievement.description }}</template>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
        </div>
        <a-empty v-else description="暂无教学成就" />

        <!-- 学生评价 -->
        <a-divider>学生评价</a-divider>
        <div v-if="tutor.reviews && tutor.reviews.length > 0">
          <a-list>
            <a-list-item v-for="(review, index) in tutor.reviews" :key="index">
              <a-list-item-meta>
                <template #avatar>
                  <a-avatar>{{ review.studentName.charAt(0) }}</a-avatar>
                </template>
                <template #title>
                  <div class="review-title">
                    <span>{{ review.studentName }}</span>
                    <a-rate :model-value="review.rating" allow-half readonly :size="16" />
                  </div>
                </template>
                <template #description>
                  <div class="review-content">
                    <p>{{ review.content }}</p>
                    <span class="review-date">{{ formatDate(review.date) }}</span>
                  </div>
                </template>
              </a-list-item-meta>
            </a-list-item>
          </a-list>
          
          <!-- 分页 -->
          <div class="pagination">
            <a-pagination
              v-model:current="reviewPage"
              :total="tutor.reviewCount || 0"
              :page-size="5"
              show-total
              @change="handleReviewPageChange"
            />
          </div>
        </div>
        <a-empty v-else description="暂无学生评价" />
      </a-card>

      <a-result
        v-else-if="!loading && !tutor"
        status="404"
        title="未找到教师信息"
        subtitle="该教师不存在或已被删除"
      >
        <template #extra>
          <a-button type="primary" @click="$router.push('/teachers')">
            返回教师列表
          </a-button>
        </template>
      </a-result>
    </a-spin>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { parentProfileAPI } from '../utils/parentProfileAPI'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 状态
const loading = ref(false)
const tutor = ref(null)
const reviewPage = ref(1)

// 初始化数据
onMounted(async () => {
  if (!userStore.token) {
    router.push('/login')
    return
  }

  const tutorId = route.params.id
  if (!tutorId) {
    Message.error('教师ID不存在')
    router.push('/teachers')
    return
  }

  await loadTutorDetail(tutorId)
})

// 加载教师详情
const loadTutorDetail = async (tutorId) => {
  loading.value = true
  try {
    // 这里假设API中有获取教师详情的方法
    // 如果没有，需要在parentProfileAPI.js中添加
    const res = await parentProfileAPI.getTutorDetail(tutorId)
    if (res.status === 'success') {
      tutor.value = res.data.tutor
    } else {
      Message.error('获取教师详情失败')
    }
  } catch (error) {
    console.error('获取教师详情失败:', error)
    Message.error(`获取教师详情失败: ${error.message || '未知错误'}`)
  } finally {
    loading.value = false
  }
}

// 处理评价分页变化
const handleReviewPageChange = async (page) => {
  reviewPage.value = page
  // 这里假设API中有获取教师评价的方法
  // 如果没有，需要在parentProfileAPI.js中添加
  try {
    const tutorId = route.params.id
    const res = await parentProfileAPI.getTutorReviews(tutorId, page, 5)
    if (res.status === 'success') {
      tutor.value.reviews = res.data.reviews
    }
  } catch (error) {
    console.error('获取教师评价失败:', error)
  }
}

// 联系教师
const contactTutor = () => {
  const tutorId = route.params.id
  router.push(`/contact-tutor/${tutorId}`)
}

// 格式化位置信息
const formatLocation = (location) => {
  if (!location) return '未设置'
  
  const parts = []
  if (location.province) parts.push(location.province)
  if (location.city) parts.push(location.city)
  if (location.district) parts.push(location.district)
  if (location.address) parts.push(location.address)
  
  return parts.join(' ') || '未设置'
}

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.tutor-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.tutor-detail-card {
  margin-bottom: 20px;
}

.card-title {
  display: flex;
  align-items: center;
}

.card-title .icon {
  margin-right: 8px;
}

.tutor-avatar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  text-align: center;
}

.tutor-name {
  margin-top: 16px;
  font-size: 20px;
  font-weight: 500;
}

.tutor-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
}

.tutor-price {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.price-label {
  font-size: 14px;
  color: var(--color-text-3);
}

.price-value {
  font-size: 24px;
  font-weight: 500;
  color: #ff7d00;
}

.subjects-container,
.sessions-container,
.teaching-style {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.tutor-intro {
  margin-bottom: 16px;
  line-height: 1.6;
}

.experience-item {
  margin-bottom: 8px;
}

.experience-item h4 {
  margin: 0 0 4px 0;
}

.experience-item p {
  margin: 0 0 4px 0;
  color: var(--color-text-2);
}

.style-description {
  margin-top: 8px;
  line-height: 1.6;
}

.review-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.review-content {
  display: flex;
  flex-direction: column;
}

.review-date {
  font-size: 12px;
  color: var(--color-text-3);
  margin-top: 4px;
}

.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: center;
}
</style>

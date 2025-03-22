<template>
  <div class="contact-tutor-container">
    <!-- 页面头部 -->
    <div class="contact-header">
      <a-page-header 
        :title="'与 ' + (tutor.name || '教师') + ' 联系'" 
        :subtitle="'科目: ' + (tutor.subjects?.join(', ') || '暂无')"
        @back="goBack"
      />
    </div>

    <div class="contact-content">
      <!-- 左侧: 教师信息 -->
      <div class="tutor-info-section">
        <a-card :bordered="false" class="tutor-card">
          <div class="tutor-profile">
            <div class="tutor-avatar-large">
              <a-avatar :size="80" :src="tutor.avatar">{{ tutor.name?.charAt(0) || 'T' }}</a-avatar>
              <div class="online-status" v-if="tutor.online">
                <a-badge status="success" text="在线" />
              </div>
            </div>
            
            <div class="tutor-basic-info">
              <h2 class="tutor-name">{{ tutor.name || '加载中...' }}</h2>
              <div class="tutor-rating">
                <a-rate :model-value="tutor.rating || 0" allow-half readonly />
                <span class="rating-value">{{ tutor.rating || '暂无评分' }}</span>
              </div>
              
              <div class="tutor-tags">
                <a-tag v-for="(subject, index) in tutor.subjects" :key="index" color="blue">{{ subject }}</a-tag>
                <a-tag v-if="tutor.isGold" color="gold">金牌教师</a-tag>
                <a-tag v-if="tutor.isNew" color="green">新人教师</a-tag>
              </div>
              
              <div class="tutor-meta">
                <div class="meta-item">
                  <icon-calendar />
                  <span>{{ tutor.experience || 0 }}年教学经验</span>
                </div>
                <div class="meta-item">
                  <icon-location />
                  <span>{{ tutor.location || '未知地区' }}</span>
                </div>
                <div class="meta-item">
                  <icon-money />
                  <span>¥{{ tutor.price || 0 }}/小时</span>
                </div>
              </div>
            </div>
          </div>
          
          <a-divider />
          
          <div class="tutor-description">
            <h3>教师简介</h3>
            <p>{{ tutor.description || '暂无简介' }}</p>
          </div>
          
          <div class="tutor-achievements" v-if="tutor.achievements && tutor.achievements.length > 0">
            <h3>教学成就</h3>
            <a-list :data="tutor.achievements">
              <template #item="{ item }">
                <a-list-item>
                  <a-tag color="arcoblue">{{ item.year }}</a-tag>
                  {{ item.description }}
                </a-list-item>
              </template>
            </a-list>
          </div>
          
          <div class="tutor-teaching-style">
            <h3>教学风格</h3>
            <p>{{ tutor.teachingStyle || '暂无相关信息' }}</p>
          </div>
        </a-card>
      </div>
      
      <!-- 右侧: 联系选项 -->
      <div class="contact-options-section">
        <a-card :bordered="false" class="contact-card">
          <template #title>
            <div class="card-title">
              <icon-message />
              <span>联系方式</span>
            </div>
          </template>
          
          <div class="contact-methods">
            <a-radio-group v-model="contactMethod" type="button" size="large" style="width: 100%">
              <a-radio value="message">
                <template #radio>
                  <icon-message /> 发送消息
                </template>
              </a-radio>
              <a-radio value="call">
                <template #radio>
                  <icon-phone /> 电话联系
                </template>
              </a-radio>
              <a-radio value="video">
                <template #radio>
                  <icon-video-camera /> 视频通话
                </template>
              </a-radio>
            </a-radio-group>
          </div>
          
          <!-- 消息输入区域 -->
          <div class="message-section" v-if="contactMethod === 'message'">
            <div class="message-history">
              <div class="message-placeholder">
                <a-empty description="暂无消息记录" />
                <p class="message-tip">发送一条消息开始与教师交流</p>
              </div>
            </div>
            
            <div class="message-input">
              <a-textarea 
                v-model="messageContent" 
                placeholder="输入您想发送的消息..." 
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
              <div class="message-actions">
                <a-button type="text">
                  <template #icon>
                    <icon-attachment />
                  </template>
                  附件
                </a-button>
                <a-button type="primary" :disabled="!messageContent.trim()">
                  <template #icon>
                    <icon-send />
                  </template>
                  发送
                </a-button>
              </div>
            </div>
          </div>
          
          <!-- 电话联系区域 -->
          <div class="call-section" v-if="contactMethod === 'call'">
            <a-result
              status="info"
              title="电话联系"
              sub-title="请选择您方便的时间，我们将为您安排与教师的电话沟通"
            >
              <template #extra>
                <a-button type="primary" size="large">
                  <template #icon>
                    <icon-calendar />
                  </template>
                  预约通话时间
                </a-button>
              </template>
            </a-result>
          </div>
          
          <!-- 视频通话区域 -->
          <div class="video-section" v-if="contactMethod === 'video'">
            <a-result
              status="info"
              title="视频通话"
              sub-title="视频通话可以更直观地了解教师的教学风格"
            >
              <template #extra>
                <a-button type="primary" size="large">
                  <template #icon>
                    <icon-calendar />
                  </template>
                  预约视频时间
                </a-button>
              </template>
            </a-result>
          </div>
        </a-card>
        
        <!-- 预约课程卡片 -->
        <a-card :bordered="false" class="booking-card">
          <template #title>
            <div class="card-title">
              <icon-calendar />
              <span>预约课程</span>
            </div>
          </template>
          
          <div class="booking-content">
            <p class="booking-description">选择您希望上课的时间，安排一节试听课程</p>
            
            <div class="date-selection">
              <a-date-picker 
                v-model="selectedDate" 
                style="width: 100%" 
                :disabled-date="disabledDate"
                placeholder="选择日期"
              />
            </div>
            
            <div class="time-slots" v-if="selectedDate">
              <h4>可用时间段</h4>
              <div class="time-grid">
                <a-button 
                  v-for="slot in availableTimeSlots" 
                  :key="slot.id"
                  :type="selectedTimeSlot === slot.id ? 'primary' : 'outline'"
                  :disabled="!slot.available"
                  @click="selectedTimeSlot = slot.id"
                >
                  {{ slot.time }}
                </a-button>
              </div>
            </div>
            
            <a-button 
              type="primary" 
              long 
              size="large" 
              class="book-button"
              :disabled="!selectedTimeSlot"
            >
              预约课程
            </a-button>
          </div>
        </a-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  IconCalendar, 
  IconLocation, 
  IconMessage, 
  IconPhone, 
  IconVideoCamera, 
  IconAttachment, 
  IconSend,
  IconMoney
} from '@arco-design/web-vue/es/icon'

const router = useRouter()
const route = useRoute()

// 获取教师ID
const tutorId = ref(route.params.id || '')

// 教师信息
const tutor = ref({})

// 联系方式
const contactMethod = ref('message')
const messageContent = ref('')

// 预约相关
const selectedDate = ref(null)
const selectedTimeSlot = ref(null)
const availableTimeSlots = ref([
  { id: 1, time: '09:00-10:00', available: true },
  { id: 2, time: '10:00-11:00', available: true },
  { id: 3, time: '11:00-12:00', available: false },
  { id: 4, time: '14:00-15:00', available: true },
  { id: 5, time: '15:00-16:00', available: true },
  { id: 6, time: '16:00-17:00', available: true },
  { id: 7, time: '17:00-18:00', available: false },
  { id: 8, time: '19:00-20:00', available: true },
  { id: 9, time: '20:00-21:00', available: true },
])

// 禁用过去的日期
const disabledDate = (current) => {
  return current && current < Date.now() - 8.64e7 // 禁用今天之前的日期
}

// 返回上一页
const goBack = () => {
  router.back()
}

// 加载教师信息
const loadTutorInfo = async () => {
  try {
    // 实际项目中应该调用API获取数据
    // const response = await api.getTutorById(tutorId.value)
    // tutor.value = response.data
    
    // 模拟数据
    setTimeout(() => {
      tutor.value = {
        id: tutorId.value || '1',
        name: '张老师',
        avatar: '',
        rating: 4.8,
        subjects: ['数学', '物理'],
        isGold: true,
        isNew: false,
        experience: 5,
        location: '海淀区',
        price: 200,
        online: true,
        description: '北京大学数学系毕业，5年家教经验，擅长高中数学和物理教学。善于引导学生思考，注重培养学生的学习兴趣和解题能力。',
        teachingStyle: '注重基础知识的掌握，同时培养学生的思维能力和解题技巧。针对不同学生的特点，采用不同的教学方法，让学习更有效率。',
        achievements: [
          { year: '2022', description: '指导学生在全国数学竞赛中获得二等奖' },
          { year: '2021', description: '学生平均成绩提升30%' },
          { year: '2020', description: '辅导学生考入清华大学' }
        ]
      }
    }, 500)
  } catch (error) {
    console.error('加载教师信息失败', error)
  }
}

onMounted(() => {
  loadTutorInfo()
})
</script>

<style scoped>
.contact-tutor-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
  width: 100%;
  box-sizing: border-box;
}

.contact-header {
  margin-bottom: 20px;
}

.contact-content {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.tutor-info-section {
  flex: 1;
  min-width: 300px;
}

.contact-options-section {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.tutor-card, .contact-card, .booking-card {
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  background-color: #fff;
  transition: all 0.2s ease;
}

.tutor-profile {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.tutor-avatar-large {
  position: relative;
}

.online-status {
  margin-top: 8px;
  text-align: center;
}

.tutor-basic-info {
  flex: 1;
}

.tutor-name {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1d1d1f;
}

.tutor-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}

.rating-value {
  font-weight: 600;
  color: #1d1d1f;
  font-size: 14px;
}

.tutor-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.tutor-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6e6e73;
  font-size: 14px;
}

.tutor-description, .tutor-achievements, .tutor-teaching-style {
  margin-bottom: 20px;
}

.tutor-description h3, .tutor-achievements h3, .tutor-teaching-style h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1d1d1f;
}

.tutor-description p, .tutor-teaching-style p {
  color: #6e6e73;
  line-height: 1.6;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1d1d1f;
}

.contact-methods {
  margin-bottom: 20px;
}

.message-section, .call-section, .video-section {
  margin-top: 16px;
}

.message-history {
  height: 300px;
  border: 1px solid #e5e5ea;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  overflow-y: auto;
  background-color: #f9f9fb;
}

.message-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.message-tip {
  color: #6e6e73;
  margin-top: 8px;
}

.message-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
}

.booking-description {
  color: #6e6e73;
  margin-bottom: 16px;
}

.date-selection {
  margin-bottom: 20px;
}

.time-slots h4 {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #1d1d1f;
}

.time-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 8px;
  margin-bottom: 20px;
}

.book-button {
  margin-top: 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .contact-content {
    flex-direction: column;
  }
  
  .tutor-info-section, .contact-options-section {
    width: 100%;
  }
  
  .tutor-profile {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .tutor-meta {
    justify-content: center;
  }
  
  .tutor-tags {
    justify-content: center;
  }
}
</style>

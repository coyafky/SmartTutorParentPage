<template>
  <div class="tutor-filter-container">
    <a-row :gutter="16">
      <!-- 筛选条件 -->
      <a-col :span="6">
        <a-card class="filter-card">
          <template #title>
            <div class="card-title">
              <icon-filter class="icon" />
              <span>筛选条件</span>
            </div>
          </template>

          <a-form :model="filterForm" layout="vertical">
            <!-- 科目筛选 -->
            <a-form-item field="subject" label="科目">
              <a-select
                v-model="filterForm.subject"
                placeholder="请选择科目"
                allow-clear
              >
                <a-option value="数学">数学</a-option>
                <a-option value="语文">语文</a-option>
                <a-option value="英语">英语</a-option>
                <a-option value="物理">物理</a-option>
                <a-option value="化学">化学</a-option>
                <a-option value="生物">生物</a-option>
                <a-option value="历史">历史</a-option>
                <a-option value="地理">地理</a-option>
                <a-option value="政治">政治</a-option>
              </a-select>
            </a-form-item>

            <!-- 价格区间 -->
            <a-form-item label="价格区间（元/小时）">
              <a-row :gutter="8">
                <a-col :span="11">
                  <a-input-number
                    v-model="filterForm.minPrice"
                    placeholder="最低"
                    :min="0"
                    :style="{ width: '100%' }"
                  />
                </a-col>
                <a-col :span="2" style="text-align: center">-</a-col>
                <a-col :span="11">
                  <a-input-number
                    v-model="filterForm.maxPrice"
                    placeholder="最高"
                    :min="0"
                    :style="{ width: '100%' }"
                  />
                </a-col>
              </a-row>
            </a-form-item>

            <!-- 学历要求 -->
            <a-form-item field="education" label="学历要求">
              <a-select
                v-model="filterForm.education"
                placeholder="请选择学历"
                allow-clear
              >
                <a-option value="本科">本科</a-option>
                <a-option value="硕士">硕士</a-option>
                <a-option value="博士">博士</a-option>
              </a-select>
            </a-form-item>

            <!-- 评分要求 -->
            <a-form-item field="minRating" label="最低评分">
              <a-rate
                v-model="filterForm.minRating"
                allow-half
                :count="5"
              />
            </a-form-item>

            <!-- 地理位置 -->
            <a-collapse :default-active-key="['1']">
              <a-collapse-item key="1" header="地理位置">
                <a-form-item field="province" label="省份">
                  <a-input
                    v-model="filterForm.province"
                    placeholder="省份"
                    allow-clear
                  />
                </a-form-item>
                <a-form-item field="city" label="城市">
                  <a-input
                    v-model="filterForm.city"
                    placeholder="城市"
                    allow-clear
                  />
                </a-form-item>
                <a-form-item field="district" label="区域">
                  <a-input
                    v-model="filterForm.district"
                    placeholder="区域"
                    allow-clear
                  />
                </a-form-item>
                <a-form-item field="distance" label="距离范围（公里）">
                  <a-input-number
                    v-model="filterForm.distance"
                    placeholder="距离"
                    :min="0"
                    :style="{ width: '100%' }"
                  />
                </a-form-item>
              </a-collapse-item>
            </a-collapse>

            <!-- 开课时间 -->
            <a-collapse :default-active-key="['1']">
              <a-collapse-item key="1" header="开课时间">
                <a-form-item field="day" label="星期">
                  <a-select
                    v-model="filterForm.day"
                    placeholder="请选择星期"
                    allow-clear
                  >
                    <a-option value="周一">周一</a-option>
                    <a-option value="周二">周二</a-option>
                    <a-option value="周三">周三</a-option>
                    <a-option value="周四">周四</a-option>
                    <a-option value="周五">周五</a-option>
                    <a-option value="周六">周六</a-option>
                    <a-option value="周日">周日</a-option>
                  </a-select>
                </a-form-item>
                <a-form-item field="timeSlot" label="时间段">
                  <a-select
                    v-model="filterForm.timeSlot"
                    placeholder="请选择时间段"
                    allow-clear
                  >
                    <a-option value="上午">上午</a-option>
                    <a-option value="下午">下午</a-option>
                    <a-option value="晚上">晚上</a-option>
                    <a-option value="全天">全天</a-option>
                  </a-select>
                </a-form-item>
              </a-collapse-item>
            </a-collapse>

            <!-- 教学经验 -->
            <a-form-item field="minExperience" label="最低教学经验（年）">
              <a-input-number
                v-model="filterForm.minExperience"
                placeholder="最低教学经验"
                :min="0"
                :style="{ width: '100%' }"
              />
            </a-form-item>

            <!-- 筛选按钮 -->
            <a-space direction="vertical" :style="{ width: '100%' }">
              <a-button
                type="primary"
                :loading="loading"
                @click="applyFilter"
                long
              >
                应用筛选
              </a-button>
              <a-button @click="resetFilter" long>重置筛选条件</a-button>
            </a-space>
          </a-form>
        </a-card>
      </a-col>

      <!-- 教师列表 -->
      <a-col :span="18">
        <a-card class="tutors-card">
          <template #title>
            <div class="card-title">
              <icon-user class="icon" />
              <span>教师列表</span>
            </div>
          </template>

          <a-spin :loading="loading">
            <div v-if="tutors.length === 0" class="empty-tutors">
              <a-empty description="暂无符合条件的教师">
                <template #image>
                  <icon-user :size="64" />
                </template>
              </a-empty>
            </div>
            <div v-else class="tutors-list">
              <a-card
                v-for="tutor in tutors"
                :key="tutor.tutorId"
                class="tutor-card"
                hoverable
              >
                <a-row>
                  <a-col :span="6">
                    <div class="tutor-avatar">
                      <a-avatar
                        :size="80"
                        :image-url="tutor.avatar || '/default-avatar.png'"
                      />
                      <div class="tutor-name">{{ tutor.name }}</div>
                      <div class="tutor-rating">
                        <a-rate
                          :model-value="tutor.rating"
                          allow-half
                          readonly
                          :size="16"
                        />
                        <span>{{ tutor.rating }}</span>
                      </div>
                    </div>
                  </a-col>
                  <a-col :span="18">
                    <a-descriptions :column="{ xs: 1, sm: 2, md: 3 }" bordered>
                      <a-descriptions-item label="科目">
                        <a-space>
                          <a-tag
                            v-for="(subject, index) in tutor.subjects"
                            :key="index"
                            color="blue"
                          >
                            {{ subject }}
                          </a-tag>
                        </a-space>
                      </a-descriptions-item>
                      <a-descriptions-item label="学历">
                        {{ tutor.education }}
                        <span v-if="tutor.graduatedFrom">
                          ({{ tutor.graduatedFrom }})
                        </span>
                      </a-descriptions-item>
                      <a-descriptions-item label="每小时收费">
                        ¥{{ tutor.hourlyRate }}
                      </a-descriptions-item>
                      <a-descriptions-item v-if="tutor.experience" label="教学经验">
                        {{ tutor.experience }}年
                      </a-descriptions-item>
                      <a-descriptions-item v-if="tutor.location" label="位置">
                        {{ formatLocation(tutor.location) }}
                        <span v-if="tutor.distance">
                          (距离{{ tutor.distance }}公里)
                        </span>
                      </a-descriptions-item>
                      <a-descriptions-item v-if="tutor.availableSessions && tutor.availableSessions.length > 0" label="可授课时间">
                        <a-space>
                          <a-tag
                            v-for="(session, index) in tutor.availableSessions"
                            :key="index"
                            color="green"
                          >
                            {{ session }}
                          </a-tag>
                        </a-space>
                      </a-descriptions-item>
                    </a-descriptions>

                    <div class="tutor-actions">
                      <a-space>
                        <a-button type="primary" @click="contactTutor(tutor.tutorId)">
                          联系教师
                        </a-button>
                        <a-button @click="viewTutorDetail(tutor.tutorId)">
                          查看详情
                        </a-button>
                      </a-space>
                    </div>
                  </a-col>
                </a-row>
              </a-card>
            </div>

            <!-- 分页 -->
            <div class="pagination">
              <a-pagination
                v-model:current="currentPage"
                :total="totalTutors"
                show-total
                show-jumper
                :page-size="pageSize"
                @change="handlePageChange"
              />
            </div>
          </a-spin>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { useParentProfileStore } from '../stores/parentProfile'
import { useUserStore } from '../stores/user'

const router = useRouter()
const parentProfileStore = useParentProfileStore()
const userStore = useUserStore()

// 状态
const loading = ref(false)
const tutors = ref([])
const totalTutors = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)

// 筛选表单
const filterForm = reactive({
  subject: '',
  minPrice: null,
  maxPrice: null,
  education: '',
  minRating: 0,
  province: '',
  city: '',
  district: '',
  distance: null,
  day: '',
  timeSlot: '',
  minExperience: null,
})

// 初始化数据
onMounted(async () => {
  if (!userStore.token) {
    router.push('/login')
    return
  }

  try {
    // 尝试加载家长档案
    await parentProfileStore.initProfile()
    
    // 如果有家长档案，自动填充位置信息
    if (parentProfileStore.profile && parentProfileStore.profile.location) {
      filterForm.province = parentProfileStore.profile.location.province || ''
      filterForm.city = parentProfileStore.profile.location.city || ''
      filterForm.district = parentProfileStore.profile.location.district || ''
    }
    
    // 初始加载教师列表
    await loadTutors()
  } catch (error) {
    console.error('初始化失败:', error)
  }
})

// 加载教师列表
const loadTutors = async () => {
  loading.value = true
  try {
    // 构建筛选参数
    const params = {}
    
    if (filterForm.subject) params.subject = filterForm.subject
    if (filterForm.minPrice) params.minPrice = filterForm.minPrice
    if (filterForm.maxPrice) params.maxPrice = filterForm.maxPrice
    if (filterForm.education) params.education = filterForm.education
    if (filterForm.minRating) params.minRating = filterForm.minRating
    if (filterForm.province) params.province = filterForm.province
    if (filterForm.city) params.city = filterForm.city
    if (filterForm.district) params.district = filterForm.district
    if (filterForm.distance) params.distance = filterForm.distance
    if (filterForm.day) params.day = filterForm.day
    if (filterForm.timeSlot) params.timeSlot = filterForm.timeSlot
    if (filterForm.minExperience) params.minExperience = filterForm.minExperience
    
    // 添加分页参数
    params.page = currentPage.value
    params.pageSize = pageSize.value
    
    // 调用API获取教师列表
    const result = await parentProfileStore.filterTutors(params)
    tutors.value = result.tutors || []
    totalTutors.value = result.count || 0
  } catch (error) {
    Message.error(`获取教师列表失败: ${error.message || '未知错误'}`)
    tutors.value = []
    totalTutors.value = 0
  } finally {
    loading.value = false
  }
}

// 应用筛选
const applyFilter = async () => {
  currentPage.value = 1 // 重置为第一页
  await loadTutors()
}

// 重置筛选条件
const resetFilter = () => {
  Object.assign(filterForm, {
    subject: '',
    minPrice: null,
    maxPrice: null,
    education: '',
    minRating: 0,
    province: '',
    city: '',
    district: '',
    distance: null,
    day: '',
    timeSlot: '',
    minExperience: null,
  })
  
  // 如果有家长档案，自动填充位置信息
  if (parentProfileStore.profile && parentProfileStore.profile.location) {
    filterForm.province = parentProfileStore.profile.location.province || ''
    filterForm.city = parentProfileStore.profile.location.city || ''
    filterForm.district = parentProfileStore.profile.location.district || ''
  }
}

// 处理分页变化
const handlePageChange = (page) => {
  currentPage.value = page
  loadTutors()
}

// 格式化位置信息
const formatLocation = (location) => {
  if (!location) return ''
  
  const parts = []
  if (location.province) parts.push(location.province)
  if (location.city) parts.push(location.city)
  if (location.district) parts.push(location.district)
  
  return parts.join(' ')
}

// 联系教师
const contactTutor = (tutorId) => {
  router.push(`/contact-tutor/${tutorId}`)
}

// 查看教师详情
const viewTutorDetail = (tutorId) => {
  router.push(`/tutor-detail/${tutorId}`)
}
</script>

<style scoped>
.tutor-filter-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.filter-card,
.tutors-card {
  margin-bottom: 20px;
}

.card-title {
  display: flex;
  align-items: center;
}

.card-title .icon {
  margin-right: 8px;
}

.empty-tutors {
  padding: 40px 0;
  text-align: center;
}

.tutors-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tutor-card {
  margin-bottom: 16px;
}

.tutor-avatar {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.tutor-name {
  margin-top: 8px;
  font-size: 16px;
  font-weight: 500;
}

.tutor-rating {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}

.tutor-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>

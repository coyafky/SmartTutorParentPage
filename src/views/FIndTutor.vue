<template>
  <div class="find-tutor-container">
    <div class="search-section">
      <h1 class="page-title">寻找家教</h1>
      
      <!-- 搜索栏 -->
      <div class="search-bar">
        <a-input-search
          v-model="searchKeyword"
          placeholder="搜索家教名称或科目"
          search-button
          @search="handleSearch"
        />
      </div>
      
      <!-- 筛选区域 -->
      <div class="filter-section">
        <a-card class="filter-card" :bordered="false">
          <template #title>
            <div class="filter-header">
              <icon-filter /> 筛选条件
            </div>
          </template>
          
          <div class="filter-container">
            <!-- 基础筛选 -->
            <div class="filter-row">
              <div class="filter-col">
                <span class="filter-label">科目</span>
                <a-select
                  v-model="subjectFilter"
                  placeholder="选择科目"
                  style="width: 100%"
                  allow-clear
                  size="medium"
                >
                  <a-option value="math">数学</a-option>
                  <a-option value="english">英语</a-option>
                  <a-option value="physics">物理</a-option>
                  <a-option value="chemistry">化学</a-option>
                  <a-option value="biology">生物</a-option>
                  <a-option value="chinese">语文</a-option>
                  <a-option value="history">历史</a-option>
                  <a-option value="geography">地理</a-option>
                  <a-option value="politics">政治</a-option>
                </a-select>
              </div>
              
              <div class="filter-col">
                <span class="filter-label">年级</span>
                <a-select
                  v-model="gradeFilter"
                  placeholder="选择年级"
                  style="width: 100%"
                  allow-clear
                  size="medium"
                >
                  <!-- 小学 -->
                  <a-option value="primary1">小学 - 一年级</a-option>
                  <a-option value="primary2">小学 - 二年级</a-option>
                  <a-option value="primary3">小学 - 三年级</a-option>
                  <a-option value="primary4">小学 - 四年级</a-option>
                  <a-option value="primary5">小学 - 五年级</a-option>
                  <a-option value="primary6">小学 - 六年级</a-option>
                  <!-- 初中 -->
                  <a-option value="junior1">初中 - 初一</a-option>
                  <a-option value="junior2">初中 - 初二</a-option>
                  <a-option value="junior3">初中 - 初三</a-option>
                  <!-- 高中 -->
                  <a-option value="senior1">高中 - 高一</a-option>
                  <a-option value="senior2">高中 - 高二</a-option>
                  <a-option value="senior3">高中 - 高三</a-option>
                </a-select>
              </div>
              
              <div class="filter-col">
                <span class="filter-label">教学方式</span>
                <a-select
                  v-model="teachingStyleFilter"
                  placeholder="教学方式"
                  style="width: 100%"
                  allow-clear
                  size="medium"
                >
                  <a-option value="online">线上教学</a-option>
                  <a-option value="offline">线下教学</a-option>
                  <a-option value="both">两者皆可</a-option>
                </a-select>
              </div>
              
              <div class="filter-col">
                <span class="filter-label">排序方式</span>
                <a-select
                  v-model="sortBy"
                  placeholder="排序方式"
                  style="width: 100%"
                  size="medium"
                >
                  <a-option value="rating">评分最高</a-option>
                  <a-option value="price-asc">价格从低到高</a-option>
                  <a-option value="price-desc">价格从高到低</a-option>
                  <a-option value="experience">经验最丰富</a-option>
                  <a-option value="match">匹配度最高</a-option>
                </a-select>
              </div>
            </div>
            
            <!-- 高级筛选 -->
            <div class="filter-row advanced-filters">
              <!-- 价格范围 -->
              <div class="filter-col price-filter">
                <span class="filter-label">价格范围</span>
                <div class="price-slider-container">
                  <a-slider
                    v-model="priceRange"
                    range
                    :min="50"
                    :max="500"
                    :step="10"
                    show-ticks
                  />
                  <div class="price-display">
                    <a-tag color="red">¥{{ priceRange[0] }} - ¥{{ priceRange[1] }}/小时</a-tag>
                  </div>
                </div>
              </div>
              
              <!-- 评分 -->
              <div class="filter-col rating-filter">
                <span class="filter-label">最低评分</span>
                <div class="rating-container">
                  <a-rate v-model="ratingFilter" allow-half />
                  <span class="rating-text">{{ ratingFilter }}分以上</span>
                </div>
              </div>
            </div>
            
            <!-- 筛选按钮 -->
            <div class="filter-actions">
              <a-space>
                <a-button type="primary" @click="applyFilters" status="success">
                  <template #icon>
                    <icon-search />
                  </template>
                  应用筛选
                </a-button>
                <a-button @click="resetFilters">
                  <template #icon>
                    <icon-refresh />
                  </template>
                  重置筛选
                </a-button>
              </a-space>
            </div>
          </div>
        </a-card>
      </div>
    </div>

    <!-- 视图切换 -->
    <div class="view-toggle">
      <a-radio-group v-model="viewMode" type="button">
        <a-radio value="list">
          <template #radio>
            <icon-list />
            列表视图
          </template>
        </a-radio>
        <a-radio value="grid">
          <template #radio>
            <icon-apps />
            网格视图
          </template>
        </a-radio>
      </a-radio-group>
      <span class="result-count">共找到 {{ tutors.length }} 位家教</span>
    </div>

    <!-- 教师列表 -->
    <div class="tutor-list-container">
      <a-spin :loading="loading">
        <template v-if="tutors.length > 0">
          <!-- 列表视图 -->
          <div v-if="viewMode === 'list'" class="list-view">
            <div v-for="tutor in tutors" :key="tutor.id" class="tutor-card">
              <div class="tutor-card-content">
                <div class="tutor-card-left">
                  <div class="tutor-avatar-wrapper">
                    <a-avatar :size="56" :src="tutor.avatar">{{ tutor.name.charAt(0) }}</a-avatar>
                    <div class="tutor-online-indicator" v-if="tutor.online"></div>
                  </div>
                </div>
                
                <div class="tutor-card-main">
                  <div class="tutor-card-header">
                    <div class="tutor-name-rating">
                      <h3 class="tutor-name">{{ tutor.name }}</h3>
                      <div class="tutor-rating-compact">
                        <span class="rating-score">{{ tutor.rating }}</span>
                        <a-rate :model-value="tutor.rating" allow-half readonly :count="5" size="small" />
                      </div>
                    </div>
                    
                    <div class="tutor-price-display">
                      <span class="tutor-price">¥{{ tutor.price }}</span>
                    </div>
                  </div>
                  
                  <div class="tutor-badges-row">
                    <div class="tutor-subjects-compact">
                      <a-tag v-for="subject in tutor.subjects" :key="subject" color="#f5f5f7" bordered size="small">
                        <span class="subject-text">{{ subject }}</span>
                      </a-tag>
                    </div>
                    <div class="tutor-special-tags">
                      <span class="special-tag gold" v-if="tutor.isGold">金牌</span>
                      <span class="special-tag new" v-if="tutor.isNew">新人</span>
                    </div>
                  </div>
                  
                  <div class="tutor-brief-info">
                    <span class="tutor-experience-compact" v-if="tutor.experience">
                      {{ tutor.experience }}教学经验
                    </span>
                    <span class="info-divider" v-if="tutor.experience && tutor.location">·</span>
                    <span class="tutor-location-compact" v-if="tutor.location">
                      {{ tutor.location }}
                    </span>
                  </div>
                  
                  <p class="tutor-description-compact">{{ tutor.description.substring(0, 65) }}{{ tutor.description.length > 65 ? '...' : '' }}</p>
                </div>
                
                <div class="tutor-card-right">
                  <div class="match-indicator" v-if="tutor.matchScore">
                    <svg class="match-circle" width="40" height="40" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="18" fill="none" stroke="#f2f2f7" stroke-width="2"/>
                      <circle 
                        cx="20" 
                        cy="20" 
                        r="18" 
                        fill="none" 
                        :stroke="getMatchColor(tutor.matchScore)" 
                        stroke-width="2"
                        stroke-dasharray="113"
                        :stroke-dashoffset="113 - (113 * tutor.matchScore / 100)"
                        transform="rotate(-90 20 20)"
                      />
                      <text x="20" y="24" text-anchor="middle" font-size="10" font-weight="600" fill="#1d1d1f">{{ tutor.matchScore }}%</text>
                    </svg>
                  </div>
                  
                  <a-button 
                    type="primary" 
                    class="contact-button" 
                    @click="contactTutor(tutor.id)"
                  >联系</a-button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 网格视图 -->
          <div v-else class="grid-view">
            <a-row :gutter="[16, 16]">
              <a-col v-for="tutor in tutors" :key="tutor.id" :span="24" :xs="24" :sm="12" :md="8" :lg="8" :xl="6">
                <div class="tutor-grid-card">
                  <div class="tutor-grid-header">
                    <div class="tutor-grid-avatar">
                      <a-avatar :size="60" :src="tutor.avatar">{{ tutor.name.charAt(0) }}</a-avatar>
                      <div class="tutor-grid-status" v-if="tutor.online">
                        <a-badge status="success" text="在线" />
                      </div>
                    </div>
                    <div class="tutor-grid-title">
                      <h3>{{ tutor.name }}</h3>
                      <div class="tutor-grid-rating">
                        <a-rate :model-value="tutor.rating" allow-half readonly :count="5" size="small" />
                        <span class="rating-value-grid">{{ tutor.rating }}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="tutor-grid-badges">
                    <a-tag v-if="tutor.isGold" color="#faad14" bordered size="small">金牌教师</a-tag>
                    <a-tag v-if="tutor.isNew" color="#52c41a" bordered size="small">新人教师</a-tag>
                    <a-tag v-if="tutor.matchScore >= 90" color="#ff4d4f" bordered size="small">最佳匹配</a-tag>
                  </div>
                  
                  <div class="tutor-grid-meta">
                    <div class="tutor-grid-subjects">
                      <a-tag v-for="subject in tutor.subjects" :key="subject" color="blue" size="small">{{ subject }}</a-tag>
                    </div>
                    <div class="tutor-grid-experience" v-if="tutor.experience">
                      <icon-calendar /> {{ tutor.experience }}
                    </div>
                  </div>
                  
                  <div class="tutor-grid-description">{{ tutor.description.substring(0, 80) }}...</div>
                  
                  <div class="tutor-grid-features">
                    <a-tag v-for="(feature, index) in tutor.features.slice(0, 2)" :key="index" color="#722ed1" bordered size="small">{{ feature }}</a-tag>
                    <a-tag v-if="tutor.features.length > 2" color="#722ed1" bordered size="small">+{{ tutor.features.length - 2 }}</a-tag>
                  </div>
                  
                  <div class="tutor-grid-location" v-if="tutor.location">
                    <icon-location /> {{ tutor.location }}
                  </div>
                  
                  <div class="tutor-grid-footer">
                    <span class="tutor-grid-price">¥{{ tutor.price }}<span class="price-unit-grid">/小时</span></span>
                    <div class="tutor-grid-actions">
                      <a-button size="small" @click="viewTutorDetail(tutor.id)">
                        <template #icon><icon-eye /></template>
                      </a-button>
                      <a-button type="primary" size="small" @click="contactTutor(tutor.id)">
                        <template #icon><icon-message /></template>
                      </a-button>
                    </div>
                  </div>
                  
                  <div class="tutor-grid-match" v-if="tutor.matchScore">
                    <a-progress
                      type="circle"
                      :percent="tutor.matchScore"
                      :stroke-color="getMatchColor(tutor.matchScore)"
                      :size="36"
                    />
                  </div>
                </div>
              </a-col>
            </a-row>
          </div>
        </template>
        <a-empty v-else description="暂无符合条件的家教" />
      </a-spin>
      
      <div class="load-more" v-if="hasMore && !loading">
        <a-button @click="loadMore">加载更多</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTeacherStore } from '@/stores/teacher'
import { Message } from '@arco-design/web-vue'
import { IconSearch, IconRefresh, IconList, IconApps, IconFilter, IconEye, IconMessage, IconLocation, IconCalendar } from '@arco-design/web-vue/es/icon'

const router = useRouter()



// 使用 teacher store
const teacherStore = useTeacherStore()


// 视图模式
const viewMode = ref('grid')

// 搜索关键词
const searchKeyword = ref('')

// 筛选条件
const subjectFilter = ref(null)
const gradeFilter = ref(null)
const teachingStyleFilter = ref(null)
const sortBy = ref('rating')
const priceRange = ref([100, 300])
const ratingFilter = ref(4)

// 计算属性：教师列表
const tutors = computed(() => teacherStore.teachers)

// 计算属性：是否有更多数据
const hasMore = computed(() => teacherStore.hasMore)

// 计算属性：加载状态
const loading = computed(() => teacherStore.loading)

// 监听筛选条件变化
watch([subjectFilter, gradeFilter, teachingStyleFilter, sortBy, priceRange, ratingFilter], () => {
  // 自动应用筛选（可选，也可以通过按钮触发）
  // applyFilters()
}, { deep: true })

// 搜索处理函数
const handleSearch = async () => {
  try {
    await teacherStore.searchTeachers(searchKeyword.value)
  } catch (error) {
    Message.error('搜索失败，请稍后重试')
  }
}

// 应用筛选
const applyFilters = async () => {
  try {
    await teacherStore.filterTeachers({
      subject: subjectFilter.value,
      grade: gradeFilter.value,
      teachingStyle: teachingStyleFilter.value,
      priceRange: priceRange.value,
      rating: ratingFilter.value,
      sortBy: sortBy.value
    })
  } catch (error) {
    Message.error('筛选失败，请稍后重试')
  }
}

// 重置筛选
const resetFilters = () => {
  searchKeyword.value = ''
  subjectFilter.value = null
  gradeFilter.value = null
  teachingStyleFilter.value = null
  sortBy.value = 'rating'
  priceRange.value = [100, 300]
  ratingFilter.value = 4
  
  // 重置 store 中的筛选条件
  teacherStore.resetFilters()
  // 重新加载数据
  teacherStore.initTeachers()
}

// 加载更多
const loadMore = async () => {
  if (hasMore.value && !loading.value) {
    try {
      await teacherStore.loadMoreTeachers()
    } catch (error) {
      Message.error('加载更多失败，请稍后重试')
    }
  }
}

// 联系家教
const contactTutor = (tutorId) => {
  router.push(`/contact-tutor/${tutorId}`)
}

// 查看教师详情
const viewTutorDetail = (tutorId) => {
  router.push(`/tutor-detail/${tutorId}`)
}

// 获取匹配度颜色
const getMatchColor = (score) => {
  if (score >= 90) return 'green'
  if (score >= 80) return 'blue'
  if (score >= 70) return 'orange'
  return 'red'
}

// 收藏教师
const toggleFavorite = async (tutor) => {
  const parentId = localStorage.getItem('parentId')
  if (!parentId) {
    Message.warning('请先登录')
    return
  }
  
  try {
    if (tutor.isFavorite) {
      await teacherStore.unfavoriteTeacher(parentId, tutor.id)
      Message.success('已取消收藏')
    } else {
      await teacherStore.favoriteTeacher(parentId, tutor.id)
      Message.success('收藏成功')
    }
  } catch (error) {
    Message.error('操作失败，请稍后重试')
  }
}

onMounted(async () => {
  // 初始加载数据
  try {
    await teacherStore.initTeachers()
  } catch (error) {
    Message.error('加载教师数据失败，请稍后重试')
  }
})
</script>

<style scoped>
.find-tutor-container {
  padding: 20px;
  background-color: #f5f5f5;
  min-height: calc(100vh - 60px);
  width: 100%;
  box-sizing: border-box;
}

.page-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

.search-section {
  margin-bottom: 24px;
}

.search-bar {
  margin-bottom: 20px;
}

.filter-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  overflow: hidden;
}

.filter-header {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #1d2129;
}

.filter-header :deep(svg) {
  margin-right: 8px;
  font-size: 18px;
}

.filter-container {
  padding: 8px;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 16px;
}

.filter-col {
  flex: 1;
  min-width: 200px;
}

.filter-label {
  display: block;
  font-size: 14px;
  color: #4e5969;
  margin-bottom: 8px;
  font-weight: 500;
}

.advanced-filters {
  background-color: #f7f8fa;
  padding: 16px;
  border-radius: 4px;
  margin-bottom: 16px;
}

.price-filter, .rating-filter {
  flex: 1;
  min-width: 300px;
}

.price-slider-container {
  padding: 0 10px;
}

.price-display {
  margin-top: 12px;
  display: flex;
  justify-content: center;
}

.rating-container {
  display: flex;
  align-items: center;
}

.rating-text {
  margin-left: 12px;
  color: #4e5969;
  font-weight: 500;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e5e6eb;
}

.view-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.result-count {
  color: #666;
}

.tutor-list-container {
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
}

/* 列表视图 - Apple风格 */
.list-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

.tutor-card {
  margin-bottom: 12px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  border: 1px solid #e5e5ea;
  overflow: hidden;
  transition: all 0.2s ease;
  width: 100%;
}

.tutor-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
}

.tutor-card-content {
  display: flex;
  padding: 16px;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
}

.tutor-card-left {
  margin-right: 16px;
}

.tutor-avatar-wrapper {
  position: relative;
}

.tutor-online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #34c759;
  border: 2px solid #fff;
}

.tutor-card-main {
  flex: 1;
  min-width: 0;
  padding-right: 16px;
  overflow: hidden;
}

.tutor-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.tutor-name-rating {
  flex: 1;
}

.tutor-name {
  margin: 0 0 4px 0;
  font-size: 17px;
  font-weight: 600;
  color: #1d1d1f;
  line-height: 1.2;
}

.tutor-rating-compact {
  display: flex;
  align-items: center;
  gap: 4px;
}

.rating-score {
  font-weight: 600;
  color: #1d1d1f;
  font-size: 13px;
}

.tutor-price-display {
  text-align: right;
}

.tutor-price {
  font-size: 17px;
  font-weight: 600;
  color: #1d1d1f;
}

.tutor-badges-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.tutor-subjects-compact {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tutor-subjects-compact :deep(.arco-tag) {
  background-color: #f5f5f7;
  border-color: #f5f5f7;
  border-radius: 4px;
}

.subject-text {
  color: #1d1d1f;
  font-size: 12px;
  font-weight: 500;
}

.tutor-special-tags {
  display: flex;
  gap: 6px;
}

.special-tag {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.special-tag.gold {
  background-color: #fef7e6;
  color: #d48806;
}

.special-tag.new {
  background-color: #f0f9eb;
  color: #52c41a;
}

.tutor-brief-info {
  display: flex;
  color: #6e6e73;
  font-size: 13px;
  margin-bottom: 8px;
}

.info-divider {
  margin: 0 6px;
}

.tutor-description-compact {
  color: #6e6e73;
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -moz-box-orient: vertical;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.tutor-card-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  min-width: 100px;
  flex-shrink: 0;
}

.match-indicator {
  display: flex;
  justify-content: center;
}

.match-circle {
  overflow: visible;
}

.contact-button {
  min-width: 70px;
  border-radius: 18px;
  font-size: 13px;
  font-weight: 500;
  height: 36px;
  padding: 0 16px;
  background-color: #0071e3;
  border-color: #0071e3;
}

.contact-button:hover {
  background-color: #0077ed;
  border-color: #0077ed;
}

/* 网格视图样式 - Apple风格 */
.grid-view {
  margin-top: 20px;
  width: 100%;
}

.tutor-grid-card {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  padding: 16px;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.2s ease;
  position: relative;
  border: 1px solid #e5e5ea;
  overflow: hidden;
}

.tutor-grid-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.06);
}

.tutor-grid-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  position: relative;
}

.tutor-grid-avatar {
  position: relative;
  margin-right: 10px;
}

.tutor-grid-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #34c759;
  border: 1.5px solid #fff;
}

.tutor-grid-title {
  flex: 1;
}

.tutor-grid-title h3 {
  margin: 0 0 4px 0;
  font-size: 15px;
  font-weight: 600;
  color: #1d1d1f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tutor-grid-rating {
  display: flex;
  align-items: center;
  gap: 3px;
}

.rating-value-grid {
  font-weight: 600;
  color: #1d1d1f;
  font-size: 12px;
}

.tutor-grid-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 8px;
}

.tutor-grid-badges :deep(.arco-tag) {
  background-color: transparent;
  border-color: transparent;
  padding: 0 4px;
}

.tutor-grid-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.tutor-grid-subjects {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 6px;
}

.tutor-grid-subjects :deep(.arco-tag) {
  background-color: #f5f5f7;
  border-color: #f5f5f7;
  border-radius: 4px;
}

.tutor-grid-experience {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #6e6e73;
}

.tutor-grid-experience :deep(svg) {
  margin-right: 3px;
  color: #6e6e73;
  font-size: 12px;
}

.tutor-grid-description {
  margin-bottom: 10px;
  color: #6e6e73;
  font-size: 12px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -moz-box-orient: vertical;
  -webkit-box-orient: vertical;
  box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tutor-grid-features {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 6px;
}

.tutor-grid-features :deep(.arco-tag) {
  background-color: #f2f2f7;
  border-color: #f2f2f7;
  border-radius: 4px;
  font-size: 11px;
}

.tutor-grid-location {
  display: flex;
  align-items: center;
  font-size: 11px;
  color: #6e6e73;
  margin-bottom: 10px;
}

.tutor-grid-location :deep(svg) {
  margin-right: 3px;
  color: #6e6e73;
  font-size: 12px;
}

.tutor-grid-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid #f2f2f7;
}

.tutor-grid-price {
  font-size: 15px;
  font-weight: 600;
  color: #1d1d1f;
}

.price-unit-grid {
  font-size: 11px;
  font-weight: normal;
  color: #6e6e73;
}

.tutor-grid-actions {
  display: flex;
  gap: 6px;
}

.tutor-grid-actions :deep(.arco-btn) {
  border-radius: 14px;
  height: 28px;
  padding: 0 10px;
  font-size: 12px;
}

.tutor-grid-actions :deep(.arco-btn-primary) {
  background-color: #0071e3;
  border-color: #0071e3;
}

.tutor-grid-actions :deep(.arco-btn-primary:hover) {
  background-color: #0077ed;
  border-color: #0077ed;
}

.tutor-grid-match {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
}

.load-more {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 40px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .tutor-card {
    flex-direction: column;
  }
  
  .tutor-avatar {
    margin-right: 0;
    margin-bottom: 16px;
  }
  
  .tutor-header {
    flex-direction: column;
  }
  
  .tutor-rating {
    margin-top: 8px;
  }
  
  .tutor-match {
    position: absolute;
    top: 20px;
    right: 20px;
  }
  
  .tutor-footer {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .tutor-price {
    margin-bottom: 12px;
  }
  
  .tutor-actions {
    width: 100%;
  }
  
  .tutor-actions button {
    flex: 1;
  }
}
</style>

<template>
  <div class="find-tutor-container">
    <div class="search-section">
      <h1 class="page-title">寻找家教</h1>
      <div class="search-bar">
        <a-input-search
          v-model="searchKeyword"
          placeholder="搜索家教名称或科目"
          search-button
          @search="handleSearch"
        />
      </div>
      <div class="filter-section">
        <a-space>
          <a-select
            v-model="subjectFilter"
            placeholder="选择科目"
            style="width: 120px"
            allow-clear
          >
            <a-option value="math">数学</a-option>
            <a-option value="english">英语</a-option>
            <a-option value="physics">物理</a-option>
            <a-option value="chemistry">化学</a-option>
            <a-option value="biology">生物</a-option>
          </a-select>
          <a-select
            v-model="gradeFilter"
            placeholder="选择年级"
            style="width: 120px"
            allow-clear
          >
            <a-option value="primary">小学</a-option>
            <a-option value="junior">初中</a-option>
            <a-option value="senior">高中</a-option>
          </a-select>
          <a-select
            v-model="sortBy"
            placeholder="排序方式"
            style="width: 120px"
          >
            <a-option value="rating">评分最高</a-option>
            <a-option value="price-asc">价格从低到高</a-option>
            <a-option value="price-desc">价格从高到低</a-option>
          </a-select>
        </a-space>
      </div>
    </div>

    <div class="tutor-list">
      <a-spin :loading="loading">
        <div v-if="tutors.length > 0">
          <div v-for="tutor in tutors" :key="tutor.id" class="tutor-card">
            <div class="tutor-avatar">
              <a-avatar :size="64" :src="tutor.avatar">{{ tutor.name.charAt(0) }}</a-avatar>
            </div>
            <div class="tutor-info">
              <div class="tutor-header">
                <h3 class="tutor-name">{{ tutor.name }}</h3>
                <div class="tutor-rating">
                  <a-rate :model-value="tutor.rating" allow-half readonly :count="5" size="small" />
                  <span>{{ tutor.rating }}</span>
                </div>
              </div>
              <div class="tutor-subjects">
                <a-tag v-for="subject in tutor.subjects" :key="subject" color="blue">{{ subject }}</a-tag>
              </div>
              <div class="tutor-description">{{ tutor.description }}</div>
              <div class="tutor-footer">
                <span class="tutor-price">¥{{ tutor.price }}/小时</span>
                <a-button type="primary" size="small" @click="contactTutor(tutor.id)">联系家教</a-button>
              </div>
            </div>
          </div>
        </div>
        <a-empty v-else description="暂无符合条件的家教" />
      </a-spin>
      
      <div class="load-more" v-if="hasMore && !loading">
        <a-button @click="loadMore">加载更多</a-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'

// 搜索和筛选条件
const searchKeyword = ref('')
const subjectFilter = ref('')
const gradeFilter = ref('')
const sortBy = ref('rating')
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

// 模拟家教数据
const tutors = ref([
  {
    id: 1,
    name: '张老师',
    avatar: '',
    rating: 4.8,
    subjects: ['数学', '物理'],
    description: '北京大学数学系毕业，5年家教经验，擅长高中数学和物理教学。',
    price: 200
  },
  {
    id: 2,
    name: '李老师',
    avatar: '',
    rating: 4.6,
    subjects: ['英语', '语文'],
    description: '英语专业八级，有丰富的教学经验，善于激发学生学习兴趣。',
    price: 180
  },
  {
    id: 3,
    name: '王老师',
    avatar: '',
    rating: 4.9,
    subjects: ['化学', '生物'],
    description: '清华大学化学系博士，教学方法灵活多样，深受学生喜爱。',
    price: 220
  }
])

// 搜索处理函数
const handleSearch = () => {
  loading.value = true
  // 这里应该调用API进行搜索
  setTimeout(() => {
    loading.value = false
    // 模拟搜索结果
  }, 1000)
}

// 加载更多
const loadMore = () => {
  if (loading.value) return
  loading.value = true
  page.value++
  
  // 模拟加载更多数据
  setTimeout(() => {
    // 假设没有更多数据了
    if (page.value > 2) {
      hasMore.value = false
    }
    loading.value = false
  }, 1000)
}

// 联系家教
const contactTutor = (tutorId) => {
  console.log('联系家教:', tutorId)
  // 这里应该实现联系家教的逻辑
}

onMounted(() => {
  // 初始加载数据
  // 实际项目中应该调用API获取数据
})
</script>

<style scoped>
.find-tutor-container {
  padding: 16px;
}

.page-title {
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
}

.search-section {
  margin-bottom: 20px;
}

.search-bar {
  margin-bottom: 16px;
}

.filter-section {
  margin-bottom: 20px;
}

.tutor-list {
  margin-top: 20px;
}

.tutor-card {
  display: flex;
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.tutor-avatar {
  margin-right: 16px;
  display: flex;
  align-items: center;
}

.tutor-info {
  flex: 1;
}

.tutor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.tutor-name {
  font-size: 18px;
  margin: 0;
}

.tutor-rating {
  display: flex;
  align-items: center;
}

.tutor-rating span {
  margin-left: 8px;
  color: #faad14;
}

.tutor-subjects {
  margin-bottom: 8px;
}

.tutor-description {
  color: #666;
  margin-bottom: 12px;
  font-size: 14px;
}

.tutor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.tutor-price {
  font-size: 18px;
  color: #f5222d;
  font-weight: bold;
}

.load-more {
  text-align: center;
  margin-top: 20px;
  margin-bottom: 20px;
}
</style>
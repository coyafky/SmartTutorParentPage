<template>
  <div class="my-posts-container">
    <h1 class="page-title">我的发布</h1>
    
    <div v-if="loading" class="loading-container">
      <a-spin tip="加载中..." />
    </div>
    
    <div v-else-if="posts.length === 0" class="empty-container">
      <a-empty description="您还没有发布任何家教需求">
        <template #image>
          <icon-file style="font-size: 64px; color: #c9cdd4" />
        </template>
        <a-button type="primary" @click="$router.push('/post')">发布新需求</a-button>
      </a-empty>
    </div>
    
    <div v-else class="posts-list">
      <a-card v-for="post in posts" :key="post.id" class="post-card" :bordered="false">
        <template #title>
          <div class="post-header">
            <span class="post-title">{{ post.subject }}家教需求</span>
            <a-tag :color="getStatusColor(post.status)">{{ getStatusText(post.status) }}</a-tag>
          </div>
        </template>
        
        <div class="post-content">
          <div class="post-info-grid">
            <div class="info-item">
              <div class="info-label">地区</div>
              <div class="info-value">{{ post.province }} {{ post.city }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">学生年级</div>
              <div class="info-value">{{ post.grade }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">辅导科目</div>
              <div class="info-value">{{ post.subject }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">课时费用</div>
              <div class="info-value">{{ post.fee }}元/小时</div>
            </div>
            <div class="info-item">
              <div class="info-label">上课频率</div>
              <div class="info-value">每周{{ post.frequency }}次</div>
            </div>
            <div class="info-item">
              <div class="info-label">每次时长</div>
              <div class="info-value">{{ post.duration }}小时</div>
            </div>
          </div>
          
          <div class="post-detail">
            <div class="detail-label">辅导内容</div>
            <div class="detail-value">{{ post.content }}</div>
          </div>
          
          <div class="post-detail">
            <div class="detail-label">可选上课时间</div>
            <div class="detail-value">
              <a-space wrap>
                <a-tag v-for="time in post.availableTime" :key="time">{{ time }}</a-tag>
              </a-space>
            </div>
          </div>
          
          <div class="post-detail" v-if="post.teacherRequirement">
            <div class="detail-label">教师要求</div>
            <div class="detail-value">{{ post.teacherRequirement }}</div>
          </div>
          
          <div class="post-time">发布时间：{{ formatDate(post.createTime) }}</div>
        </div>
        
        <template #actions>
          <a-space>
            <a-button type="primary" @click="handleEdit(post)">修改</a-button>
            <a-button status="danger" @click="handleDelete(post)">删除</a-button>
          </a-space>
        </template>
      </a-card>
    </div>
    
    <!-- 删除确认对话框 -->
    <a-modal
      v-model:visible="deleteModalVisible"
      title="删除确认"
      @ok="confirmDelete"
      @cancel="cancelDelete"
      :ok-button-props="{ status: 'danger' }"
      ok-text="确认删除"
      cancel-text="取消"
    >
      <p>确定要删除这条家教需求吗？删除后将无法恢复。</p>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { IconFile } from '@arco-design/web-vue/es/icon'

const router = useRouter()
const loading = ref(true)
const posts = ref([])
const deleteModalVisible = ref(false)
const currentPost = ref(null)

// 模拟数据 - 实际应用中应从API获取
onMounted(() => {
  // 模拟API请求延迟
  setTimeout(() => {
    posts.value = [
      {
        id: '1',
        subject: '数学',
        province: '北京市',
        city: '海淀区',
        address: '中关村大街1号',
        educationLevel: 'senior',
        grade: '高二',
        gender: '男',
        content: '高二数学，重点是函数和三角函数的应用',
        score: '85/100',
        duration: '2',
        frequency: '2',
        fee: '200',
        availableTime: ['周一到周五晚上', '周六上午', '周日全天'],
        teacherGender: '不限',
        teacherAge: '25-35岁',
        teacherExperience: '3年以上',
        teacherRequirement: '有耐心，善于引导思考',
        status: 'active',
        createTime: new Date(2025, 2, 15)
      },
      {
        id: '2',
        subject: '英语',
        province: '北京市',
        city: '朝阳区',
        address: '朝阳公园附近',
        educationLevel: 'junior',
        grade: '初三',
        gender: '女',
        content: '初三英语，提高口语和写作能力',
        score: '78/100',
        duration: '1.5',
        frequency: '3',
        fee: '180',
        availableTime: ['周一到周五下午', '周六全天'],
        teacherGender: '女',
        teacherAge: '不限',
        teacherExperience: '2年以上',
        teacherRequirement: '口语流利，最好有海外留学背景',
        status: 'pending',
        createTime: new Date(2025, 3, 1)
      }
    ]
    loading.value = false
  }, 1000)
})

// 获取状态颜色
const getStatusColor = (status) => {
  const statusMap = {
    active: 'green',
    pending: 'orange',
    completed: 'blue',
    closed: 'red'
  }
  return statusMap[status] || 'gray'
}

// 获取状态文本
const getStatusText = (status) => {
  const statusMap = {
    active: '招聘中',
    pending: '审核中',
    completed: '已完成',
    closed: '已关闭'
  }
  return statusMap[status] || '未知状态'
}

// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

// 修改帖子
const handleEdit = (post) => {
  // 实际应用中，应将帖子ID传递给编辑页面
  router.push({
    path: '/post',
    query: { id: post.id, edit: true }
  })
}

// 删除帖子
const handleDelete = (post) => {
  currentPost.value = post
  deleteModalVisible.value = true
}

// 确认删除
const confirmDelete = () => {
  // 实际应用中，应调用API删除帖子
  posts.value = posts.value.filter(post => post.id !== currentPost.value.id)
  Message.success('删除成功')
  deleteModalVisible.value = false
  currentPost.value = null
}

// 取消删除
const cancelDelete = () => {
  deleteModalVisible.value = false
  currentPost.value = null
}
</script>

<style scoped>
.my-posts-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 500;
  margin-bottom: 24px;
  color: #1d2129;
}

.loading-container,
.empty-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-radius: 8px;
  transition: all 0.3s;
}

.post-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-title {
  font-size: 18px;
  font-weight: 500;
}

.post-content {
  padding: 8px 0;
}

.post-info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label,
.detail-label {
  font-size: 14px;
  color: #86909c;
  margin-bottom: 4px;
}

.info-value,
.detail-value {
  font-size: 14px;
  color: #1d2129;
}

.post-detail {
  margin-bottom: 12px;
}

.post-time {
  font-size: 12px;
  color: #86909c;
  text-align: right;
  margin-top: 16px;
}

@media (max-width: 768px) {
  .post-info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .post-info-grid {
    grid-template-columns: 1fr;
  }
}
</style>

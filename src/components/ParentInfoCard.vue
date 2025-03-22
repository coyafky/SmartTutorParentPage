<template>
  <div class="parent-info-card bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
    <div class="flex p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
      <!-- 左侧头像区域 -->
      <div class="avatar-section mr-8">
        <div class="relative">
          <a-avatar :size="120" class="shadow-lg border-4 border-white dark:border-gray-700 text-2xl font-bold">
            {{ parentInfo.nickname ? parentInfo.nickname.charAt(0).toUpperCase() : 'P' }}
          </a-avatar>
          <a-badge dot status="success" class="absolute bottom-1 right-1 border-2 border-white dark:border-gray-700" />
        </div>
      </div>
      
      <!-- 右侧基本信息 -->
      <div class="flex-1 flex flex-col justify-center">
        <div class="mb-3 flex items-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ parentInfo.nickname || '未设置昵称' }}
          </h1>
          <a-tag color="blue" class="ml-3 px-3 py-1 rounded-full text-sm font-medium" v-if="hasProfile">已完善</a-tag>
          <a-tag color="orange" class="ml-3 px-3 py-1 rounded-full text-sm font-medium" v-else>未完善</a-tag>
        </div>
        
        <div class="flex items-center text-gray-600 dark:text-gray-300 mb-3">
          <icon-location class="mr-2 text-blue-500" />
          <span class="text-base">{{ formatLocation(parentInfo.location) || '未设置位置' }}</span>
        </div>
        
        <div class="flex flex-wrap gap-6 mt-5">
          <div class="stat-item bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg shadow-sm">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {{ statistics?.totalPosts || 0 }}
            </div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">发布需求</div>
          </div>
          
          <div class="stat-item bg-green-50 dark:bg-green-900/20 p-3 rounded-lg shadow-sm">
            <div class="text-2xl font-bold text-green-600 dark:text-green-400">
              {{ statistics?.totalTeachers || 0 }}
            </div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">合作教师</div>
          </div>
          
          <div class="stat-item bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg shadow-sm">
            <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {{ childrenCount || 0 }}
            </div>
            <div class="text-sm font-medium text-gray-600 dark:text-gray-400">子女数量</div>
          </div>
        </div>
        
        <div class="mt-6">
          <a-button type="primary" @click="showEditModal" class="bg-blue-500 hover:bg-blue-600 border-none shadow-md hover:shadow-lg transition-all duration-300 px-5 py-1">
            <template #icon><icon-edit class="text-white" /></template>
            <span class="font-medium">编辑个人信息</span>
          </a-button>
        </div>
      </div>
    </div>
    
    <!-- 编辑个人信息模态框 -->
    <a-modal
      v-model:visible="modalVisible"
      title="编辑个人信息"
      @cancel="closeModal"
      @before-ok="submitForm"
      unmountOnClose
      :mask-closable="false"
      :esc-to-close="false"
    >
      <a-form :model="formData" layout="vertical">
        <!-- 基本信息 -->
        <div class="section-title flex items-center mb-5">
          <div class="h-8 w-1.5 bg-blue-500 rounded-r mr-3"></div>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <icon-user class="mr-2 text-blue-500" />
            基本信息
          </h2>
        </div>
        
        <a-form-item field="nickname" label="昵称" required>
          <a-input 
            v-model="formData.nickname" 
            placeholder="请输入昵称"
            allow-clear
            class="rounded-lg"
          />
        </a-form-item>

        <!-- 位置信息 -->
        <div class="section-title flex items-center mt-8 mb-5">
          <div class="h-8 w-1.5 bg-green-500 rounded-r mr-3"></div>
          <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center">
            <icon-location class="mr-2 text-green-500" />
            位置信息
          </h2>
        </div>
        
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="location.province" label="省份" required>
              <a-input
                v-model="formData.location.province"
                placeholder="请输入省份"
                allow-clear
                class="rounded-lg"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="location.city" label="城市" required>
              <a-input
                v-model="formData.location.city"
                placeholder="请输入城市"
                allow-clear
                class="rounded-lg"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="location.district" label="区域" required>
              <a-input
                v-model="formData.location.district"
                placeholder="请输入区域"
                allow-clear
                class="rounded-lg"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item field="location.address" label="详细地址">
          <a-input
            v-model="formData.location.address"
            placeholder="请输入详细地址"
            allow-clear
            class="rounded-lg"
          />
        </a-form-item>

        <!-- 联系方式 -->
        <div class="section-title flex items-center mt-6 mb-4">
          <div class="h-8 w-1 bg-purple-500 rounded-r mr-3"></div>
          <h2 class="text-lg font-medium text-gray-800 dark:text-gray-200">联系方式</h2>
        </div>
        
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="contactInfo.phone" label="手机号码" required>
              <a-input
                v-model="formData.contactInfo.phone"
                placeholder="请输入手机号码"
                allow-clear
                class="rounded-lg"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="contactInfo.email" label="邮箱">
              <a-input
                v-model="formData.contactInfo.email"
                placeholder="请输入邮箱"
                allow-clear
                class="rounded-lg"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="contactInfo.wechat" label="微信">
              <a-input
                v-model="formData.contactInfo.wechat"
                placeholder="请输入微信号"
                allow-clear
                class="rounded-lg"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { Message } from '@arco-design/web-vue';

export default {
  name: 'ParentInfoCard',
  props: {
    parentInfo: {
      type: Object,
      required: true,
    },
    hasProfile: {
      type: Boolean,
      default: false,
    },
    statistics: {
      type: Object,
      default: () => ({}),
    },
    childrenCount: {
      type: Number,
      default: 0,
    },
    loading: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      modalVisible: false,
      formData: {
        nickname: '',
        location: {
          province: '',
          city: '',
          district: '',
          address: '',
          coordinates: {
            type: 'Point',
            coordinates: [],
          },
        },
        contactInfo: {
          phone: '',
          email: '',
          wechat: '',
        },
      },
    };
  },
  methods: {
    showEditModal() {
      // 填充表单数据
      this.formData = {
        nickname: this.parentInfo.nickname || '',
        location: this.parentInfo.location ? { ...this.parentInfo.location } : {
          province: '',
          city: '',
          district: '',
          address: '',
          coordinates: {
            type: 'Point',
            coordinates: [],
          },
        },
        contactInfo: this.parentInfo.contactInfo ? { ...this.parentInfo.contactInfo } : {
          phone: '',
          email: '',
          wechat: '',
        },
      };
      this.modalVisible = true;
    },
    
    closeModal() {
      this.modalVisible = false;
    },
    
    async submitForm() {
      try {
        // 验证表单
        if (!this.formData.nickname) {
          Message.error('请输入昵称');
          return false;
        }
        if (!this.formData.location.province || !this.formData.location.city || !this.formData.location.district) {
          Message.error('请完善位置信息');
          return false;
        }
        if (!this.formData.contactInfo.phone) {
          Message.error('请输入手机号码');
          return false;
        }
        
        // 提交表单
        this.$emit('update-parent-info', this.formData);
        return true;
      } catch (error) {
        console.error('提交个人信息失败:', error);
        Message.error('提交个人信息失败，请稍后重试');
        return false;
      }
    },
    
    formatLocation(location) {
      if (!location) return '';
      const { province, city, district } = location;
      return [province, city, district].filter(Boolean).join(' ');
    },
  },
};
</script>

<style scoped>
.parent-info-card {
  border-radius: 16px;
  transition: all 0.3s ease;
}

.avatar-section .arco-avatar {
  border: 4px solid rgba(255, 255, 255, 0.8);
  transition: transform 0.3s ease;
}

.avatar-section .arco-avatar:hover {
  transform: scale(1.05);
}

.stat-item {
  padding: 8px 16px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}

.section-title {
  margin-bottom: 16px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .parent-info-card {
    padding: 16px;
  }
  
  .avatar-section .arco-avatar {
    width: 80px;
    height: 80px;
  }
}

/* 暗黑模式适配 */
.dark .stat-item {
  background-color: rgba(255, 255, 255, 0.05);
}

.dark .stat-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
}
</style>

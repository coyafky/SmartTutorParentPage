<template>
  <div class="teacher-preference-card bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
    <div class="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">
        <icon-user-group class="mr-2 text-green-500" />
        教师偏好设置
      </h2>
      <a-button type="primary" @click="showEditModal" class="bg-green-500 hover:bg-green-600 border-none">
        <template #icon><icon-edit /></template>
        编辑偏好
      </a-button>
    </div>
    
    <div class="p-5">
      <a-spin :loading="loading">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 教师性别偏好 -->
          <div class="preference-item">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">教师性别偏好</div>
            <div class="flex items-center">
              <icon-man class="text-xl mr-2" :class="preferences.teacherGender === '男' ? 'text-blue-500' : 'text-gray-400'" />
              <icon-woman class="text-xl mr-2" :class="preferences.teacherGender === '女' ? 'text-pink-500' : 'text-gray-400'" />
              <span class="text-gray-800 dark:text-gray-200">
                {{ preferences.teacherGender === '不限' ? '不限性别' : preferences.teacherGender + '教师' }}
              </span>
            </div>
          </div>
          
          <!-- 教学地点 -->
          <div class="preference-item">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">教学地点</div>
            <div class="flex items-center">
              <icon-home class="text-xl mr-2" :class="preferences.teachingLocation === '家里' ? 'text-orange-500' : 'text-gray-400'" />
              <icon-location class="text-xl mr-2" :class="preferences.teachingLocation === '教师处' ? 'text-purple-500' : 'text-gray-400'" />
              <icon-computer class="text-xl mr-2" :class="preferences.teachingLocation === '线上' ? 'text-blue-500' : 'text-gray-400'" />
              <span class="text-gray-800 dark:text-gray-200">
                {{ getTeachingLocationText(preferences.teachingLocation) }}
              </span>
            </div>
          </div>
          
          <!-- 教学风格 -->
          <div class="preference-item">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">教学风格</div>
            <div class="flex flex-wrap gap-2">
              <a-tag v-for="style in preferences.teachingStyle" :key="style" color="green">
                {{ style }}
              </a-tag>
              <a-tag v-if="!preferences.teachingStyle || preferences.teachingStyle.length === 0" color="gray">
                未设置教学风格偏好
              </a-tag>
            </div>
          </div>
          
          <!-- 预算范围 -->
          <div class="preference-item">
            <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">预算范围</div>
            <div class="flex items-center">
              <icon-money class="text-xl mr-2 text-green-500" />
              <span class="text-gray-800 dark:text-gray-200">
                {{ preferences.budget.min }} - {{ preferences.budget.max }} 元/{{ getBudgetPeriodText(preferences.budget.period) }}
              </span>
            </div>
          </div>
        </div>
      </a-spin>
    </div>
    
    <!-- 编辑教师偏好模态框 -->
    <a-modal
      v-model:visible="modalVisible"
      title="编辑教师偏好设置"
      @cancel="closeModal"
      @before-ok="submitForm"
      unmountOnClose
      :mask-closable="false"
      :esc-to-close="false"
    >
      <a-form :model="formData" layout="vertical">
        <a-form-item field="teacherGender" label="教师性别偏好">
          <a-radio-group v-model="formData.teacherGender">
            <a-radio value="不限">不限</a-radio>
            <a-radio value="男">男教师</a-radio>
            <a-radio value="女">女教师</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item field="teachingLocation" label="教学地点">
          <a-radio-group v-model="formData.teachingLocation">
            <a-radio value="家里">在家中</a-radio>
            <a-radio value="教师处">教师处</a-radio>
            <a-radio value="线上">线上教学</a-radio>
            <a-radio value="不限">不限</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item field="teachingStyle" label="教学风格">
          <a-select
            v-model="formData.teachingStyle"
            placeholder="请选择教学风格偏好"
            multiple
            allow-clear
            class="rounded-lg"
          >
            <a-option value="严厉">严厉</a-option>
            <a-option value="温和">温和</a-option>
            <a-option value="幽默">幽默</a-option>
            <a-option value="耐心">耐心</a-option>
            <a-option value="启发式">启发式</a-option>
            <a-option value="系统化">系统化</a-option>
            <a-option value="互动式">互动式</a-option>
            <a-option value="个性化">个性化</a-option>
          </a-select>
        </a-form-item>
        
        <div class="section-title flex items-center mt-4 mb-2">
          <div class="h-6 w-1 bg-green-500 rounded-r mr-3"></div>
          <h3 class="text-base font-medium text-gray-800 dark:text-gray-200">预算设置</h3>
        </div>
        
        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="budget.min" label="最低预算">
              <a-input-number
                v-model="formData.budget.min"
                placeholder="最低预算"
                class="w-full rounded-lg"
                :min="0"
                :precision="0"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="budget.max" label="最高预算">
              <a-input-number
                v-model="formData.budget.max"
                placeholder="最高预算"
                class="w-full rounded-lg"
                :min="0"
                :precision="0"
              />
            </a-form-item>
          </a-col>
        </a-row>
        
        <a-form-item field="budget.period" label="计费周期">
          <a-radio-group v-model="formData.budget.period">
            <a-radio value="per_hour">每小时</a-radio>
            <a-radio value="per_lesson">每课时</a-radio>
            <a-radio value="per_day">每天</a-radio>
            <a-radio value="per_month">每月</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { Message } from '@arco-design/web-vue';

export default {
  name: 'TeacherPreference',
  props: {
    preferences: {
      type: Object,
      default: () => ({
        teacherGender: '不限',
        teachingStyle: [],
        teachingLocation: '家里',
        budget: {
          min: 100,
          max: 300,
          period: 'per_hour',
        },
      }),
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modalVisible: false,
      formData: {
        teacherGender: '不限',
        teachingStyle: [],
        teachingLocation: '家里',
        budget: {
          min: 100,
          max: 300,
          period: 'per_hour',
        },
      },
    };
  },
  methods: {
    showEditModal() {
      // 填充表单数据
      this.formData = {
        teacherGender: this.preferences.teacherGender || '不限',
        teachingStyle: [...(this.preferences.teachingStyle || [])],
        teachingLocation: this.preferences.teachingLocation || '家里',
        budget: {
          min: this.preferences.budget?.min || 100,
          max: this.preferences.budget?.max || 300,
          period: this.preferences.budget?.period || 'per_hour',
        },
      };
      this.modalVisible = true;
    },
    
    closeModal() {
      this.modalVisible = false;
    },
    
    async submitForm() {
      try {
        // 验证预算
        if (this.formData.budget.min > this.formData.budget.max) {
          Message.error('最低预算不能高于最高预算');
          return false;
        }
        
        // 提交表单
        this.$emit('update-preferences', this.formData);
        return true;
      } catch (error) {
        console.error('提交教师偏好设置失败:', error);
        Message.error('提交教师偏好设置失败，请稍后重试');
        return false;
      }
    },
    
    getTeachingLocationText(location) {
      const locationMap = {
        '家里': '在家中上课',
        '教师处': '在教师处上课',
        '线上': '线上教学',
        '不限': '不限地点',
      };
      return locationMap[location] || '未设置';
    },
    
    getBudgetPeriodText(period) {
      const periodMap = {
        'per_hour': '小时',
        'per_lesson': '课时',
        'per_day': '天',
        'per_month': '月',
      };
      return periodMap[period] || '小时';
    },
  },
};
</script>

<style scoped>
.teacher-preference-card {
  border-radius: 16px;
  transition: all 0.3s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.teacher-preference-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.preference-item {
  padding: 12px;
  border-radius: 12px;
  background-color: rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
}

.preference-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
  transform: translateY(-2px);
}

/* 暗黑模式适配 */
.dark .preference-item {
  background-color: rgba(255, 255, 255, 0.05);
}

.dark .preference-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
}
</style>

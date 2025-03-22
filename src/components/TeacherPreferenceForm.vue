<template>
  <div class="space-y-4">
    <a-alert type="info" class="mb-4">
      <template #icon><icon-info /></template>
      <template #message>设置您对家教老师的偏好，帮助我们更好地匹配合适的教师</template>
    </a-alert>

    <a-form-item
      field="preferences.teachingLocation"
      label="上课地点"
      :rules="[{ required: true, message: '请选择上课地点' }]"
    >
      <a-select v-model="formData.preferences.teachingLocation" placeholder="请选择上课地点">
        <a-option value="家里">学生家里</a-option>
        <a-option value="教师处">教师处</a-option>
        <a-option value="线上">线上</a-option>
        <a-option value="协商">双方协商</a-option>
      </a-select>
    </a-form-item>

    <a-form-item
      field="preferences.teacherGender"
      label="教师性别"
    >
      <a-radio-group v-model="formData.preferences.teacherGender">
        <a-radio value="男">男</a-radio>
        <a-radio value="女">女</a-radio>
        <a-radio value="均可">均可</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item
      field="preferences.teachingStyle"
      label="教学风格"
    >
      <a-space direction="vertical" style="width: 100%">
        <a-space wrap>
          <a-tag
            v-for="style in teachingStyles"
            :key="style"
            :checked="formData.preferences.teachingStyle.includes(style)"
            checkable
            @check="handleTeachingStyleCheck(style)"
          >
            {{ style }}
          </a-tag>
        </a-space>
      </a-space>
    </a-form-item>

    <a-form-item
      field="preferences.budget"
      label="预算范围"
      :rules="[{ required: true, message: '请设置预算范围' }]"
    >
      <div class="flex items-center gap-2">
        <a-input-number
          v-model="formData.preferences.budget.min"
          placeholder="最低"
          :min="0"
          :max="formData.preferences.budget.max || 1000"
          style="width: 120px"
        />
        <span>至</span>
        <a-input-number
          v-model="formData.preferences.budget.max"
          placeholder="最高"
          :min="formData.preferences.budget.min || 0"
          style="width: 120px"
        />
        <span>元/小时</span>
      </div>
    </a-form-item>

    <a-form-item
      field="status"
      label="需求状态"
    >
      <a-radio-group v-model="formData.status">
        <a-radio value="open">公开</a-radio>
        <a-radio value="private">私密</a-radio>
      </a-radio-group>
    </a-form-item>

    <a-form-item
      field="availableTime"
      label="可选上课时间段"
      :rules="[{ required: true, message: '请选择可选时间段' }]"
    >
      <a-space direction="vertical" style="width: 100%">
        <div>
          <span class="inline-block w-[70px] font-medium">工作日：</span>
          <a-space wrap>
            <a-tag
              :checked="availableTime.includes('周一到周五上午')"
              checkable
              @check="handleTimeTagCheck('周一到周五上午')"
              >上午 (8:00-12:00)</a-tag
            >
            <a-tag
              :checked="availableTime.includes('周一到周五下午')"
              checkable
              @check="handleTimeTagCheck('周一到周五下午')"
              >下午 (14:00-18:00)</a-tag
            >
            <a-tag
              :checked="availableTime.includes('周一到周五晚上')"
              checkable
              @check="handleTimeTagCheck('周一到周五晚上')"
              >晚上 (19:00-22:00)</a-tag
            >
          </a-space>
        </div>
        <div>
          <span class="inline-block w-[70px] font-medium">周末：</span>
          <a-space wrap>
            <a-tag
              :checked="availableTime.includes('周末上午')"
              checkable
              @check="handleTimeTagCheck('周末上午')"
              >上午 (8:00-12:00)</a-tag
            >
            <a-tag
              :checked="availableTime.includes('周末下午')"
              checkable
              @check="handleTimeTagCheck('周末下午')"
              >下午 (14:00-18:00)</a-tag
            >
            <a-tag
              :checked="availableTime.includes('周末晚上')"
              checkable
              @check="handleTimeTagCheck('周末晚上')"
              >晚上 (19:00-22:00)</a-tag
            >
          </a-space>
        </div>
      </a-space>
    </a-form-item>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import { IconInfo } from '@arco-design/web-vue/es/icon';

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update:modelValue']);

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// 可用的教学风格
const teachingStyles = [
  '有耐心',
  '善于沟通',
  '生动有趣',
  '严格要求',
  '鼓励引导',
  '循序渐进',
  '注重思维',
  '注重应试',
  '因材施教'
];

// 可选时间
const availableTime = ref([]);

// 处理教学风格选择
const handleTeachingStyleCheck = (style) => {
  const index = formData.value.preferences.teachingStyle.indexOf(style);
  if (index === -1) {
    formData.value.preferences.teachingStyle.push(style);
  } else {
    formData.value.preferences.teachingStyle.splice(index, 1);
  }
};

// 时间段选择处理函数
const handleTimeTagCheck = (time) => {
  const index = availableTime.value.indexOf(time);
  if (index === -1) {
    availableTime.value.push(time);
  } else {
    availableTime.value.splice(index, 1);
  }
  
  // 更新父组件的值
  formData.value.availableTime = [...availableTime.value];
};
</script>

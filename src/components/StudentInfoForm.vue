<template>
  <div class="space-y-6">
    <a-alert type="info" class="mb-6 shadow-sm">
      <template #icon><icon-info class="text-blue-500" /></template>
      <template #message>
        <div class="text-gray-700 font-medium">填写学生的基本信息，帮助我们更好地匹配合适的家教老师</div>
      </template>
    </a-alert>

    <a-form-item
      field="childId"
      label="选择孩子"
      :rules="[{ required: true, message: '请选择孩子' }]"
    >
      <a-select v-model="formData.childId" placeholder="请选择孩子" @change="handleChildChange">
        <a-option v-for="child in children" :key="child.id" :value="child.id">
          {{ child.name }} ({{ child.age }}岁)
        </a-option>
      </a-select>
    </a-form-item>

    <a-form-item
      field="grade"
      label="学生年级"
      :rules="[{ required: true, message: '请选择年级' }]"
    >
      <a-select v-model="formData.grade" placeholder="请选择年级">
        <!-- 小学 -->
        <a-option disabled value="小学" style="font-weight: bold; color: var(--color-text-3);">小学</a-option>
        <a-option value="小学一年级">一年级</a-option>
        <a-option value="小学二年级">二年级</a-option>
        <a-option value="小学三年级">三年级</a-option>
        <a-option value="小学四年级">四年级</a-option>
        <a-option value="小学五年级">五年级</a-option>
        <a-option value="小学六年级">六年级</a-option>
        
        <!-- 初中 -->
        <a-option disabled value="初中" style="font-weight: bold; color: var(--color-text-3);">初中</a-option>
        <a-option value="初中一年级">初一</a-option>
        <a-option value="初中二年级">初二</a-option>
        <a-option value="初中三年级">初三</a-option>
        
        <!-- 高中 -->
        <a-option disabled value="高中" style="font-weight: bold; color: var(--color-text-3);">高中</a-option>
        <a-option value="高中一年级">高一</a-option>
        <a-option value="高中二年级">高二</a-option>
        <a-option value="高中三年级">高三</a-option>
      </a-select>
    </a-form-item>

    <div class="border border-gray-200 p-5 rounded-lg bg-gray-50 mb-6 shadow-sm">
      <div class="font-medium text-lg mb-3 text-gray-800">科目信息</div>
      <div
        v-for="(subject, index) in formData.subjects"
        :key="index"
        class="mb-5 p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div class="flex justify-between items-center mb-3">
          <span class="font-medium text-gray-700 text-base">科目 {{ index + 1 }}</span>
          <a-button
            v-if="formData.subjects.length > 1"
            type="text"
            status="danger"
            @click="removeSubject(index)"
            class="hover:bg-red-50 transition-colors duration-300"
          >
            <template #icon><icon-delete class="text-red-500" /></template>
          </a-button>
        </div>

        <a-form-item
          :field="`subjects[${index}].name`"
          label="科目名称"
          :rules="[{ required: true, message: '请选择科目' }]"
        >
          <a-select v-model="subject.name" placeholder="请选择科目">
            <a-option value="语文">语文</a-option>
            <a-option value="数学">数学</a-option>
            <a-option value="英语">英语</a-option>
            <a-option value="物理">物理</a-option>
            <a-option value="化学">化学</a-option>
            <a-option value="生物">生物</a-option>
            <a-option value="历史">历史</a-option>
            <a-option value="地理">地理</a-option>
            <a-option value="政治">政治</a-option>
          </a-select>
        </a-form-item>

        <a-form-item :field="`subjects[${index}].currentScore`" label="当前分数">
          <a-input-number
            v-model="subject.currentScore"
            placeholder="请输入当前分数"
            :min="0"
            :max="100"
          />
        </a-form-item>

        <a-form-item :field="`subjects[${index}].targetScore`" label="目标分数">
          <a-input-number
            v-model="subject.targetScore"
            placeholder="请输入目标分数"
            :min="0"
            :max="100"
          />
        </a-form-item>

        <a-form-item :field="`subjects[${index}].difficulty`" label="难度">
          <a-select v-model="subject.difficulty" placeholder="请选择难度">
            <a-option value="简单">简单</a-option>
            <a-option value="中等">中等</a-option>
            <a-option value="困难">困难</a-option>
          </a-select>
        </a-form-item>
      </div>

      <a-button type="dashed" long @click="addSubject" class="hover:border-blue-400 hover:text-blue-500 transition-colors duration-300">
        <template #icon><icon-plus class="text-blue-500" /></template>
        <span class="font-medium">添加科目</span>
      </a-button>
    </div>

    <a-form-item
      field="location.address"
      label="详细地址"
      :rules="[{ required: true, message: '请输入详细地址' }]"
    >
      <a-input v-model="formData.location.address" placeholder="请输入详细地址" />
    </a-form-item>

    <a-form-item
      field="location.city"
      label="城市"
      :rules="[{ required: true, message: '请输入城市' }]"
    >
      <a-input v-model="formData.location.city" placeholder="请输入城市" />
    </a-form-item>

    <a-form-item
      field="location.district"
      label="区域"
      :rules="[{ required: true, message: '请输入区域' }]"
    >
      <a-input v-model="formData.location.district" placeholder="请输入区域" />
    </a-form-item>

    <a-form-item field="description" label="需求描述">
      <a-textarea
        v-model="formData.description"
        placeholder="请详细描述您的需求，例如希望提高哪些方面的能力"
        :auto-size="{ minRows: 3, maxRows: 5 }"
      />
    </a-form-item>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  children: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:modelValue', 'child-selected'])

const formData = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// 处理选择孩子
const handleChildChange = (childId) => {
  const selectedChild = props.children.find((child) => child.id === childId)
  if (selectedChild) {
    emit('child-selected', selectedChild)
  }
}

// 添加科目
const addSubject = () => {
  formData.value.subjects.push({
    name: '',
    currentScore: '',
    targetScore: '',
    difficulty: '中等',
  })
}

// 移除科目
const removeSubject = (index) => {
  formData.value.subjects.splice(index, 1)
}

// 初始化确保至少有一个科目
watch(
  () => formData.value.subjects,
  (subjects) => {
    if (!subjects || subjects.length === 0) {
      formData.value.subjects = [
        {
          name: '',
          currentScore: '',
          targetScore: '',
          difficulty: '中等',
        },
      ]
    }
  },
  { immediate: true },
)
</script>

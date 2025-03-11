<template>
  <div class="register-container">
    <a-card class="register-card" :style="{ width: '400px' }">
      <template #title>家长注册</template>
      <a-form :model="form" @submit="handleSubmit">
        <a-form-item
          field="username"
          :rules="[
            { required: true, message: '请输入用户名' },
            { minLength: 3, message: '用户名至少3个字符' },
            { maxLength: 30, message: '用户名最多30个字符' },
          ]"
        >
          <a-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="password"
          :rules="[
            { required: true, message: '请输入密码' },
            { minLength: 8, message: '密码至少8个字符' },
          ]"
        >
          <a-input-password v-model="form.password" placeholder="请输入密码">
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item
          field="confirmPassword"
          :rules="[
            { required: true, message: '请确认密码' },
            {
              validator: (value) => value === form.password,
              message: '两次输入的密码不一致',
            },
          ]"
        >
          <a-input-password v-model="form.confirmPassword" placeholder="请确认密码">
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" long>注册</a-button>
        </a-form-item>
        <div class="text-center">已有账号？ <router-link to="/login">立即登录</router-link></div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { useUserStore } from '../stores/user'

const router = useRouter()
const userStore = useUserStore()
const form = ref({
  username: '',
  password: '',
  confirmPassword: '',
})

const handleSubmit = async () => {
  try {
    await userStore.register(form.value)
    Message.success('注册成功')
    router.push('/dashboard')
  } catch (error) {
    console.error('注册失败:', error)
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--color-fill-2);
  opacity: 0;
  animation: fadeIn 0.6s ease-out forwards;
}

.register-card {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  backdrop-filter: blur(10px);
  transform: translateY(20px);
  animation: slideUp 0.6s ease-out forwards;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.register-card:hover {
  transform: translateY(18px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.15);
}

:deep(.arco-input-wrapper) {
  transition: all 0.3s ease;
  border-radius: 8px;
}

:deep(.arco-input-wrapper:focus-within) {
  transform: scale(1.02);
  box-shadow: 0 0 0 2px rgba(var(--primary-6), 0.2);
}

:deep(.arco-btn) {
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

:deep(.arco-btn:active) {
  transform: scale(0.98);
}

.text-center {
  text-align: center;
  opacity: 0;
  animation: fadeIn 0.6s ease-out 0.3s forwards;
}

:deep(.arco-form-item) {
  opacity: 0;
  animation: fadeIn 0.6s ease-out forwards;
}

:deep(.arco-form-item:nth-child(1)) {
  animation-delay: 0.1s;
}

:deep(.arco-form-item:nth-child(2)) {
  animation-delay: 0.2s;
}

:deep(.arco-form-item:nth-child(3)) {
  animation-delay: 0.3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

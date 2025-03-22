<template>
  <div class="flex justify-center mt-6">
    <a-button 
      type="primary" 
      status="danger" 
      @click="showLogoutConfirm" 
      class="bg-red-500 hover:bg-red-600 border-none shadow-md hover:shadow-lg transition-all duration-300 px-5 py-1"
      :loading="loading"
    >
      <template #icon><icon-export class="text-white" /></template>
      <span class="font-medium">退出登录</span>
    </a-button>
  </div>
</template>

<script>
// import { Message } from '@arco-design/web-vue';

export default {
  name: 'LogoutButton',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    showLogoutConfirm() {
      this.$modal.warning({
        title: '确认退出',
        content: '您确定要退出登录吗？',
        okText: '退出',
        cancelText: '取消',
        onOk: this.handleLogout,
      });
    },
    
    handleLogout() {
      this.$emit('logout');
    },
  },
};
</script>

<!-- 使用 Tailwind CSS 类替代自定义样式 -->
<style scoped>
/* 所有样式已通过 Tailwind 类实现 */
</style>

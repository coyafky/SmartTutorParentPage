<!-- 家长消息中心组件 - 支持Socket.IO实时消息功能 -->
<template>
  <div class="messages-container">
    <!-- 页面标题 -->
    <h1 class="page-title">消息中心</h1>

    <div class="messages-content">
      <!-- 左侧：消息列表 -->
      <div class="message-list-section">
        <a-card :bordered="false" class="message-list-card">
          <div class="message-search">
            <a-input-search 
              v-model="searchQuery" 
              placeholder="搜索老师" 
              allow-clear 
              @change="handleSearch"
            />
          </div>

          <div class="message-tabs">
            <a-tabs default-active-key="all">
              <a-tab-pane key="all" title="全部">
                <div class="contact-list">
                  <div v-if="isLoading && contacts.length === 0" class="loading-state">
                    <a-spin />
                    <p>加载对话列表中...</p>
                  </div>
                  <div v-else-if="contacts.length === 0" class="empty-state">
                    <a-empty description="暂无对话记录" />
                  </div>
                  <div
                    v-for="contact in contacts"
                    :key="contact.id"
                    class="contact-item"
                    :class="{ active: selectedContact && selectedContact.id === contact.id }"
                    @click="selectContact(contact)"
                  >
                    <div class="contact-avatar">
                      <a-badge :count="contact.unreadCount" :dot="contact.unreadCount > 0">
                        <a-avatar :size="46" :src="contact.avatar">{{
                          contact.name.charAt(0)
                        }}</a-avatar>
                      </a-badge>
                    </div>
                    <div class="contact-info">
                      <div class="contact-header">
                        <span class="contact-name">{{ contact.name }}</span>
                        <span class="contact-time">{{ contact.lastMessageTime }}</span>
                      </div>
                      <div class="contact-message">
                        <p class="message-preview unread">{{ contact.lastMessage }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a-tab-pane>
            </a-tabs>
          </div>
        </a-card>
      </div>

      <!-- 右侧：聊天详情 -->
      <div class="chat-section">
        <a-card :bordered="false" class="chat-card" v-if="selectedContact">
          <template #title>
            <div class="chat-header">
              <div class="chat-contact-info">
                <span class="chat-contact-name">{{ selectedContact.name }}</span>
                <span class="chat-contact-status" v-if="selectedContact.online">
                  <a-badge status="success" text="在线" />
                </span>
                <span class="chat-contact-status" v-else>
                  <a-badge status="default" text="离线" />
                </span>
              </div>
              <div class="chat-actions">
                <a-button type="text" shape="circle">
                  <template #icon><icon-phone /></template>
                </a-button>
                <a-button type="text" shape="circle">
                  <template #icon><icon-video-camera /></template>
                </a-button>
                <a-button type="text" shape="circle">
                  <template #icon><icon-more /></template>
                </a-button>
              </div>
            </div>
          </template>

          <div class="chat-messages" ref="chatMessagesRef">
            <div class="chat-date-divider">
              <span>{{ formatDate(selectedContact.messages[0]?.timestamp) }}</span>
            </div>

            <div
              v-for="(message, index) in selectedContact.messages"
              :key="index"
              class="message-item"
              :class="{
                'message-sent': message.sender === 'me',
                'message-received': message.sender !== 'me' && message.sender !== 'system',
                'message-system': message.sender === 'system',
              }"
            >
              <div
                class="message-avatar"
                v-if="message.sender !== 'me' && message.sender !== 'system'"
              >
                <a-avatar :size="36" :src="selectedContact.avatar">
                  {{ selectedContact.name.charAt(0) }}
                </a-avatar>
              </div>

              <div class="message-content">
                <div class="message-bubble">
                  <p>{{ message.content }}</p>
                </div>
                <div class="message-time" v-if="message.sender !== 'system'">
                  {{ formatMessageTime(message.timestamp) }}
                </div>
              </div>

              <div class="message-avatar" v-if="message.sender === 'me'">
                <a-avatar :size="36" :src="currentUser.avatar">
                  {{ currentUser.name.charAt(0) }}
                </a-avatar>
              </div>
            </div>

            <div class="typing-indicator" v-if="isTyping">
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
              <div class="typing-dot"></div>
            </div>
          </div>

          <div class="chat-input">
            <div class="input-actions">
              <a-button type="text" shape="circle">
                <template #icon><icon-face-smile-fill /></template>
              </a-button>
              <a-button type="text" shape="circle">
                <template #icon><icon-image-close /></template>
              </a-button>
              <a-button type="text" shape="circle">
                <template #icon><icon-file /></template>
              </a-button>
            </div>

            <div class="input-field">
              <a-textarea
                v-model="messageInput"
                placeholder="输入消息..."
                :auto-size="{ minRows: 1, maxRows: 4 }"
                @keypress.enter.prevent="sendMessage"
              />
            </div>

            <div class="send-button">
              <a-button
                type="primary"
                shape="circle"
                :disabled="!messageInput.trim()"
                @click="sendMessage"
              >
                <template #icon><icon-send /></template>
              </a-button>
            </div>
          </div>
        </a-card>

        <div class="empty-chat" v-else>
          <a-empty description="选择一个联系人开始聊天">
            <template #image>
              <icon-message style="font-size: 64px; color: #c9cdd4" />
            </template>
          </a-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Message, Notification } from '@arco-design/web-vue'
import {
  IconMessage,
  IconPhone,
  IconVideoCamera,
  IconMore,
  IconFaceSmileFill,
  IconImageClose,
  IconFile,
  IconSend,
} from '@arco-design/web-vue/es/icon'
import { useMessageStore } from '../stores/message'
import { useUserStore } from '../stores/user'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

// 获取存储实例
const messageStore = useMessageStore()
const userStore = useUserStore()

// 当前用户信息
const currentUser = {
  id: userStore.userId,
  name: userStore.username,
  avatar: userStore.avatar || '',
}

// 消息输入和状态变量
const searchQuery = ref('')

// 从消息存储获取对话列表
const contacts = computed(() => {
  if (!searchQuery.value) {
    return messageStore.conversations.map(conv => transformConversation(conv))
  }
  
  return messageStore.conversations
    .filter(conv => {
      const teacherName = conv.teacherName || ''
      return teacherName.toLowerCase().includes(searchQuery.value.toLowerCase())
    })
    .map(conv => transformConversation(conv))
})

// 将服务器对话转换为UI显示格式
const transformConversation = (conv) => {
  return {
    id: conv._id,
    name: conv.teacherName || '未知老师',
    avatar: conv.teacherAvatar || '',
    role: 'teacher',
    lastMessage: conv.lastMessage || '开始对话',
    lastMessageTime: formatMessageTime(conv.lastMessageTime || conv.createdAt),
    unreadCount: conv.unreadCount || 0,
    online: false,
    messages: conv.messages?.map(msg => ({
      _id: msg._id,
      sender: msg.senderId === userStore.userId ? 'me' : conv.teacherId,
      content: msg.content,
      timestamp: new Date(msg.createdAt),
      isRead: msg.isRead,
      messageType: msg.messageType || 'text',
      isSending: msg.isSending || false,
      isFailed: msg.isFailed || false
    })) || []  
  }
}

// 临时联系人列表（仅在API加载前显示）
const tempContacts = ref([
  {
    id: 'tutor1',
    name: '李老师',
    avatar: '',
    lastMessage: '非常感谢您的邀请，我很乐意担任您孩子的数学家教。',
    lastMessageTime: '10:30',
    unreadCount: 2,
    online: true,
    messages: [
      {
        sender: 'system',
        content: '【系统通知】您已向李老师发送了家教邀请',
        timestamp: new Date(2025, 2, 18, 10, 10),
      },
      {
        sender: 'tutor1',
        content: '您好，我是李老师，很高兴收到您的家教邀请。',
        timestamp: new Date(2025, 2, 18, 10, 15),
      },
      {
        sender: 'me',
        content: '李老师您好，我们对您的教学经验和方法很感兴趣，希望您能担任我孩子的数学家教。',
        timestamp: new Date(2025, 2, 18, 10, 18),
      },
      {
        sender: 'tutor1',
        content: '非常感谢您的邀请，我很乐意担任您孩子的数学家教。',
        timestamp: new Date(2025, 2, 18, 10, 20),
      },
      {
        sender: 'system',
        content: '【系统通知】家长已同意应聘，您可以查看对方联系方式',
        timestamp: new Date(2025, 2, 18, 10, 22),
      },
      {
        sender: 'tutor1',
        content: '太好了，我的联系电话是：138****5678，您可以添加我的微信，与我的手机号相同。',
        timestamp: new Date(2025, 2, 18, 10, 25),
      },
      {
        sender: 'me',
        content:
          '已添加您的微信，我的微信昵称是"小明爸爸"。我们可以在微信上详细商量上课时间和地点。',
        timestamp: new Date(2025, 2, 18, 10, 30),
      },
    ],
  },
  {
    id: 'tutor2',
    name: '王老师',
    avatar: '',
    lastMessage: '我的联系电话是：139****1234，您可以添加我的微信，与手机号相同。',
    lastMessageTime: '昨天',
    unreadCount: 0,
    online: false,
    messages: [
      {
        sender: 'system',
        content: '【系统通知】王老师向您发送了应聘申请',
        timestamp: new Date(2025, 2, 17, 14, 25),
      },
      {
        sender: 'tutor2',
        content:
          '张家长您好，我是王老师，看到您发布的英语家教需求，我认为我的教学经验和方法非常适合您的需求。',
        timestamp: new Date(2025, 2, 17, 14, 30),
      },
      {
        sender: 'me',
        content: '王老师您好，感谢您的应聘申请。我看了您的简历和评价，确实很符合我们的需求。',
        timestamp: new Date(2025, 2, 17, 14, 35),
      },
      {
        sender: 'system',
        content: '【系统通知】您已同意王老师的应聘申请',
        timestamp: new Date(2025, 2, 17, 14, 40),
      },
      {
        sender: 'me',
        content: '我们非常期待与您合作，希望您能帮助我的孩子提高英语成绩。',
        timestamp: new Date(2025, 2, 17, 14, 45),
      },
      {
        sender: 'tutor2',
        content: '非常感谢您的信任，我一定会尽我所能帮助您的孩子提高英语水平。',
        timestamp: new Date(2025, 2, 17, 14, 50),
      },
      {
        sender: 'tutor2',
        content: '我的联系电话是：139****1234，您可以添加我的微信，与手机号相同。',
        timestamp: new Date(2025, 2, 17, 15, 0),
      },
    ],
  },
  {
    id: 'tutor3',
    name: '张老师',
    avatar: '',
    lastMessage: '期待您的回复，希望能有机会为您的孩子提供物理辅导。',
    lastMessageTime: '3天前',
    unreadCount: 0,
    online: true,
    messages: [
      {
        sender: 'system',
        content: '【系统通知】张老师向您发送了应聘申请',
        timestamp: new Date(2025, 2, 15, 9, 5),
      },
      {
        sender: 'tutor3',
        content:
          '您好，我是张老师，擅长物理教学，看到您发布的家教需求，希望能应聘成为您孩子的物理老师。',
        timestamp: new Date(2025, 2, 15, 9, 10),
      },
      {
        sender: 'me',
        content: '张老师您好，感谢您的应聘申请。请问您有高中物理的教学经验吗？',
        timestamp: new Date(2025, 2, 15, 9, 15),
      },
      {
        sender: 'tutor3',
        content: '是的，我有5年高中物理教学经验，曾辅导多名学生提高物理成绩，取得优异成绩。',
        timestamp: new Date(2025, 2, 15, 9, 20),
      },
      {
        sender: 'me',
        content: '听起来很不错，我需要再考虑一下，会尽快给您答复。',
        timestamp: new Date(2025, 2, 15, 9, 25),
      },
      {
        sender: 'tutor3',
        content: '好的，完全理解。如果您有任何问题，随时可以向我咨询。',
        timestamp: new Date(2025, 2, 15, 9, 30),
      },
      {
        sender: 'tutor3',
        content: '期待您的回复，希望能有机会为您的孩子提供物理辅导。',
        timestamp: new Date(2025, 2, 15, 9, 40),
      },
    ],
  },
])

// 未读消息联系人
const unreadContacts = computed(() => {
  return contacts.value.filter((contact) => contact.unreadCount > 0)
})

// 选中的联系人
const selectedContact = ref(null)

// 监听当前对话变化
watch(() => messageStore.currentConversation, (newConversation) => {
  if (newConversation) {
    const transformedContact = transformConversation(newConversation)
    selectedContact.value = transformedContact
    nextTick(() => {
      scrollToBottom()
    })
  }
}, { deep: true })

// 监听通知
watch(() => messageStore.notifications, (newNotifications) => {
  if (newNotifications.length > 0) {
    const latestNotification = newNotifications[0]
    if (latestNotification.type === 'message') {
      Notification.info({
        title: latestNotification.title,
        content: latestNotification.content,
        duration: 5000
      })
    }
  }
}, { deep: true })

// 搜索处理
const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

// 选择联系人
const selectContact = async (contact) => {
  // 清除该对话的通知
  messageStore.clearConversationNotifications(contact.id)
  
  // 获取对话详情
  await messageStore.fetchConversation(contact.id)
  
  // 转换为UI格式
  if (messageStore.currentConversation) {
    selectedContact.value = transformConversation(messageStore.currentConversation)
  } else {
    selectedContact.value = contact
  }
  
  nextTick(() => {
    scrollToBottom()
  })
}

// 发送消息
const sendMessage = async () => {
  if (!messageInput.value.trim() || !selectedContact.value) return

  // 发送正在输入状态
  messageStore.sendTypingStatus(selectedContact.value.id)
  
  // 发送消息
  const content = messageInput.value.trim()
  messageInput.value = ''
  
  try {
    await messageStore.sendMessage(content, selectedContact.value.id)
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  } catch (error) {
    Message.error('发送消息失败，请重试')
    console.error('发送消息失败:', error)
  }
}

// 检查用户是否正在输入
const isUserTyping = computed(() => {
  if (!selectedContact.value) return false
  
  const conversationId = selectedContact.value.id
  const teacherId = selectedContact.value.id.replace('teacher-', '')
  
  return messageStore.isUserTyping(conversationId, teacherId)
})

// 处理输入框变化，发送正在输入状态
const handleInputChange = () => {
  if (!selectedContact.value) return
  messageStore.sendTypingStatus(selectedContact.value.id)
}

// 重新发送失败的消息
const resendMessage = async (messageId) => {
  try {
    await messageStore.resendMessage(messageId)
  } catch (error) {
    Message.error('重新发送消息失败')
  }
}

// 滚动到底部
const scrollToBottom = () => {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.toDateString() === today.toDateString()) {
    return '今天'
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天'
  } else {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
  }
}

// 格式化消息时间
const formatMessageTime = (timestamp) => {
  if (!timestamp) return ''

  const date = new Date(timestamp)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  return `${hours}:${minutes}`
}

// 初始化消息系统
const initializeMessages = async () => {
  try {
    // 初始化Socket连接
    messageStore.initializeSocket()
    
    // 获取对话列表
    await messageStore.fetchConversations()
    
    // 如果有对话，选择第一个
    if (messageStore.conversations.length > 0) {
      await selectContact(transformConversation(messageStore.conversations[0]))
    }
  } catch (error) {
    console.error('初始化消息系统失败:', error)
    Message.error('加载消息失败，请刷新页面重试')
  }
}



onUnmounted(() => {
  // 断开Socket连接
  messageStore.disconnectSocket()
})
</script>

<style scoped>
.messages-container {
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

.messages-content {
  display: flex;
  gap: 20px;
  height: calc(100vh - 140px);
}

.message-list-section {
  width: 320px;
  flex-shrink: 0;
}

.message-list-card {
  height: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.message-search {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

.message-tabs {
  height: calc(100% - 64px);
}

.contact-list {
  height: calc(100% - 48px);
  overflow-y: auto;
}

.contact-item {
  display: flex;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.contact-item:hover {
  background-color: #f9f9f9;
}

.contact-item.active {
  background-color: #f0f7ff;
}

.contact-avatar {
  margin-right: 12px;
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.contact-name {
  font-weight: 600;
  color: #1d1d1f;
}

.contact-time {
  font-size: 12px;
  color: #86868b;
}

.message-preview {
  margin: 0;
  font-size: 13px;
  color: #86868b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-preview.unread {
  color: #1d1d1f;
  font-weight: 500;
}

.chat-section {
  flex: 1;
  min-width: 0;
}

.chat-card {
  height: 100%;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-contact-name {
  font-weight: 600;
  font-size: 16px;
  margin-right: 8px;
}

.chat-contact-status {
  font-size: 12px;
}

.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background-color: #f9f9fb;
}

.chat-date-divider {
  text-align: center;
  margin: 16px 0;
  position: relative;
}

.chat-date-divider::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
  background-color: #e5e5ea;
  z-index: 1;
}

.chat-date-divider span {
  background-color: #f9f9fb;
  padding: 0 16px;
  font-size: 12px;
  color: #86868b;
  position: relative;
  z-index: 2;
}

.message-item {
  display: flex;
  margin-bottom: 16px;
}

.message-sent {
  justify-content: flex-end;
}

.message-received {
  justify-content: flex-start;
}

.message-system {
  justify-content: center;
}

.message-system .message-bubble {
  background-color: #f2f2f7;
  color: #8e8e93;
  font-size: 12px;
  padding: 6px 12px;
  border-radius: 12px;
  max-width: 80%;
}

.message-avatar {
  margin: 0 8px;
  align-self: flex-end;
}

.message-content {
  max-width: 70%;
}

.message-bubble {
  padding: 10px 14px;
  border-radius: 18px;
  position: relative;
}

.message-sent .message-bubble {
  background-color: #0a84ff;
  color: white;
  border-bottom-right-radius: 4px;
}

.message-received .message-bubble {
  background-color: white;
  color: #1d1d1f;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-bubble p {
  margin: 0;
  line-height: 1.4;
}

.message-time {
  font-size: 11px;
  color: #86868b;
  margin-top: 4px;
  text-align: right;
}

.message-received .message-time {
  text-align: left;
}

.typing-indicator {
  display: flex;
  padding: 10px 14px;
  width: fit-content;
  background-color: white;
  border-radius: 18px;
  border-bottom-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.typing-dot {
  width: 8px;
  height: 8px;
  margin: 0 2px;
  background-color: #c7c7cc;
  border-radius: 50%;
  animation: typing-animation 1.4s infinite ease-in-out;
}

.typing-dot:nth-child(1) {
  animation-delay: 0s;
}

.typing-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing-animation {
  0%,
  60%,
  100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-top: 1px solid #f0f0f0;
}

.input-actions {
  display: flex;
  margin-right: 8px;
}

.input-field {
  flex: 1;
}

.send-button {
  margin-left: 8px;
}

.empty-chat {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  border-radius: 12px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .messages-content {
    flex-direction: column;
    height: auto;
  }

  .message-list-section {
    width: 100%;
    margin-bottom: 20px;
  }

  .chat-section {
    height: 60vh;
  }
}
</style>

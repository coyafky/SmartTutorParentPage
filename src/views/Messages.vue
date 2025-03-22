<template>
  <div class="messages-container">
    <!-- 页面标题 -->
    <h1 class="page-title">消息中心</h1>
    
    <div class="messages-content">
      <!-- 左侧：消息列表 -->
      <div class="message-list-section">
        <a-card :bordered="false" class="message-list-card">
          <div class="message-search">
            <a-input-search placeholder="搜索联系人" allow-clear />
          </div>
          
          <div class="message-tabs">
            <a-tabs default-active-key="all">
              <a-tab-pane key="all" title="全部">
                <div class="contact-list">
                  <div 
                    v-for="contact in contacts" 
                    :key="contact.id" 
                    class="contact-item"
                    :class="{ 'active': selectedContact && selectedContact.id === contact.id }"
                    @click="selectContact(contact)"
                  >
                    <div class="contact-avatar">
                      <a-badge :count="contact.unreadCount" :dot="contact.unreadCount > 0">
                        <a-avatar :size="46" :src="contact.avatar">{{ contact.name.charAt(0) }}</a-avatar>
                      </a-badge>
                    </div>
                    <div class="contact-info">
                      <div class="contact-header">
                        <span class="contact-name">{{ contact.name }}</span>
                        <span class="contact-time">{{ contact.lastMessageTime }}</span>
                      </div>
                      <div class="contact-message">
                        <p class="message-preview" :class="{ 'unread': contact.unreadCount > 0 }">
                          {{ contact.lastMessage }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </a-tab-pane>
              <a-tab-pane key="unread" title="未读">
                <div class="contact-list">
                  <div 
                    v-for="contact in unreadContacts" 
                    :key="contact.id" 
                    class="contact-item"
                    :class="{ 'active': selectedContact && selectedContact.id === contact.id }"
                    @click="selectContact(contact)"
                  >
                    <div class="contact-avatar">
                      <a-badge :count="contact.unreadCount">
                        <a-avatar :size="46" :src="contact.avatar">{{ contact.name.charAt(0) }}</a-avatar>
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
                'message-received': message.sender !== 'me'
              }"
            >
              <div class="message-avatar" v-if="message.sender !== 'me'">
                <a-avatar :size="36" :src="selectedContact.avatar">
                  {{ selectedContact.name.charAt(0) }}
                </a-avatar>
              </div>
              
              <div class="message-content">
                <div class="message-bubble">
                  <p>{{ message.content }}</p>
                </div>
                <div class="message-time">{{ formatMessageTime(message.timestamp) }}</div>
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
              <a-button type="primary" shape="circle" :disabled="!messageInput.trim()" @click="sendMessage">
                <template #icon><icon-send /></template>
              </a-button>
            </div>
          </div>
        </a-card>
        
        <div class="empty-chat" v-else>
          <a-empty description="选择一个联系人开始聊天">
            <template #image>
              <icon-message style="font-size: 64px; color: #C9CDD4;" />
            </template>
          </a-empty>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { 
  IconMessage, 
  IconPhone, 
  IconVideoCamera, 
  IconMore, 
  IconFaceSmileFill, 
  IconImageClose, 
  IconFile, 
  IconSend 
} from '@arco-design/web-vue/es/icon'

// 当前用户信息
const currentUser = ref({
  id: 'parent1',
  name: '张家长',
  avatar: ''
})

// 联系人列表
const contacts = ref([
  {
    id: 'tutor1',
    name: '李老师',
    avatar: '',
    lastMessage: '好的，我们可以约在周六下午2点进行第一次课程。',
    lastMessageTime: '10:30',
    unreadCount: 2,
    online: true,
    messages: [
      {
        sender: 'tutor1',
        content: '您好，我是李老师，很高兴收到您的咨询。',
        timestamp: new Date(2025, 2, 18, 10, 15)
      },
      {
        sender: 'me',
        content: '您好李老师，我想为我的孩子找一位数学家教，看到您的资料很符合我们的需求。',
        timestamp: new Date(2025, 2, 18, 10, 18)
      },
      {
        sender: 'tutor1',
        content: '非常感谢您的信任。请问您孩子现在是几年级？有什么具体的学习困难吗？',
        timestamp: new Date(2025, 2, 18, 10, 20)
      },
      {
        sender: 'me',
        content: '孩子现在初二，数学基础还可以，但是应用题和几何证明题有些困难。',
        timestamp: new Date(2025, 2, 18, 10, 22)
      },
      {
        sender: 'tutor1',
        content: '了解了。初二的几何证明确实是很多学生的难点。我有针对性的教学方法，可以帮助学生建立几何直觉和证明思路。',
        timestamp: new Date(2025, 2, 18, 10, 25)
      },
      {
        sender: 'me',
        content: '太好了，我们希望能尽快开始。您的时间安排是怎样的？',
        timestamp: new Date(2025, 2, 18, 10, 28)
      },
      {
        sender: 'tutor1',
        content: '好的，我们可以约在周六下午2点进行第一次课程。',
        timestamp: new Date(2025, 2, 18, 10, 30)
      }
    ]
  },
  {
    id: 'tutor2',
    name: '王老师',
    avatar: '',
    lastMessage: '我已经准备好了针对高考的复习资料，下次课可以带给学生。',
    lastMessageTime: '昨天',
    unreadCount: 0,
    online: false,
    messages: [
      {
        sender: 'tutor2',
        content: '张家长您好，我是王老师，很高兴能够辅导您孩子的英语学习。',
        timestamp: new Date(2025, 2, 17, 14, 30)
      },
      {
        sender: 'me',
        content: '王老师您好，感谢您接受我们的家教邀请。',
        timestamp: new Date(2025, 2, 17, 14, 35)
      },
      {
        sender: 'tutor2',
        content: '不客气。根据您提供的情况，我想先了解一下您孩子目前的英语水平和具体需要提升的方面。',
        timestamp: new Date(2025, 2, 17, 14, 40)
      },
      {
        sender: 'me',
        content: '孩子现在高二，英语成绩中等，阅读理解和写作比较薄弱。',
        timestamp: new Date(2025, 2, 17, 14, 45)
      },
      {
        sender: 'tutor2',
        content: '明白了。高中阶段的阅读理解和写作确实是得分的关键。我会针对这两个方面设计教学计划。',
        timestamp: new Date(2025, 2, 17, 14, 50)
      },
      {
        sender: 'me',
        content: '太感谢了，我们希望能在高考前有明显提升。',
        timestamp: new Date(2025, 2, 17, 14, 55)
      },
      {
        sender: 'tutor2',
        content: '我已经准备好了针对高考的复习资料，下次课可以带给学生。',
        timestamp: new Date(2025, 2, 17, 15, 0)
      }
    ]
  },
  {
    id: 'tutor3',
    name: '张老师',
    avatar: '',
    lastMessage: '我们可以先安排一次免费的试听课，看看教学效果如何？',
    lastMessageTime: '3天前',
    unreadCount: 0,
    online: true,
    messages: [
      {
        sender: 'tutor3',
        content: '您好，我是张老师，擅长物理教学。',
        timestamp: new Date(2025, 2, 15, 9, 10)
      },
      {
        sender: 'me',
        content: '张老师您好，我看了您的简介，想咨询一下物理辅导的事情。',
        timestamp: new Date(2025, 2, 15, 9, 15)
      },
      {
        sender: 'tutor3',
        content: '您好，很高兴收到您的咨询。请问是哪个年级的物理辅导呢？',
        timestamp: new Date(2025, 2, 15, 9, 20)
      },
      {
        sender: 'me',
        content: '是高一的物理，孩子刚开始接触物理，有些概念理解不透彻。',
        timestamp: new Date(2025, 2, 15, 9, 25)
      },
      {
        sender: 'tutor3',
        content: '高一物理是打基础的关键时期。我的教学方法注重概念理解和实际应用，通过生活中的例子来解释物理现象。',
        timestamp: new Date(2025, 2, 15, 9, 30)
      },
      {
        sender: 'me',
        content: '听起来很适合我们的需求，不知道您的收费标准是怎样的？',
        timestamp: new Date(2025, 2, 15, 9, 35)
      },
      {
        sender: 'tutor3',
        content: '我们可以先安排一次免费的试听课，看看教学效果如何？',
        timestamp: new Date(2025, 2, 15, 9, 40)
      }
    ]
  }
])

// 未读消息联系人
const unreadContacts = computed(() => {
  return contacts.value.filter(contact => contact.unreadCount > 0)
})

// 当前选中的联系人
const selectedContact = ref(null)

// 消息输入框
const messageInput = ref('')

// 是否正在输入
const isTyping = ref(false)

// 聊天消息容器引用
const chatMessagesRef = ref(null)

// 选择联系人
const selectContact = (contact) => {
  selectedContact.value = contact
  // 清除未读消息计数
  contact.unreadCount = 0
  
  // 滚动到最新消息
  nextTick(() => {
    scrollToBottom()
  })
}

// 发送消息
const sendMessage = () => {
  if (!messageInput.value.trim() || !selectedContact.value) return
  
  // 添加新消息
  selectedContact.value.messages.push({
    sender: 'me',
    content: messageInput.value,
    timestamp: new Date()
  })
  
  // 更新最后一条消息
  selectedContact.value.lastMessage = messageInput.value
  selectedContact.value.lastMessageTime = '刚刚'
  
  // 清空输入框
  messageInput.value = ''
  
  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
  
  // 模拟回复
  simulateReply()
}

// 模拟回复
const simulateReply = () => {
  if (!selectedContact.value) return
  
  // 显示正在输入状态
  isTyping.value = true
  
  // 随机回复时间 (1-3秒)
  const replyDelay = Math.floor(Math.random() * 2000) + 1000
  
  setTimeout(() => {
    // 隐藏正在输入状态
    isTyping.value = false
    
    // 随机回复内容
    const replies = [
      '好的，我明白了。',
      '这个问题我们可以这样解决...',
      '您说的很有道理，我们可以试试看。',
      '非常感谢您的信任，我会尽力做好。',
      '下次课我们可以重点讲解这个知识点。'
    ]
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)]
    
    // 添加回复消息
    selectedContact.value.messages.push({
      sender: selectedContact.value.id,
      content: randomReply,
      timestamp: new Date()
    })
    
    // 更新最后一条消息
    selectedContact.value.lastMessage = randomReply
    selectedContact.value.lastMessageTime = '刚刚'
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  }, replyDelay)
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

onMounted(() => {
  // 默认选择第一个联系人
  if (contacts.value.length > 0) {
    selectContact(contacts.value[0])
  }
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
  0%, 60%, 100% {
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

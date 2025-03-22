<template>
  <div class="profile-container">
    <a-row :gutter="16">
      <a-col :span="24">
        <a-card title="个人资料" :style="{ marginBottom: '16px' }">
          <template #extra>
            <a-space>
              <a-button type="primary" @click="handleSubmit" :loading="loading.profile">保存</a-button>
            </a-space>
          </template>
          <a-form :model="parentProfile" layout="vertical">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item field="nickname" label="昵称">
                  <a-input v-model="parentProfile.nickname" placeholder="请输入昵称" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-divider>联系信息</a-divider>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="contactInfo.phone" label="联系电话">
                  <a-input v-model="parentProfile.contactInfo.phone" placeholder="请输入联系电话" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="contactInfo.email" label="邮箱">
                  <a-input v-model="parentProfile.contactInfo.email" placeholder="请输入邮箱" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="contactInfo.wechat" label="微信">
                  <a-input v-model="parentProfile.contactInfo.wechat" placeholder="请输入微信号" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-divider>居住地址</a-divider>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="location.province" label="省份">
                  <a-input v-model="parentProfile.location.province" placeholder="请输入省份" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="location.city" label="城市">
                  <a-input v-model="parentProfile.location.city" placeholder="请输入城市" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="location.district" label="区/县">
                  <a-input v-model="parentProfile.location.district" placeholder="请输入区/县" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item field="location.address" label="详细地址">
                  <a-input v-model="parentProfile.location.address" placeholder="请输入详细地址" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :span="24">
        <a-card title="教学偏好设置" :style="{ marginBottom: '16px' }">
          <template #extra>
            <a-space>
              <a-button type="primary" @click="handlePreferencesSubmit" :loading="loading.preferences">保存</a-button>
            </a-space>
          </template>
          <a-form :model="parentProfile.preferences" layout="vertical">
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item field="preferredGender" label="期望教师性别">
                  <a-radio-group v-model="parentProfile.preferences.preferredGender">
                    <a-radio value="男">男</a-radio>
                    <a-radio value="女">女</a-radio>
                    <a-radio value="不限">不限</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="preferredAgeRange.min" label="期望教师最小年龄">
                  <a-input-number v-model="parentProfile.preferences.preferredAgeRange.min" :min="18" :max="60" style="width: 100%" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item field="preferredAgeRange.max" label="期望教师最大年龄">
                  <a-input-number v-model="parentProfile.preferences.preferredAgeRange.max" :min="18" :max="60" style="width: 100%" />
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item field="preferredTeachingStyle" label="期望教学风格">
                  <a-select v-model="parentProfile.preferences.preferredTeachingStyle" multiple placeholder="请选择教学风格">
                    <a-option value="耐心">耐心</a-option>
                    <a-option value="严格">严格</a-option>
                    <a-option value="活泼">活泼</a-option>
                    <a-option value="幽默">幽默</a-option>
                    <a-option value="细致">细致</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item field="preferredQualifications" label="期望教师资质">
                  <a-select v-model="parentProfile.preferences.preferredQualifications" multiple placeholder="请选择教师资质">
                    <a-option value="本科">本科</a-option>
                    <a-option value="研究生">研究生</a-option>
                    <a-option value="博士">博士</a-option>
                    <a-option value="教师资格证">教师资格证</a-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            
            <a-row>
              <a-col :span="24">
                <a-form-item field="otherRequirements" label="其他要求">
                  <a-textarea v-model="parentProfile.preferences.otherRequirements" placeholder="请输入其他要求" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="16">
      <a-col :span="24">
        <a-card title="子女信息" :style="{ marginBottom: '16px' }">
          <template #extra>
            <a-button type="primary" @click="showChildModal('add')">添加子女</a-button>
          </template>
          
          <div v-if="children.length === 0" class="empty-children">
            <a-empty description="暂无子女信息">
              <template #image>
                <icon-user-group style="font-size: 48px; color: #C9CDD4" />
              </template>
              <a-button type="primary" @click="showChildModal('add')">添加子女</a-button>
            </a-empty>
          </div>
          
          <a-row :gutter="16" v-else>
            <a-col :span="8" v-for="child in children" :key="child._id">
              <a-card class="child-card" :style="{ marginBottom: '16px' }">
                <template #cover>
                  <div class="child-card-header" :class="child.gender === '男' ? 'male' : 'female'">
                    <a-avatar :size="64" :style="{ backgroundColor: child.gender === '男' ? '#165DFF' : '#FF7D00' }">
                      {{ child.name.charAt(0) }}
                    </a-avatar>
                    <div class="child-info">
                      <h3>{{ child.name }}</h3>
                      <p>{{ child.age }}岁 | {{ child.grade }} | {{ child.school }}</p>
                    </div>
                  </div>
                </template>
                <a-descriptions :column="1" layout="vertical" size="small">
                  <a-descriptions-item label="学习科目">
                    <a-space wrap>
                      <a-tag v-for="subject in child.subjects" :key="subject.name">
                        {{ subject.name }} ({{ subject.level }})
                      </a-tag>
                    </a-space>
                  </a-descriptions-item>
                  <a-descriptions-item label="学习风格">{{ child.learningStyle }}</a-descriptions-item>
                  <a-descriptions-item label="性格特点">{{ child.personality }}</a-descriptions-item>
                  <a-descriptions-item label="兴趣爱好">{{ child.hobbies.join(', ') }}</a-descriptions-item>
                </a-descriptions>
                <template #actions>
                  <a-button type="text" @click="showChildModal('edit', child)">编辑</a-button>
                  <a-button type="text" status="danger" @click="confirmDeleteChild(child)">删除</a-button>
                </template>
              </a-card>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
  </div>
  
  <!-- 子女信息编辑弹窗 -->
  <a-modal
    v-model:visible="childModal.visible"
    :title="childModal.isAdd ? '添加子女信息' : '编辑子女信息'"
    @cancel="childModal.visible = false"
    @before-ok="handleChildSubmit"
    unmountOnClose
  >
    <a-form :model="childForm" layout="vertical">
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="name" label="姓名" required>
            <a-input v-model="childForm.name" placeholder="请输入姓名" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="gender" label="性别" required>
            <a-radio-group v-model="childForm.gender">
              <a-radio value="男">男</a-radio>
              <a-radio value="女">女</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item field="age" label="年龄" required>
            <a-input-number v-model="childForm.age" :min="3" :max="18" style="width: 100%" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="grade" label="年级" required>
            <a-select v-model="childForm.grade" placeholder="请选择年级">
              <a-option value="幼儿园">幼儿园</a-option>
              <a-option value="小学一年级">小学一年级</a-option>
              <a-option value="小学二年级">小学二年级</a-option>
              <a-option value="小学三年级">小学三年级</a-option>
              <a-option value="小学四年级">小学四年级</a-option>
              <a-option value="小学五年级">小学五年级</a-option>
              <a-option value="小学六年级">小学六年级</a-option>
              <a-option value="初中一年级">初中一年级</a-option>
              <a-option value="初中二年级">初中二年级</a-option>
              <a-option value="初中三年级">初中三年级</a-option>
              <a-option value="高中一年级">高中一年级</a-option>
              <a-option value="高中二年级">高中二年级</a-option>
              <a-option value="高中三年级">高中三年级</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item field="school" label="学校">
            <a-input v-model="childForm.school" placeholder="请输入学校" />
          </a-form-item>
        </a-col>
      </a-row>
      
      <a-divider>学习情况</a-divider>
      
      <div v-for="(subject, index) in childForm.subjects" :key="index" style="margin-bottom: 16px; padding: 16px; border: 1px dashed #e5e6eb; border-radius: 4px;">
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item :field="`subjects[${index}].name`" label="科目" required>
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
          </a-col>
          <a-col :span="6">
            <a-form-item :field="`subjects[${index}].level`" label="水平">
              <a-select v-model="subject.level" placeholder="请选择水平">
                <a-option value="优秀">优秀</a-option>
                <a-option value="良好">良好</a-option>
                <a-option value="中等">中等</a-option>
                <a-option value="较差">较差</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item :field="`subjects[${index}].targetScore`" label="目标分数">
              <a-input-number v-model="subject.targetScore" :min="0" :max="100" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :span="6" style="display: flex; align-items: flex-end;">
            <a-button status="danger" @click="removeSubject(index)" style="margin-bottom: 8px;">
              <template #icon><icon-delete /></template>
            </a-button>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item :field="`subjects[${index}].learningNeeds`" label="学习需求">
              <a-input v-model="subject.learningNeeds" placeholder="请输入学习需求" />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      
      <a-button type="dashed" long @click="addSubject" style="margin-bottom: 16px;">
        <template #icon><icon-plus /></template>
        添加科目
      </a-button>
      
      <a-divider>其他信息</a-divider>
      
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="learningStyle" label="学习风格">
            <a-select v-model="childForm.learningStyle" placeholder="请选择学习风格">
              <a-option value="视觉学习型">视觉学习型</a-option>
              <a-option value="听觉学习型">听觉学习型</a-option>
              <a-option value="动手学习型">动手学习型</a-option>
              <a-option value="逻辑思考型">逻辑思考型</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="personality" label="性格特点">
            <a-select v-model="childForm.personality" placeholder="请选择性格特点">
              <a-option value="外向">外向</a-option>
              <a-option value="内向">内向</a-option>
              <a-option value="活泼">活泼</a-option>
              <a-option value="安静">安静</a-option>
              <a-option value="自信">自信</a-option>
              <a-option value="谨慎">谨慎</a-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      
      <a-row :gutter="16">
        <a-col :span="12">
          <a-form-item field="hobbies" label="兴趣爱好">
            <a-select v-model="childForm.hobbies" multiple placeholder="请选择兴趣爱好">
              <a-option value="阅读">阅读</a-option>
              <a-option value="绘画">绘画</a-option>
              <a-option value="音乐">音乐</a-option>
              <a-option value="体育">体育</a-option>
              <a-option value="舞蹈">舞蹈</a-option>
              <a-option value="编程">编程</a-option>
              <a-option value="手工">手工</a-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item field="specialNeeds" label="特殊需求">
            <a-input v-model="childForm.specialNeeds" placeholder="请输入特殊需求" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { Message, Modal } from '@arco-design/web-vue'
import { useUserStore } from '../stores/user'
import { parentProfileAPI } from '../utils/parentAPI'
import { IconUserGroup, IconDelete, IconPlus } from '@arco-design/web-vue/es/icon'

const userStore = useUserStore()
const parentId = userStore.userInfo.customId

// 加载状态
const loading = reactive({
  profile: false,
  preferences: false,
  children: false,
  childOperation: false
})

// 家长档案信息
const parentProfile = ref({
  parentId: '',
  nickname: '',
  location: {
    province: '',
    city: '',
    district: '',
    address: ''
  },
  contactInfo: {
    phone: '',
    email: '',
    wechat: ''
  },
  preferences: {
    preferredGender: '不限',
    preferredAgeRange: {
      min: 25,
      max: 45
    },
    preferredTeachingStyle: [],
    preferredQualifications: [],
    otherRequirements: ''
  }
})

// 子女信息列表
const children = ref([])

// 子女信息表单
const childForm = ref({
  name: '',
  gender: '男',
  age: 10,
  grade: '',
  school: '',
  subjects: [
    {
      name: '',
      level: '中等',
      targetScore: 90,
      learningNeeds: ''
    }
  ],
  learningStyle: '',
  personality: '',
  hobbies: [],
  specialNeeds: ''
})

// 子女模态框状态
const childModal = reactive({
  visible: false,
  isAdd: true,
  currentChildId: ''
})

// 获取家长档案信息
const fetchParentProfile = async () => {
  try {
    loading.profile = true
    const response = await parentProfileAPI.getProfile(parentId)
    if (response.status === 'success') {
      parentProfile.value = response.data.profile
    }
  } catch (error) {
    console.error('获取家长档案失败:', error)
    // 如果是404错误，说明档案不存在，不需要提示错误
    if (error.status !== 404) {
      Message.error('获取家长档案失败')
    }
  } finally {
    loading.profile = false
  }
}

// 获取子女信息列表
const fetchChildren = async () => {
  try {
    loading.children = true
    const response = await parentProfileAPI.getChildren(parentId)
    if (response.status === 'success') {
      children.value = response.data.children
    }
  } catch (error) {
    console.error('获取子女信息失败:', error)
    // 如果是404错误，说明档案不存在，不需要提示错误
    if (error.status !== 404) {
      Message.error('获取子女信息失败')
    }
  } finally {
    loading.children = false
  }
}

// 保存家长档案信息
const handleSubmit = async () => {
  try {
    loading.profile = true
    let response
    
    // 确保parentId设置正确
    parentProfile.value.parentId = parentId
    
    // 检查是否已有档案，决定是创建还是更新
    const checkResponse = await parentProfileAPI.getProfile(parentId).catch(() => null)
    
    if (checkResponse && checkResponse.status === 'success') {
      // 更新档案
      response = await parentProfileAPI.updateProfile(parentId, parentProfile.value)
      if (response.status === 'success') {
        Message.success('个人信息更新成功')
      }
    } else {
      // 创建档案
      response = await parentProfileAPI.createProfile(parentProfile.value)
      if (response.status === 'success') {
        Message.success('个人信息创建成功')
      }
    }
  } catch (error) {
    console.error('保存个人信息失败:', error)
    Message.error('保存失败，请重试')
  } finally {
    loading.profile = false
  }
}

// 保存教学偏好设置
const handlePreferencesSubmit = async () => {
  try {
    loading.preferences = true
    
    // 确保parentId设置正确
    parentProfile.value.parentId = parentId
    
    // 只更新preferences部分
    const response = await parentProfileAPI.updateProfile(parentId, {
      preferences: parentProfile.value.preferences
    })
    
    if (response.status === 'success') {
      Message.success('偏好设置保存成功')
    }
  } catch (error) {
    console.error('保存偏好设置失败:', error)
    Message.error('保存失败，请重试')
  } finally {
    loading.preferences = false
  }
}

// 显示子女信息编辑模态框
const showChildModal = (type, child = null) => {
  childModal.isAdd = type === 'add'
  
  if (type === 'add') {
    // 重置表单
    childForm.value = {
      name: '',
      gender: '男',
      age: 10,
      grade: '',
      school: '',
      subjects: [
        {
          name: '',
          level: '中等',
          targetScore: 90,
          learningNeeds: ''
        }
      ],
      learningStyle: '',
      personality: '',
      hobbies: [],
      specialNeeds: ''
    }
    childModal.currentChildId = ''
  } else {
    // 编辑模式，填充表单
    childForm.value = JSON.parse(JSON.stringify(child)) // 深拷贝
    childModal.currentChildId = child._id
  }
  
  childModal.visible = true
}

// 添加科目
const addSubject = () => {
  childForm.value.subjects.push({
    name: '',
    level: '中等',
    targetScore: 90,
    learningNeeds: ''
  })
}

// 移除科目
const removeSubject = (index) => {
  if (childForm.value.subjects.length > 1) {
    childForm.value.subjects.splice(index, 1)
  } else {
    Message.warning('至少需要一个科目')
  }
}

// 提交子女信息表单
const handleChildSubmit = async (done) => {
  try {
    loading.childOperation = true
    
    // 表单验证
    if (!childForm.value.name) {
      Message.error('请输入姓名')
      done(false)
      return
    }
    
    if (!childForm.value.gender) {
      Message.error('请选择性别')
      done(false)
      return
    }
    
    if (!childForm.value.age) {
      Message.error('请输入年龄')
      done(false)
      return
    }
    
    if (!childForm.value.grade) {
      Message.error('请选择年级')
      done(false)
      return
    }
    
    // 验证每个科目是否填写了名称
    for (const subject of childForm.value.subjects) {
      if (!subject.name) {
        Message.error('请选择科目名称')
        done(false)
        return
      }
    }
    
    let response
    
    if (childModal.isAdd) {
      // 添加子女信息
      response = await parentProfileAPI.addChild(parentId, childForm.value)
      if (response.status === 'success') {
        Message.success('添加子女信息成功')
        // 刷新子女列表
        await fetchChildren()
      }
    } else {
      // 更新子女信息
      response = await parentProfileAPI.updateChild(parentId, childModal.currentChildId, childForm.value)
      if (response.status === 'success') {
        Message.success('更新子女信息成功')
        // 刷新子女列表
        await fetchChildren()
      }
    }
    
    done(true) // 关闭模态框
  } catch (error) {
    console.error('保存子女信息失败:', error)
    Message.error('保存失败，请重试')
    done(false) // 不关闭模态框
  } finally {
    loading.childOperation = false
  }
}

// 确认删除子女信息
const confirmDeleteChild = (child) => {
  Modal.warning({
    title: '确认删除',
    content: `确定要删除 ${child.name} 的信息吗？此操作不可恢复。`,
    okText: '删除',
    cancelText: '取消',
    onOk: async () => {
      await deleteChild(child._id)
    }
  })
}

// 删除子女信息
const deleteChild = async (childId) => {
  try {
    loading.childOperation = true
    const response = await parentProfileAPI.deleteChild(parentId, childId)
    if (response.status === 'success' || response.status === 204) {
      Message.success('删除子女信息成功')
      // 刷新子女列表
      await fetchChildren()
    }
  } catch (error) {
    console.error('删除子女信息失败:', error)
    Message.error('删除失败，请重试')
  } finally {
    loading.childOperation = false
  }
}

// 在组件挂载时获取数据
onMounted(async () => {
  if (parentId) {
    await fetchParentProfile()
    await fetchChildren()
  } else {
    Message.error('用户ID不存在，请重新登录')
  }
})
</script>

<style scoped>
.profile-container {
  max-width: 800px;
  margin: 20px auto;
  padding: 0 16px;
}

.arco-card {
  border-radius: 8px;
}

.arco-form-item {
  margin-bottom: 24px;
}
</style>

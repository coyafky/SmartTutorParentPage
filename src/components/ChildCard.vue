<template>
  <div class="child-cards-container">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
        <icon-user-group class="mr-3 text-blue-500" />
        <span class="relative">
          子女信息管理
          <span class="absolute bottom-0 left-0 w-full h-1 bg-blue-500 rounded-full opacity-70"></span>
        </span>
      </h2>
      <a-button type="primary" @click="showAddChildModal" class="bg-blue-500 hover:bg-blue-600 border-none shadow-md hover:shadow-lg transition-all duration-300 px-4 py-1">
        <template #icon><icon-plus class="text-white" /></template>
        <span class="font-medium">添加子女</span>
      </a-button>
    </div>

    <!-- 子女列表 -->
    <a-spin :loading="loading">
      <div v-if="children.length === 0" class="empty-children py-16 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
        <a-empty description="暂无子女信息">
          <template #image>
            <div class="flex justify-center items-center h-24 w-24 bg-blue-50 dark:bg-blue-900/20 rounded-full mx-auto mb-4">
              <icon-user-group class="text-6xl text-blue-400 dark:text-blue-300" />
            </div>
          </template>
          <div class="text-gray-500 dark:text-gray-400 mb-6">添加子女信息以便我们为您推荐合适的家教</div>
          <a-button type="primary" @click="showAddChildModal" class="mt-4 bg-blue-500 hover:bg-blue-600 border-none shadow-md hover:shadow-lg transition-all duration-300 px-6">
            <template #icon><icon-plus class="text-white" /></template>
            <span class="font-medium">添加子女信息</span>
          </a-button>
        </a-empty>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="child in children" :key="child.childId" class="child-card bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700">
          <div class="child-card-header p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 flex justify-between items-center">
            <div class="flex items-center">
              <a-avatar :style="{ backgroundColor: getAvatarColor(child.nickname) }" class="text-lg font-bold shadow-sm">
                {{ child.nickname ? child.nickname.charAt(0).toUpperCase() : 'C' }}
              </a-avatar>
              <div class="ml-3">
                <h3 class="text-lg font-medium text-gray-800 dark:text-gray-200">{{ child.nickname }}</h3>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ child.gender === '男' ? '男生' : '女生' }} · {{ child.grade || '年级未设置' }}
                </div>
              </div>
            </div>
            <div>
              <a-tag color="blue">{{ child.learningStyle || '学习风格未设置' }}</a-tag>
            </div>
          </div>

          <div class="p-4">
            <div class="mb-3">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">学校</div>
              <div class="text-gray-800 dark:text-gray-200">{{ child.school || '未设置' }}</div>
            </div>

            <div class="mb-3">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">学习科目</div>
              <div class="flex flex-wrap gap-2">
                <a-tag 
                  v-for="(subject, index) in child.subjects" 
                  :key="index"
                  :color="getSubjectColor(subject.name)"
                >
                  {{ subject.name }}
                  <span class="ml-1 text-xs">
                    {{ subject.currentScore ? subject.currentScore + '→' : '' }}{{ subject.targetScore || '目标分数未设置' }}
                  </span>
                </a-tag>
                <a-tag v-if="!child.subjects || child.subjects.length === 0" color="gray">暂无科目</a-tag>
              </div>
            </div>

            <div class="mb-3">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">性格特点</div>
              <div class="text-gray-800 dark:text-gray-200">{{ child.personality || '未设置' }}</div>
            </div>

            <div>
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">兴趣爱好</div>
              <div class="flex flex-wrap gap-2">
                <a-tag v-for="(hobby, index) in child.hobbies" :key="index" color="green">
                  {{ hobby }}
                </a-tag>
                <a-tag v-if="!child.hobbies || child.hobbies.length === 0" color="gray">暂无兴趣爱好</a-tag>
              </div>
            </div>
          </div>

          <div class="child-card-actions p-4 border-t border-gray-100 dark:border-gray-700 flex justify-end bg-gray-50 dark:bg-gray-800/50">
            <a-button type="text" @click="showEditChildModal(child)" class="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300 mr-3">
              <template #icon><icon-edit /></template>
              <span class="font-medium">编辑</span>
            </a-button>
            <a-button type="text" @click="confirmDeleteChild(child.childId)" status="danger" class="hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300">
              <template #icon><icon-delete /></template>
              <span class="font-medium">删除</span>
            </a-button>
          </div>
        </div>
      </div>
    </a-spin>

    <!-- 子女信息编辑对话框 -->
    <a-modal
      v-model:visible="childModalVisible"
      :title="isEditingChild ? '编辑子女信息' : '添加子女信息'"
      @cancel="closeChildModal"
      @before-ok="submitChildForm"
      unmountOnClose
      :mask-closable="false"
      :esc-to-close="false"
    >
      <a-form :model="childForm" layout="vertical">
        <a-form-item field="nickname" label="昵称" required>
          <a-input v-model="childForm.nickname" placeholder="请输入昵称" allow-clear class="rounded-lg" />
        </a-form-item>

        <a-row :gutter="16">
          <a-col :span="12">
            <a-form-item field="gender" label="性别">
              <a-radio-group v-model="childForm.gender">
                <a-radio value="男">男</a-radio>
                <a-radio value="女">女</a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item field="grade" label="年级" required>
              <a-select v-model="childForm.grade" placeholder="请选择年级" allow-clear class="rounded-lg">
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
        </a-row>

        <a-form-item field="school" label="学校">
          <a-input v-model="childForm.school" placeholder="请输入学校" allow-clear class="rounded-lg" />
        </a-form-item>

        <div class="section-title flex items-center mt-5 mb-3">
          <div class="h-6 w-1.5 bg-blue-500 rounded-r mr-3"></div>
          <h3 class="text-base font-semibold text-gray-800 dark:text-gray-200">学习科目</h3>
          <a-button type="text" @click="addSubject" class="ml-auto text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors duration-300">
            <template #icon><icon-plus /></template>
            添加科目
          </a-button>
        </div>

        <div v-for="(subject, index) in childForm.subjects" :key="index" class="subject-item mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div class="flex justify-between items-center mb-2">
            <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300">科目 {{ index + 1 }}</h4>
            <a-button type="text" @click="removeSubject(index)" status="danger" size="small">
              <template #icon><icon-delete /></template>
            </a-button>
          </div>
          <a-row :gutter="16">
            <a-col :span="24" :md="8">
              <a-form-item :field="`subjects[${index}].name`" label="科目名称" required>
                <a-select v-model="subject.name" placeholder="请选择科目" allow-clear class="rounded-lg">
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
            <a-col :span="12" :md="8">
              <a-form-item :field="`subjects[${index}].currentScore`" label="当前分数">
                <a-input-number
                  v-model="subject.currentScore"
                  placeholder="当前分数"
                  class="w-full rounded-lg"
                  :min="0"
                  :max="150"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12" :md="8">
              <a-form-item :field="`subjects[${index}].targetScore`" label="目标分数">
                <a-input-number
                  v-model="subject.targetScore"
                  placeholder="目标分数"
                  class="w-full rounded-lg"
                  :min="0"
                  :max="150"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-form-item :field="`subjects[${index}].difficulty`" label="难度">
            <a-select v-model="subject.difficulty" placeholder="请选择难度" allow-clear class="rounded-lg">
              <a-option value="简单">简单</a-option>
              <a-option value="中等">中等</a-option>
              <a-option value="困难">困难</a-option>
            </a-select>
          </a-form-item>
        </div>

        <a-form-item field="learningStyle" label="学习风格">
          <a-select v-model="childForm.learningStyle" placeholder="请选择学习风格" allow-clear class="rounded-lg">
            <a-option value="视觉型">视觉型</a-option>
            <a-option value="听觉型">听觉型</a-option>
            <a-option value="动手型">动手型</a-option>
            <a-option value="逻辑型">逻辑型</a-option>
            <a-option value="社交型">社交型</a-option>
            <a-option value="独立型">独立型</a-option>
          </a-select>
        </a-form-item>

        <a-form-item field="personality" label="性格">
          <a-select v-model="childForm.personality" placeholder="请选择性格特点" allow-clear class="rounded-lg">
            <a-option value="外向">外向</a-option>
            <a-option value="内向">内向</a-option>
            <a-option value="活泼">活泼</a-option>
            <a-option value="安静">安静</a-option>
            <a-option value="自信">自信</a-option>
            <a-option value="谨慎">谨慎</a-option>
            <a-option value="创新">创新</a-option>
            <a-option value="传统">传统</a-option>
          </a-select>
        </a-form-item>

        <a-form-item field="hobbies" label="兴趣爱好">
          <a-select
            v-model="childForm.hobbies"
            placeholder="请选择兴趣爱好"
            multiple
            allow-create
            allow-clear
            class="rounded-lg"
          >
            <a-option value="阅读">阅读</a-option>
            <a-option value="绘画">绘画</a-option>
            <a-option value="音乐">音乐</a-option>
            <a-option value="体育">体育</a-option>
            <a-option value="舞蹈">舞蹈</a-option>
            <a-option value="科学">科学</a-option>
            <a-option value="编程">编程</a-option>
            <a-option value="手工">手工</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { Message } from '@arco-design/web-vue';

export default {
  name: 'ChildCard',
  props: {
    children: {
      type: Array,
      default: () => [],
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      childModalVisible: false,
      isEditingChild: false,
      childForm: {
        childId: '',
        nickname: '',
        gender: '男',
        grade: '',
        school: '',
        subjects: [
          {
            name: '',
            currentScore: '',
            targetScore: '',
            difficulty: '中等',
          },
        ],
        learningStyle: '',
        personality: '',
        hobbies: [],
      },
      defaultChildForm: {
        childId: '',
        nickname: '',
        gender: '男',
        grade: '',
        school: '',
        subjects: [
          {
            name: '',
            currentScore: '',
            targetScore: '',
            difficulty: '中等',
          },
        ],
        learningStyle: '',
        personality: '',
        hobbies: [],
      },
    };
  },
  methods: {
    showAddChildModal() {
      this.isEditingChild = false;
      this.childForm = JSON.parse(JSON.stringify(this.defaultChildForm));
      this.childModalVisible = true;
    },
    
    showEditChildModal(child) {
      this.isEditingChild = true;
      this.childForm = JSON.parse(JSON.stringify(child));
      this.childModalVisible = true;
    },
    
    closeChildModal() {
      this.childModalVisible = false;
      this.childForm = JSON.parse(JSON.stringify(this.defaultChildForm));
    },
    
    addSubject() {
      this.childForm.subjects.push({
        name: '',
        currentScore: '',
        targetScore: '',
        difficulty: '中等',
      });
    },
    
    removeSubject(index) {
      this.childForm.subjects.splice(index, 1);
      if (this.childForm.subjects.length === 0) {
        this.addSubject();
      }
    },
    
    async submitChildForm() {
      try {
        if (!this.childForm.nickname) {
          Message.error('请输入子女昵称');
          return false;
        }
        if (!this.childForm.grade) {
          Message.error('请选择子女年级');
          return false;
        }

        // 验证科目信息
        const validSubjects = this.childForm.subjects.filter(subject => subject.name);
        if (validSubjects.length === 0) {
          Message.error('请至少添加一个学习科目');
          return false;
        }
        this.childForm.subjects = validSubjects;

        if (this.isEditingChild) {
          // 更新子女信息
          this.$emit('update-child', this.childForm);
        } else {
          // 添加子女信息
          this.$emit('add-child', this.childForm);
        }
        return true;
      } catch (error) {
        console.error('提交子女信息失败:', error);
        Message.error('提交子女信息失败，请稍后重试');
        return false;
      }
    },
    
    confirmDeleteChild(childId) {
      this.$modal.warning({
        title: '确认删除',
        content: '您确定要删除该子女信息吗？此操作不可逆。',
        okText: '删除',
        cancelText: '取消',
        onOk: () => this.$emit('delete-child', childId),
      });
    },
    
    getAvatarColor(nickname) {
      if (!nickname) return '#2080f0';
      
      const colors = [
        '#2080f0', // 蓝色
        '#10c03a', // 绿色
        '#f04c23', // 红色
        '#9b30ff', // 紫色
        '#ff7d00', // 橙色
        '#00b4c5', // 青色
      ];
      
      const charCode = nickname.charCodeAt(0);
      return colors[charCode % colors.length];
    },
    
    getSubjectColor(subject) {
      const colorMap = {
        '语文': 'red',
        '数学': 'blue',
        '英语': 'green',
        '物理': 'purple',
        '化学': 'orange',
        '生物': 'cyan',
        '历史': 'brown',
        '地理': 'lime',
        '政治': 'pink',
      };
      return colorMap[subject] || 'default';
    },
  },
};
</script>

<style scoped>
.child-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.child-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.child-card-header {
  transition: background-color 0.3s ease;
}

.child-card-actions {
  background-color: rgba(0, 0, 0, 0.01);
}

.subject-item {
  transition: all 0.3s ease;
}

.subject-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 暗黑模式适配 */
.dark .child-card {
  background-color: rgba(30, 30, 30, 0.8);
}

.dark .child-card-actions {
  background-color: rgba(255, 255, 255, 0.02);
}
</style>

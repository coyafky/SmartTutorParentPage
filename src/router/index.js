import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user'
const routes = [
  {
    path: '/login',
    component: () => import('../views/Login.vue'),
    meta: {
      showNav: false,
    },
  },
  {
    path: '/register',
    component: () => import('../views/Register.vue'),
    meta: {
      showNav: false,
    },
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      showNav: true, // 显示导航栏
      requiresAuth: true, // 需要登录
    },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/ParentProfile.vue'),
    meta: {
      showNav: true,
      requiresAuth: true,
    },
  },
  {
    path: '/post',
    name: 'Post',
    component: () => import('../views/Post.vue'),
    meta: {
      showNav: true,
      requiresAuth: true,
    },
  },
  {
    path: '/my-posts',
    name: 'MyPosts',
    component: () => import('../views/MyPosts.vue'),
    meta: {
      showNav: true,
      requiresAuth: true,
    },
  },
  {
    path: '/teachers',
    name: 'Teachers',
    component: () => import('../views/Teachers.vue'),
    meta: {
      showNav: true,
      requiresAuth: true,
    },
  },
  {
    path: '/contact-tutor/:id',
    name: 'ContactTutor',
    component: () => import('../views/ContactTutor.vue'),
    meta: {
      showNav: true,
      requiresAuth: true,
    },
  },
  {
    path: '/messages',
    name: 'MessageCenter',
    component: () => import('../views/MessageCenter.vue'),
    meta: {
      showNav: true,
      requiresAuth: true,
    },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 获取userStore实例
  const userStore = useUserStore()

  // 需要认证且未登录
  if (to.meta.requiresAuth && !userStore.token) {
    next('/login')
    return
  }

  // 已登录访问登录页
  if (to.path === '/login' && userStore.token) {
    next('/home')
    return
  }

  next()
})

export default router

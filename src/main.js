import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ArcoVue from '@arco-design/web-vue'
// 额外引入图标库
import ArcoVueIcon from '@arco-design/web-vue/es/icon'
import App from './App.vue'
import router from './router'
import '@arco-design/web-vue/dist/arco.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ArcoVue)
// 注册图标库组件
app.use(ArcoVueIcon)
app.mount('#app')
